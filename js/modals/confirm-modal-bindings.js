/* modals/confirm-modal-bindings.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
confirmCancelBtn.addEventListener('click', () => closeConfirmModal(false));
confirmOkBtn.addEventListener('click', () => closeConfirmModal(true));
confirmOverlay.addEventListener('click', (e) => { if(e.target === confirmOverlay) closeConfirmModal(false); });
