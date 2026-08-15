/* promptSyncPassword: one application-level function per file. */
function promptSyncPassword(message){
  document.getElementById('syncPassMessage').textContent = message || document.getElementById('syncPassMessage').textContent;
  syncPassInput.value = '';
  syncPassOverlay.classList.add('show');
  setTimeout(() => syncPassInput.focus(), 50);
  return new Promise((resolve) => { syncPassResolve = resolve; });
}
