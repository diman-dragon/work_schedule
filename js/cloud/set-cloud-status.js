/* cloud/set-cloud-status.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
function setCloudStatus(text, isError){
  cloudSyncStatus.textContent = text || '';
  cloudSyncStatus.style.color = isError ? 'var(--negative, #e5484d)' : '';
}
