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
    let remember = localStorage.getItem(CLOUD_PASS_REMEMBER_KEY) === '1';
    if(!pass){
      const result = await promptSyncPassword('Данные на Google Диске хранятся зашифрованными. Введите пароль (в первый раз — придумайте его, дальше используйте всегда один и тот же).');
      if(!result){ setCloudStatus(''); cloudBusy = false; return; }
      pass = result.password;
      remember = result.remember;
    }
    cloudPassword = pass;
    // Пароль, которым шифруется весь облачный бэкап, по умолчанию хранится
    // только в sessionStorage — он переживает обновление страницы, но
    // стирается при полном закрытии вкладки/браузера. Постоянное хранение
    // в localStorage (переживает и перезапуск браузера, и перезагрузку
    // устройства) включается только явной галочкой «запомнить», потому что
    // localStorage этого origin потенциально доступен любому коду, который
    // туда получит доступ — раньше пароль лежал в localStorage всегда,
    // без возможности выбора.
    try{ sessionStorage.setItem(CLOUD_PASS_SESSION_KEY, pass); }catch(err){}
    if(remember){
      localStorage.setItem(CLOUD_PASS_SESSION_KEY, pass);
      localStorage.setItem(CLOUD_PASS_REMEMBER_KEY, '1');
    } else {
      localStorage.removeItem(CLOUD_PASS_SESSION_KEY);
      localStorage.removeItem(CLOUD_PASS_REMEMBER_KEY);
    }
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
      // пароль не подошёл — сбрасываем его везде, чтобы при следующем нажатии
      // приложение спросило пароль заново, а не молча падало с той же ошибкой
      cloudPassword = null;
      try{ sessionStorage.removeItem(CLOUD_PASS_SESSION_KEY); }catch(e){}
      localStorage.removeItem(CLOUD_PASS_SESSION_KEY);
      localStorage.removeItem(CLOUD_PASS_REMEMBER_KEY);
    }
    setCloudStatus('☁️ ' + describeCloudError(err), true);
  } finally {
    cloudBusy = false;
  }
}
