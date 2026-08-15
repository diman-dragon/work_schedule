/* modals/close-sync-pass-modal.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
function closeSyncPassModal(result){
  syncPassOverlay.classList.remove('show');
  if(syncPassResolve){ const r = syncPassResolve; syncPassResolve = null; r(result); }
}
