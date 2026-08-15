/* modals/sync-pass-modal.js
 * Модалка ввода пароля шифрования для облачной синхронизации.
 * Возвращает Promise<string|null>: введённый пароль, либо null при отмене.
 */
const syncPassInput = $('syncPassInput');
const syncPassMessageEl = $('syncPassMessage');
const syncPassModal = createPromiseModal({
  overlayId: 'syncPassOverlay',
  cancelBtnId: 'syncPassCancelBtn',
  okBtnId: 'syncPassOkBtn',
  focusId: 'syncPassInput',
  cancelValue: null,
  okValue: () => syncPassInput.value || null,
});

function promptSyncPassword(message){
  if(message) syncPassMessageEl.textContent = message;
  syncPassInput.value = '';
  return syncPassModal.open();
}
