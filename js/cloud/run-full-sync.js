/* cloud/run-full-sync.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// Синхронизация НЕ идёт постоянным фоном. Она запускается только:
//  1) при открытии приложения — один раз подтягиваем свежие данные (pullFromCloud в tryResumeCloudSync)
//  2) по нажатию кнопки «☁️ Синхронизация» — полный цикл: сначала забрать, потом отправить
//  3) при сохранении конкретного дня в карточке — лёгкий пуш только что изменённых данных
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
