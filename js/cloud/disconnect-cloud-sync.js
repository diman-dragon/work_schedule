/* cloud/disconnect-cloud-sync.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
function disconnectCloudSync(){
  localStorage.removeItem(CLOUD_ENABLED_KEY);
  localStorage.removeItem(CLOUD_CONSENT_GIVEN_KEY);
  cloudAccessToken = null;
  cloudTokenExpiresAt = 0;
  try{ sessionStorage.removeItem(CLOUD_TOKEN_CACHE_KEY); }catch(err){}
  cloudPassword = null;
  localStorage.removeItem(CLOUD_PASS_SESSION_KEY);
  setCloudStatus('');
  cloudSyncBtn.textContent = '☁️ Синхронизация';
  cloudDisconnectBtn.style.display = 'none';
}
