/* cloud/try-resume-cloud-sync.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
(async function tryResumeCloudSync(){
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
    recordLastSyncTime();
    setCloudStatusOk('☁️ подключено · ' + (formatLastSyncTime() || ''));
  }catch(err){
    setCloudStatus('☁️ нажмите, чтобы подключиться');
  }
})();
