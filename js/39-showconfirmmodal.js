/* showConfirmModal: one application-level function per file. */
function showConfirmModal(message, title, okLabel){
  confirmTitleEl.textContent = title || 'Подтверждение';
  confirmMessageEl.textContent = message;
  confirmOkBtn.textContent = okLabel || 'Подтвердить';
  confirmOverlay.classList.add('show');
  setTimeout(() => confirmCancelBtn.focus(), 50);
  return new Promise((resolve) => { confirmResolve = resolve; });
}
