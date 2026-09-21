/* data/create-local-backup.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// ---------- ЛОКАЛЬНЫЙ БЭКАП ----------
// вызывается автоматически перед импортом JSON, перед полной очисткой данных
// и перед применением облачной версии, плюс доступен вручную кнопкой
// "Быстрый бэкап" в меню "⋯ Данные".
//
// Хранится не один, а до BACKUP_KEEP_COUNT последних бэкапов (раньше был
// только один — каждый новый импорт/очистка/восстановление стирал
// предыдущий, и при неудачном импорте отступать было уже некуда).
const BACKUP_KEEP_COUNT = 5;
const BACKUP_LIST_KEY = 'workScheduleBackupList_v1';

function createLocalBackup(reason){
  try{
    const backup = {
      schemaVersion: DATA_SCHEMA_VERSION,
      backupAt: new Date().toISOString(),
      reason: reason || 'automatic',
      rate, currentKey, order, months: DATA,
      hiddenShiftTimes: Array.from(hiddenShiftTimes),
      hiddenBuses: Array.from(hiddenBuses),
      hiddenRoutes: Array.from(hiddenRoutes)
    };
    // случайный суффикс — чтобы два бэкапа, созданных в одну и ту же
    // миллисекунду (Date.now() совпадёт), не затёрли друг друга одним ключом
    const backupKey = BACKUP_KEY + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    localStorage.setItem(backupKey, JSON.stringify(backup));
    // тот же ключ BACKUP_KEY тоже обновляем — на него по-прежнему ссылается
    // безопасная загрузка при старте (00-load-app-state.js), чтобы не менять
    // формат самого "последнего" бэкапа
    localStorage.setItem(BACKUP_KEY, JSON.stringify(backup));

    let list = [];
    try{ list = JSON.parse(localStorage.getItem(BACKUP_LIST_KEY) || '[]'); }catch(e){ list = []; }
    if(!Array.isArray(list)) list = [];
    list.unshift(backupKey);
    while(list.length > BACKUP_KEEP_COUNT){
      const old = list.pop();
      localStorage.removeItem(old);
    }
    localStorage.setItem(BACKUP_LIST_KEY, JSON.stringify(list));
    return true;
  }catch(err){
    console.warn('Не удалось создать локальный бэкап', err);
    return false;
  }
}

// Список последних бэкапов с метаданными — для UI восстановления
// (см. data-menu-bindings.js): [{key, backupAt, reason, filledDays}, ...],
// от самого нового к самому старому.
function listLocalBackups(){
  let keys = [];
  try{ keys = JSON.parse(localStorage.getItem(BACKUP_LIST_KEY) || '[]'); }catch(e){ keys = []; }
  if(!Array.isArray(keys)) keys = [];
  const result = [];
  for(const key of keys){
    try{
      const raw = localStorage.getItem(key);
      if(!raw) continue;
      const backup = JSON.parse(raw);
      result.push({
        key,
        backupAt: backup.backupAt,
        reason: backup.reason,
        filledDays: countFilledDays(backup.months)
      });
    }catch(e){ /* повреждённый отдельный бэкап — пропускаем, остальные не трогаем */ }
  }
  return result;
}

// Восстанавливает конкретный бэкап из списка по ключу.
function restoreLocalBackup(key){
  const raw = localStorage.getItem(key);
  if(!raw) throw new Error('Бэкап не найден (возможно, уже удалён по возрасту)');
  const backup = JSON.parse(raw);
  // бэкапы, сделанные старым слиянием с облаком, могли сохранить дни не в своём
  // месяце — чиним их, иначе восстановиться из такого бэкапа было бы невозможно
  const fixed = repairLoadedData({ months: backup.months, order: backup.order || [] });
  if(fixed.repaired){ backup.months = fixed.months; backup.order = fixed.order; }
  validateLoadedData({ months: backup.months, order: backup.order || [] });
  createLocalBackup('перед восстановлением из бэкапа ' + (backup.backupAt || ''));
  rate = (typeof backup.rate === 'number' && backup.rate >= 0) ? backup.rate : rate;
  currentKey = backup.currentKey;
  DATA = backup.months || {};
  order = sanitizeOrder(backup.order, DATA);
  hiddenShiftTimes = new Set(Array.isArray(backup.hiddenShiftTimes) ? backup.hiddenShiftTimes : []);
  hiddenBuses = new Set(Array.isArray(backup.hiddenBuses) ? backup.hiddenBuses : []);
  hiddenRoutes = new Set(Array.isArray(backup.hiddenRoutes) ? backup.hiddenRoutes : []);
  if(!DATA[currentKey]) currentKey = ensureCurrentMonthExists();
  sortOrderChronologically();
  recomputeAll();
  $('rateInput').value = rate;
  render(currentKey);
  if(tabStats.classList.contains('active')) buildStats();
  persist();
}
