/* closeSyncPassModal: one application-level function per file. */
function closeSyncPassModal(result){
  syncPassOverlay.classList.remove('show');
  if(syncPassResolve){ const r = syncPassResolve; syncPassResolve = null; r(result); }
}
