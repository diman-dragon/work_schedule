/* cloud/pull-from-cloud.js
 * Загрузка данных из облака с защитой от потери данных.
 */

// Применяет расшифрованные облачные данные к текущему состоянию приложения.
// Общая часть для pullFromCloud() и forcePullFromCloud().
function applyRemoteData(remote){
  rate = (typeof remote.rate === 'number' && remote.rate >= 0) ? remote.rate : rate;
  currentKey = remote.currentKey;
  DATA = remote.months || {};
  order = sanitizeOrder(remote.order, DATA);
  hiddenShiftTimes = new Set(Array.isArray(remote.hiddenShiftTimes) ? remote.hiddenShiftTimes : []);
  hiddenBuses = new Set(Array.isArray(remote.hiddenBuses) ? remote.hiddenBuses : []);
  hiddenRoutes = new Set(Array.isArray(remote.hiddenRoutes) ? remote.hiddenRoutes : []);
  if(!DATA[currentKey]) currentKey = ensureCurrentMonthExists();
  $('rateInput').value = rate;
  renderMonthsStrip();
  recomputeAll();
  render(currentKey);
}

async function pullFromCloud(){
  cloudFileId = await driveFindFile();
  if(!cloudFileId) return; // на Диске ещё ничего нет — первая синхронизация
  const encrypted = await driveDownloadFile(cloudFileId);
  const remote = await decryptFromCloud(encrypted, cloudPassword);

  // Облачный файл шифруется и хранится вне контроля приложения — теоретически
  // он может быть повреждён, частично дозаписан при обрыве связи, или получен
  // от несовместимой будущей версии приложения. Раньше он применялся
  // напрямую (DATA = remote.months), без единой проверки, той же функцией,
  // что используется при импорте JSON-файла — теперь тоже.
  try{
    validateLoadedData({ months: remote.months, order: remote.order || [] });
  }catch(err){
    console.error('Данные из облака не прошли проверку структуры, синхронизация отменена', err);
    setCloudStatus('☁️ данные в облаке повреждены — синхронизация отменена, локальные данные не тронуты', true);
    return;
  }

  const localUpdatedAt = APP.updatedAt || 0;
  const remoteUpdatedAt = remote.updatedAt || 0;
  const localFilled = countFilledDays(DATA);
  const remoteFilled = countFilledDays(remote.months);

  // Сравниваем СОДЕРЖИМОЕ, а не только количество смен: одинаковое число
  // смен на двух устройствах ещё не значит одинаковые данные (см.
  // day-fingerprints.js) — раньше именно это приводило к молчаливой потере
  // данных при работе с двух устройств одновременно.
  const { onlyInA: onlyLocal, onlyInB: onlyRemote } = diffDayFingerprints(DATA, remote.months);
  const genuineConflict = onlyLocal.size > 0 && onlyRemote.size > 0;

  if(genuineConflict){
    const ok = await showConfirmModal(
      `На этом устройстве и в облаке есть разные, несовпадающие изменения ` +
      `(только здесь: ${onlyLocal.size}, только в облаке: ${onlyRemote.size}). ` +
      `Автоматически объединить их нельзя — можно либо взять версию из облака ` +
      `(тогда локальные отличия будут заменены), либо оставить как есть на этом ` +
      `устройстве и потом отправить его версию в облако кнопкой «Синхронизировать» ещё раз.`,
      'Обнаружены расхождения между устройствами',
      'Взять из облака'
    );
    if(!ok){
      setCloudStatus('☁️ оставлены локальные данные — нажмите «Синхронизировать» ещё раз, чтобы отправить их в облако', true);
      return;
    }
    createLocalBackup('перед заменой версией из облака (конфликт устройств)');
    applyRemoteData(remote);
    APP.updatedAt = remoteUpdatedAt;
    persistLocalOnly();
    APP.updatedAt = remoteUpdatedAt;
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(APP)); }catch(err){}
    return;
  }

  // Решаем не только по времени, но и по содержимому.
  // Ключевая защита: если локально пусто, а в облаке есть смены — забираем
  // облако ВСЕГДА, независимо от меток времени. Именно этот случай ломался
  // раньше: на чистом устройстве (переустановка, очистка данных браузера)
  // пустые данные получали свежую метку, облако считалось "устаревшим"
  // и не скачивалось, а потом затиралось пустотой.
  const takeRemote =
    (localFilled === 0 && remoteFilled > 0) ||
    (remoteUpdatedAt > localUpdatedAt && remoteFilled >= localFilled) ||
    (remoteUpdatedAt > localUpdatedAt && localFilled === 0);

  if(!takeRemote) return;

  createLocalBackup('перед синхронизацией из облака');
  applyRemoteData(remote);
  APP.updatedAt = remoteUpdatedAt;
  persistLocalOnly();
  APP.updatedAt = remoteUpdatedAt; // сохраняем облачную метку, а не "сейчас"
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(APP)); }catch(err){}
}

// Принудительная загрузка из облака — забирает облачную версию независимо
// от меток времени и содержимого. Нужна для восстановления данных.
async function forcePullFromCloud(){
  cloudFileId = await driveFindFile();
  if(!cloudFileId) throw new Error('В облаке нет файла с данными');
  const encrypted = await driveDownloadFile(cloudFileId);
  const remote = await decryptFromCloud(encrypted, cloudPassword);

  try{
    validateLoadedData({ months: remote.months, order: remote.order || [] });
  }catch(err){
    throw new Error('Данные в облаке повреждены (не прошли проверку структуры): ' + err.message);
  }

  createLocalBackup('перед принудительной загрузкой из облака');
  applyRemoteData(remote);
  persistLocalOnly();
  return countFilledDays(DATA);
}
