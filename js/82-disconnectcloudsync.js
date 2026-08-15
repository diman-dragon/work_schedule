/* disconnectCloudSync: one application-level function per file. */
function disconnectCloudSync(){
  localStorage.removeItem(CLOUD_ENABLED_KEY);
  cloudAccessToken = null;
  cloudPassword = null;
  localStorage.removeItem(CLOUD_PASS_SESSION_KEY);
  setCloudStatus('');
  cloudSyncBtn.textContent = '☁️ Синхронизация';
  cloudDisconnectBtn.style.display = 'none';
}
