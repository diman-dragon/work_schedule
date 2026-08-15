/* modals/close-confirm-modal.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
function closeConfirmModal(result){
  confirmOverlay.classList.remove('show');
  if(confirmResolve){ const r = confirmResolve; confirmResolve = null; r(result); }
}
