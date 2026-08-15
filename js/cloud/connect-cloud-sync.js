/* cloud/connect-cloud-sync.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
async function connectCloudSync(){
  if(cloudBusy) return;
  cloudBusy = true;
  try{
    setCloudStatus('☁️ вход в Google…');
    await requestCloudToken(true);
    let pass = cloudPassword;
    if(!pass){
      pass = await promptSyncPassword('Данные на Google Диске хранятся зашифрованными. Введите пароль (в первый раз — придумайте его, дальше используйте всегда один и тот же).');
    }
    if(!pass){ setCloudStatus(''); cloudBusy = false; return; }
    cloudPassword = pass;
    localStorage.setItem(CLOUD_PASS_SESSION_KEY, pass);
    localStorage.setItem(CLOUD_ENABLED_KEY, '1');
    setCloudStatus('☁️ синхронизация…');
    await pullFromCloud();
    await pushToCloud();
    recordLastSyncTime();
    setCloudStatusOk('☁️ подключено · ' + (formatLastSyncTime() || ''));
    cloudSyncBtn.textContent = '🔄 Синхронизировать';
    cloudDisconnectBtn.style.display = '';
  }catch(err){
    console.error('Не удалось подключить синхронизацию', err);
    if(err && err.message && err.message.includes('OPERATION_FAILED')){
      setCloudStatus('☁️ неверный пароль или повреждён файл', true);
      cloudPassword = null;
      localStorage.removeItem(CLOUD_PASS_SESSION_KEY);
    } else {
      setCloudStatus('☁️ не удалось подключиться', true);
    }
  } finally {
    cloudBusy = false;
  }
}
