/* modals/show-confirm-modal.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
function showConfirmModal(message, title, okLabel){
  confirmTitleEl.textContent = title || 'Подтверждение';
  confirmMessageEl.textContent = message;
  confirmOkBtn.textContent = okLabel || 'Подтвердить';
  confirmOverlay.classList.add('show');
  setTimeout(() => confirmCancelBtn.focus(), 50);
  return new Promise((resolve) => { confirmResolve = resolve; });
}
