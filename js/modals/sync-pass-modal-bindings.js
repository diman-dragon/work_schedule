/* modals/sync-pass-modal-bindings.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
syncPassCancelBtn.addEventListener('click', () => closeSyncPassModal(null));
syncPassOkBtn.addEventListener('click', () => closeSyncPassModal(syncPassInput.value || null));
syncPassOverlay.addEventListener('click', (e) => { if(e.target === syncPassOverlay) closeSyncPassModal(null); });
