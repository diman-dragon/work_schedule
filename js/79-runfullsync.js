/* runFullSync: one application-level function per file. */
async function runFullSync(){
  if(!isCloudSyncActive() || cloudBusy) return;
  cloudBusy = true;
  try{
    setCloudStatus('☁️ синхронизация…');
    await pullFromCloud();
    await pushToCloud();
    setCloudStatus('☁️ синхронизировано ' + new Date().toLocaleTimeString('ru-RU', {hour:'2-digit', minute:'2-digit'}));
  }catch(err){
    console.error('Ошибка синхронизации с Google Диском', err);
    setCloudStatus('☁️ ошибка синхронизации', true);
  } finally {
    cloudBusy = false;
  }
}
