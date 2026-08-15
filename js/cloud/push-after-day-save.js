/* cloud/push-after-day-save.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
async function pushAfterDaySave(){
  if(!isCloudSyncActive() || cloudBusy) return;
  try{
    setCloudStatus('☁️ сохранение…');
    await pushToCloud();
    setCloudStatus('☁️ синхронизировано ' + new Date().toLocaleTimeString('ru-RU', {hour:'2-digit', minute:'2-digit'}));
  }catch(err){
    console.error('Ошибка синхронизации с Google Диском', err);
    setCloudStatus('☁️ ошибка синхронизации', true);
  }
}
