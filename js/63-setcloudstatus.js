/* setCloudStatus: one application-level function per file. */
function setCloudStatus(text, isError){
  cloudSyncStatus.textContent = text || '';
  cloudSyncStatus.style.color = isError ? 'var(--negative, #e5484d)' : '';
}
