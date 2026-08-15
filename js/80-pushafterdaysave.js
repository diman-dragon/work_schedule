/* pushAfterDaySave: one application-level function per file. */
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
