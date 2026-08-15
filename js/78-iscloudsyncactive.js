/* isCloudSyncActive: one application-level function per file. */
function isCloudSyncActive(){
  return localStorage.getItem(CLOUD_ENABLED_KEY) === '1' && !!cloudAccessToken && !!cloudPassword;
}
