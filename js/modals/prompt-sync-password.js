/* modals/prompt-sync-password.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
function promptSyncPassword(message){
  document.getElementById('syncPassMessage').textContent = message || document.getElementById('syncPassMessage').textContent;
  syncPassInput.value = '';
  syncPassOverlay.classList.add('show');
  setTimeout(() => syncPassInput.focus(), 50);
  return new Promise((resolve) => { syncPassResolve = resolve; });
}
