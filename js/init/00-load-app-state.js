/* init/00-load-app-state.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// ---------- ЗАГРУЗКА СОХРАНЁННЫХ ДАННЫХ ----------
// При старте пытаемся восстановить данные из localStorage (сохраняются автоматически
// между сессиями). Если ничего не сохранено — стартуем пустыми, историю можно
// загрузить кнопкой "Загрузить" (JSON-файл).
const STORAGE_KEY = 'workScheduleData_v1';
const DATA_SCHEMA_VERSION = 2;
const BACKUP_KEY = 'workScheduleBackup_v1';
let APP = { rate: 700, currentKey: null, order: [], months: {}, theme: 'dark' };
let HAS_LOCAL_DATA = false;

// Раньше здесь только проверялось, что JSON вообще распарсился — если сам файл
// был синтаксически валиден, но структурно повреждён (не тот тип у months/order,
// половина полей отсутствует после сбоя записи и т.п.), это тихо принималось
// как есть, и приложение могло упасть уже дальше, в recomputeAll()/render().
// Теперь структура проверяется той же функцией, что и при импорте JSON-файла,
// а при повреждении данных автоматически подставляется последний локальный
// бэкап вместо падения приложения.
function isStructurallyValidApp(saved){
  if(!saved || typeof saved !== 'object') return false;
  if(saved.months === undefined) return true; // совсем пустой/новый профиль — это нормально
  try{
    validateLoadedData({ months: saved.months, order: Array.isArray(saved.order) ? saved.order : [] });
    return true;
  }catch(err){
    return false;
  }
}

try{
  const savedRaw = localStorage.getItem(STORAGE_KEY);
  if(savedRaw){
    const saved = JSON.parse(savedRaw);
    if(isStructurallyValidApp(saved)){
      HAS_LOCAL_DATA = true;
      APP = Object.assign(APP, saved);
      if(!APP.schemaVersion) APP.schemaVersion = 1;
    } else {
      console.error('Сохранённые данные повреждены (не прошли структурную проверку), пробуем локальный бэкап');
      let restored = false;
      try{
        const backupRaw = localStorage.getItem(BACKUP_KEY);
        if(backupRaw){
          const backup = JSON.parse(backupRaw);
          // createLocalBackup() хранит поля плоско (rate/currentKey/order/months/...),
          // без обёртки — то же самое, что и структура APP, просто без "лишних" полей
          // вроде theme/updatedAt, которым в APP и так есть безопасные значения по умолчанию
          if(isStructurallyValidApp(backup)){
            HAS_LOCAL_DATA = true;
            APP = Object.assign(APP, backup);
            if(!APP.schemaVersion) APP.schemaVersion = 1;
            restored = true;
          }
        }
      }catch(backupErr){ /* бэкап тоже не читается — ниже стартуем с чистого листа */ }
      // повреждённую копию не трогаем молча — сохраняем её под отдельным ключом,
      // чтобы данные можно было попытаться спасти вручную, а не потерять совсем
      try{ localStorage.setItem(STORAGE_KEY + '_corrupted_' + Date.now(), savedRaw); }catch(e){}
      // showToast() определяется одним из последних скриптов — на этот момент при
      // самом первом старте страницы она может быть ещё не загружена, поэтому
      // откладываем вызов до конца текущего цикла событий (к этому моменту все
      // скрипты уже гарантированно выполнены)
      setTimeout(() => {
        if(typeof showToast === 'function'){
          showToast(restored
            ? '⚠️ Сохранённые данные были повреждены — восстановлено из последнего локального бэкапа'
            : '⚠️ Сохранённые данные повреждены, бэкапа нет — начато с чистого состояния. Повреждённая копия сохранена отдельно на случай ручного восстановления');
        }
      }, 0);
    }
  }
}catch(err){
  console.error('Не удалось прочитать сохранённые данные', err);
}
