/* cloud/connect-cloud-sync.js
 * Первичное подключение синхронизации на этом устройстве (по кнопке).
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
    setCloudStatusOk('☁️ синхронизировано · ' + (formatLastSyncTime() || ''));
    cloudSyncBtn.textContent = '🔄 Синхронизировать';
    cloudDisconnectBtn.style.display = '';
  }catch(err){
    console.error('Не удалось подключить синхронизацию', err);
    if(err && err.message && err.message.includes('OPERATION_FAILED')){
      // пароль не подошёл — сбрасываем его, чтобы при следующем нажатии
      // приложение спросило пароль заново, а не молча падало с той же ошибкой
      cloudPassword = null;
      localStorage.removeItem(CLOUD_PASS_SESSION_KEY);
    }
    setCloudStatus('☁️ ' + describeCloudError(err), true);
  } finally {
    cloudBusy = false;
  }
}
