/* data/persist-local-only.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// Сохраняет текущее состояние (график, ставку, тему) в localStorage —
// вызывается после каждого изменения данных.
function persistLocalOnly(){
  try{
    APP = { schemaVersion: DATA_SCHEMA_VERSION, rate, currentKey, order, months: DATA, theme: document.documentElement.getAttribute('data-theme') || 'dark', hiddenShiftTimes: Array.from(hiddenShiftTimes), updatedAt: APP.updatedAt };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(APP));
  }catch(err){
    console.error('Не удалось сохранить данные в localStorage', err);
  }
}
