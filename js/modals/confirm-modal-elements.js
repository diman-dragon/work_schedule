/* modals/confirm-modal-elements.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// ---------- ОБЩАЯ МОДАЛКА ПОДТВЕРЖДЕНИЯ (замена системного confirm()) ----------
const confirmOverlay = document.getElementById('confirmOverlay');
const confirmTitleEl = document.getElementById('confirmTitle');
const confirmMessageEl = document.getElementById('confirmMessage');
const confirmCancelBtn = document.getElementById('confirmCancelBtn');
const confirmOkBtn = document.getElementById('confirmOkBtn');
let confirmResolve = null;
// возвращает Promise<boolean>: true если пользователь подтвердил, false — отменил
