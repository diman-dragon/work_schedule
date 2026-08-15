/* cloud/pull-from-cloud.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// ---- логика синхронизации ----
async function pullFromCloud(){
  cloudFileId = await driveFindFile();
  if(!cloudFileId) return; // на Диске ещё ничего нет — это первая синхронизация с этого аккаунта
  const encrypted = await driveDownloadFile(cloudFileId);
  const remote = await decryptFromCloud(encrypted, cloudPassword);
  const localUpdatedAt = APP.updatedAt || 0;
  const remoteUpdatedAt = remote.updatedAt || 0;
  if(remoteUpdatedAt > localUpdatedAt){
    // облачная версия свежее — подтягиваем её
    rate = remote.rate; currentKey = remote.currentKey;
    DATA = remote.months || {};
    order = sanitizeOrder(remote.order, DATA);
    hiddenShiftTimes = new Set(Array.isArray(remote.hiddenShiftTimes) ? remote.hiddenShiftTimes : []);
    APP.updatedAt = remoteUpdatedAt;
    if(!DATA[currentKey]) currentKey = ensureCurrentMonthExists();
    document.getElementById('rateInput').value = rate;
    renderMonthsStrip();
    render(currentKey);
    persistLocalOnly();
  }
}
