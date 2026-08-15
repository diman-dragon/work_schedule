/* closeConfirmModal: one application-level function per file. */
function closeConfirmModal(result){
  confirmOverlay.classList.remove('show');
  if(confirmResolve){ const r = confirmResolve; confirmResolve = null; r(result); }
}
