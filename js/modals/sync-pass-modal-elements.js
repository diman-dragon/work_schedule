/* modals/sync-pass-modal-elements.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// ---------- МОДАЛКА ВВОДА ПАРОЛЯ ШИФРОВАНИЯ (для облачной синхронизации) ----------
const syncPassOverlay = document.getElementById('syncPassOverlay');
const syncPassInput = document.getElementById('syncPassInput');
const syncPassCancelBtn = document.getElementById('syncPassCancelBtn');
const syncPassOkBtn = document.getElementById('syncPassOkBtn');
let syncPassResolve = null;
// возвращает Promise<string|null>: введённый пароль, либо null при отмене
