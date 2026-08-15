/* pushToCloud: one application-level function per file. */
async function pushToCloud(){
  const payload = { schemaVersion: DATA_SCHEMA_VERSION, rate, currentKey, order, months: DATA, hiddenShiftTimes: Array.from(hiddenShiftTimes), updatedAt: Date.now() };
  APP.updatedAt = payload.updatedAt;
  const encrypted = await encryptForCloud(payload, cloudPassword);
  if(!cloudFileId) cloudFileId = await driveFindFile();
  if(!cloudFileId) cloudFileId = await driveCreateFile(encrypted);
  else await driveUpdateFile(cloudFileId, encrypted);
}
