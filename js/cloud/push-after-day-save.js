/* cloud/push-after-day-save.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
async function pushAfterDaySave(){
  if(!isCloudSyncActive() || cloudBusy) return;
  try{
    setCloudStatus('☁️ сохранение…');
    await pushToCloud();
    recordLastSyncTime();
    setCloudStatusOk('☁️ синхронизировано · ' + (formatLastSyncTime() || ''));
  }catch(err){
    console.error('Ошибка синхронизации с Google Диском', err);
    setCloudStatus('☁️ ошибка синхронизации', true);
  }
}
