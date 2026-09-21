/* cloud/pull-from-cloud.js
 * Синхронизация с ручным разрешением конфликтов.
 */

function cloneJson(value){
  return JSON.parse(JSON.stringify(value));
}

function dayIdentity(day){
  return day && day.date ? day.date : null;
}

function normalizeDayForSync(day){
  if(!day) return null;
  return {
    date: day.date || null,
    edited: !!day.edited,
    start: day.start || null,
    end: day.end || null,
    bus: day.bus || null,
    route: day.route || null,
    photo: day.photo || null
  };
}

function daySyncEqual(a, b){
  return JSON.stringify(normalizeDayForSync(a)) === JSON.stringify(normalizeDayForSync(b));
}

function dayHasUserData(day){
  if(!day) return false;
  return !!(day.edited || day.start || day.end || day.bus || day.route || day.photo);
}

function collectDaysByDate(monthsObj){
  const map = new Map();
  if(!monthsObj || typeof monthsObj !== 'object') return map;
  for(const key of Object.keys(monthsObj)){
    const m = monthsObj[key];
    if(!m || !Array.isArray(m.days)) continue;
    for(const d of m.days){
      const id = dayIdentity(d);
      if(id) map.set(id, { monthKey: key, day: d });
    }
  }
  return map;
}

function buildMergedMonths(localMonths, remoteMonths, decisions){
  const result = cloneJson(localMonths || {});
  const localDays = collectDaysByDate(localMonths);
  const remoteDays = collectDaysByDate(remoteMonths);

  for(const [date, remoteEntry] of remoteDays){
    const localEntry = localDays.get(date);
    if(!localEntry){
      const month = result[remoteEntry.monthKey] || cloneJson(remoteMonths[remoteEntry.monthKey]);
      if(!month) continue;
      month.days = Array.isArray(month.days) ? month.days : [];
      month.days.push(cloneJson(remoteEntry.day));
      result[remoteEntry.monthKey] = month;
      continue;
    }

    if(daySyncEqual(localEntry.day, remoteEntry.day)) continue;
    if(!dayHasUserData(localEntry.day) && dayHasUserData(remoteEntry.day)){
      localEntry.day && (result[localEntry.monthKey].days[
        result[localEntry.monthKey].days.findIndex(d => d.date === date)
      ] = cloneJson(remoteEntry.day));
      continue;
    }
    if(dayHasUserData(localEntry.day) && !dayHasUserData(remoteEntry.day)) continue;

    const choice = decisions[date] || 'local';
    const targetMonth = result[localEntry.monthKey];
    const idx = targetMonth?.days?.findIndex(d => d.date === date);
    if(targetMonth && idx >= 0 && choice === 'remote'){
      targetMonth.days[idx] = cloneJson(remoteEntry.day);
    }
  }

  // Если облако содержит месяц, которого локально не было, он уже добавлен
  // через его дни; здесь также гарантируем корректную структуру пустого месяца.
  for(const key of Object.keys(remoteMonths || {})){
    if(!result[key]) result[key] = cloneJson(remoteMonths[key]);
  }

  return result;
}


function syncStateSignature(state){
  return JSON.stringify({
    rate: state.rate,
    months: state.months || {},
    hiddenShiftTimes: Array.from(state.hiddenShiftTimes || []).sort(),
    hiddenBuses: Array.from(state.hiddenBuses || []).sort(),
    hiddenRoutes: Array.from(state.hiddenRoutes || []).sort()
  });
}

function applyRemoteData(remote){
  rate = (typeof remote.rate === 'number' && remote.rate >= 0) ? remote.rate : rate;
  currentKey = remote.currentKey;
  DATA = cloneJson(remote.months || {});
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

async function downloadRemoteSnapshot(){
  cloudFileId = await driveFindFile();
  if(!cloudFileId) return null;
  const encrypted = await driveDownloadFile(cloudFileId);
  const remote = await decryptFromCloud(encrypted, cloudPassword);
  validateLoadedData({ months: remote.months, order: remote.order || [] });
  cloudLastPulledRemoteSignature = syncStateSignature(remote);
  return remote;
}

async function pullFromCloud(){
  const remote = await downloadRemoteSnapshot();
  if(!remote) return { changed: false, remoteMissing: true };

  const localDays = collectDaysByDate(DATA);
  const remoteDays = collectDaysByDate(remote.months);
  const conflicts = [];

  for(const [date, remoteEntry] of remoteDays){
    const localEntry = localDays.get(date);
    if(localEntry && !daySyncEqual(localEntry.day, remoteEntry.day) &&
       dayHasUserData(localEntry.day) && dayHasUserData(remoteEntry.day)){
      conflicts.push({ date, local: localEntry.day, remote: remoteEntry.day });
    }
  }

  // Если на локальном устройстве данных не было вообще, облачная версия
  // принимается без каких-либо попыток сравнить её с только что созданным
  // пустым месяцем.
  if(!HAS_LOCAL_DATA){
    createLocalBackup('перед первой загрузкой из облака');
    applyRemoteData(remote);
    APP.updatedAt = remote.updatedAt || Date.now();
    persistLocalOnly();
    APP.updatedAt = remote.updatedAt || Date.now();
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(APP)); }catch(err){}
    HAS_LOCAL_DATA = true;
    return { changed: true, remoteMissing: false };
  }

  let decisions = {};
  if(conflicts.length){
    const result = await showSyncConflicts(conflicts);
    if(!result){
      setCloudStatus('☁️ синхронизация отменена: конфликты не разрешены', true);
      return { changed: false, cancelled: true };
    }
    conflicts.forEach((c, i) => { decisions[c.date] = result[i] || 'local'; });
  }

  const mergedMonths = buildMergedMonths(DATA, remote.months, decisions);

  // Глобальная ставка тоже может быть изменена на двух устройствах.
  // Если она различается и обе стороны имеют локальные данные, спрашиваем отдельно.
  if(typeof remote.rate === 'number' && remote.rate !== rate){
    const useRemoteRate = await showConfirmModal(
      `Ставка на этом устройстве: ${rate}. В облаке: ${remote.rate}. Выберите, какую ставку сохранить.`,
      'Конфликт ставки',
      'Взять из облака'
    );
    if(useRemoteRate) rate = remote.rate;
  }

  DATA = mergedMonths;
  order = sanitizeOrder([...new Set([...(order || []), ...(remote.order || [])])], DATA);
  hiddenShiftTimes = new Set([...hiddenShiftTimes, ...(Array.isArray(remote.hiddenShiftTimes) ? remote.hiddenShiftTimes : [])]);
  hiddenBuses = new Set([...hiddenBuses, ...(Array.isArray(remote.hiddenBuses) ? remote.hiddenBuses : [])]);
  hiddenRoutes = new Set([...hiddenRoutes, ...(Array.isArray(remote.hiddenRoutes) ? remote.hiddenRoutes : [])]);
  if(!DATA[currentKey]) currentKey = ensureCurrentMonthExists();

  sortOrderChronologically();
  recomputeAll();
  renderMonthsStrip();
  render(currentKey);

  const localBefore = syncStateSignature({
    rate,
    months: APP.months || {},
    hiddenShiftTimes: APP.hiddenShiftTimes || [],
    hiddenBuses: APP.hiddenBuses || [],
    hiddenRoutes: APP.hiddenRoutes || []
  });
  const mergedSignature = syncStateSignature({
    rate,
    months: DATA,
    hiddenShiftTimes,
    hiddenBuses,
    hiddenRoutes
  });
  const changed = localBefore !== mergedSignature;

  if(changed){
    createLocalBackup('перед объединением локальных и облачных данных');
    APP.updatedAt = Math.max(Number(APP.updatedAt || 0), Number(remote.updatedAt || 0), Date.now());
    persistLocalOnly();
  }

  return { changed, remoteMissing: false };
}

async function forcePullFromCloud(){
  const remote = await downloadRemoteSnapshot();
  if(!remote) throw new Error('В облаке нет файла с данными');

  createLocalBackup('перед принудительной загрузкой из облака');
  applyRemoteData(remote);
  APP.updatedAt = remote.updatedAt || Date.now();
  persistLocalOnly();
  APP.updatedAt = remote.updatedAt || Date.now();
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(APP)); }catch(err){}
  HAS_LOCAL_DATA = true;
  return countFilledDays(DATA);
}
