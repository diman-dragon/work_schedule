/* data/create-local-backup.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// ---------- ЗАГРУЗКА ИЗ JSON ----------
function createLocalBackup(reason){
  try{
    const backup = {
      schemaVersion: DATA_SCHEMA_VERSION,
      backupAt: new Date().toISOString(),
      reason: reason || 'automatic',
      rate, currentKey, order, months: DATA,
      hiddenShiftTimes: Array.from(hiddenShiftTimes)
    };
    localStorage.setItem(BACKUP_KEY, JSON.stringify(backup));
    return true;
  }catch(err){
    console.warn('Не удалось создать локальный бэкап', err);
    return false;
  }
}
