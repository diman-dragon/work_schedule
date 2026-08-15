/* init/00-load-app-state.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
if(window.Chart && window.ChartDataLabels){ Chart.register(ChartDataLabels); }

// ---------- ЗАГРУЗКА СОХРАНЁННЫХ ДАННЫХ ----------
// При старте пытаемся восстановить данные из localStorage (сохраняются автоматически
// между сессиями). Если ничего не сохранено — стартуем пустыми, историю можно
// загрузить кнопкой "Загрузить" (JSON-файл).
const STORAGE_KEY = 'workScheduleData_v1';
const DATA_SCHEMA_VERSION = 2;
const BACKUP_KEY = 'workScheduleBackup_v1';
let APP = { rate: 700, currentKey: null, order: [], months: {}, theme: 'dark' };
try{
  const savedRaw = localStorage.getItem(STORAGE_KEY);
  if(savedRaw){
    const saved = JSON.parse(savedRaw);
    if(saved && typeof saved === 'object'){
      APP = Object.assign(APP, saved);
      if(!APP.schemaVersion) APP.schemaVersion = 1;
    }
  }
}catch(err){
  console.error('Не удалось прочитать сохранённые данные', err);
}
