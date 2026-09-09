/* data/persist-local-only.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// Сохраняет текущее состояние (график, ставку, тему) в localStorage —
// вызывается после каждого изменения данных.
function persistLocalOnly(){
  try{
    // updatedAt всегда ставится на момент реального локального изменения —
    // раньше эта метка обновлялась только при успешной отправке в облако,
    // из-за чего pullFromCloud мог посчитать свежие локальные данные
    // "устаревшими" и затереть их более старой версией с Google Диска
    // (типичная причина пропажи только что сохранённой смены).
    APP = { schemaVersion: DATA_SCHEMA_VERSION, rate, currentKey, order, months: DATA, theme: document.documentElement.getAttribute('data-theme') || 'dark', hiddenShiftTimes: Array.from(hiddenShiftTimes), updatedAt: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(APP));
  }catch(err){
    console.error('Не удалось сохранить данные в localStorage', err);
    // раньше ошибка сохранения (напр. переполнено хранилище браузера из-за
    // фото графиков) проходила молча — пользователь не понимал, почему
    // новые смены "не сохраняются"; теперь показываем явное предупреждение
    if(typeof showToast === 'function'){
      showToast('⚠️ Не удалось сохранить: не хватает места в памяти браузера. Удалите старые фото или сделайте резервную копию');
    }
  }
}
