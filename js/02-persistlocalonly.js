/* persistLocalOnly: one application-level function per file. */
function persistLocalOnly(){
  try{
    APP = { schemaVersion: DATA_SCHEMA_VERSION, rate, currentKey, order, months: DATA, theme: document.documentElement.getAttribute('data-theme') || 'dark', hiddenShiftTimes: Array.from(hiddenShiftTimes), updatedAt: APP.updatedAt };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(APP));
  }catch(err){
    console.error('Не удалось сохранить данные в localStorage', err);
  }
}
