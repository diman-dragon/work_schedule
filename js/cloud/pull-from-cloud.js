/* cloud/pull-from-cloud.js
 * Загрузка данных из облака с защитой от потери данных.
 */
async function pullFromCloud(){
  cloudFileId = await driveFindFile();
  if(!cloudFileId) return; // на Диске ещё ничего нет — первая синхронизация
  const encrypted = await driveDownloadFile(cloudFileId);
  const remote = await decryptFromCloud(encrypted, cloudPassword);

  const localUpdatedAt = APP.updatedAt || 0;
  const remoteUpdatedAt = remote.updatedAt || 0;
  const localFilled = countFilledDays(DATA);
  const remoteFilled = countFilledDays(remote.months);

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

  rate = remote.rate; currentKey = remote.currentKey;
  DATA = remote.months || {};
  order = sanitizeOrder(remote.order, DATA);
  hiddenShiftTimes = new Set(Array.isArray(remote.hiddenShiftTimes) ? remote.hiddenShiftTimes : []);
  hiddenBuses = new Set(Array.isArray(remote.hiddenBuses) ? remote.hiddenBuses : []);
  hiddenRoutes = new Set(Array.isArray(remote.hiddenRoutes) ? remote.hiddenRoutes : []);
  APP.updatedAt = remoteUpdatedAt;
  if(!DATA[currentKey]) currentKey = ensureCurrentMonthExists();
  $('rateInput').value = rate;
  renderMonthsStrip();
  render(currentKey);
  recomputeAll();
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

  createLocalBackup('перед принудительной загрузкой из облака');

  rate = remote.rate; currentKey = remote.currentKey;
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
  persistLocalOnly();
  return countFilledDays(DATA);
}
