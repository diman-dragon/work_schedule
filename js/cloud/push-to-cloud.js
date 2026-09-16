/* cloud/push-to-cloud.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
async function pushToCloud(){
  // updatedAt берём из APP (ставится в persistLocalOnly в момент реального
  // изменения данных), а не генерируем здесь заново — раньше метка
  // проставлялась ДО подтверждения успешной записи на Диск, и при обрыве
  // сети локальная копия начинала выглядеть "новее", чем есть на самом деле
  const payload = { schemaVersion: DATA_SCHEMA_VERSION, rate, currentKey, order, months: DATA, hiddenShiftTimes: Array.from(hiddenShiftTimes), hiddenBuses: Array.from(hiddenBuses), hiddenRoutes: Array.from(hiddenRoutes), updatedAt: APP.updatedAt || Date.now() };
  const encrypted = await encryptForCloud(payload, cloudPassword);
  if(!cloudFileId) cloudFileId = await driveFindFile();
  if(!cloudFileId) cloudFileId = await driveCreateFile(encrypted);
  else await driveUpdateFile(cloudFileId, encrypted);
}
