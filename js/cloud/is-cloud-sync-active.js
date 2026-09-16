/* cloud/is-cloud-sync-active.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
function isCloudSyncActive(){
  return localStorage.getItem(CLOUD_ENABLED_KEY) === '1' && !!cloudAccessToken && !!cloudPassword;
}
