/* Restore an existing Google Drive sync session. */
async function tryResumeCloudSync(){
  if(localStorage.getItem(CLOUD_ENABLED_KEY) !== '1') return;
  cloudDisconnectBtn.style.display = '';
  cloudSyncBtn.textContent = '🔄 Синхронизировать';
  try{
    setCloudStatus('☁️ подключение…');
    await requestCloudToken(false);
    if(!cloudPassword){
      setCloudStatus('☁️ введите пароль для синхронизации');
      return;
    }
    await pullFromCloud();
    setCloudStatus('☁️ подключено');
  }catch(err){
    setCloudStatus('☁️ нажмите, чтобы подключиться');
  }
}
