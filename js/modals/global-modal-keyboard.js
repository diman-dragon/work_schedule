/* modals/global-modal-keyboard.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// ---------- КЛАВИАТУРА ДЛЯ ВСЕХ МОДАЛОК: Enter подтверждает, Escape отменяет ----------
// каждая .modal-overlay помечена data-cancel-btn / data-confirm-btn — id соответствующих кнопок
document.addEventListener('keydown', (e) => {
  // если открыто несколько оверлеев одновременно (например, фото-лайтбокс поверх
  // модалки дня), берём самый последний в разметке — он же самый верхний по
  // рисованию (position:fixed, порядок в DOM = порядок наложения), чтобы Esc/Enter
  // всегда относился к тому окну, которое реально видит пользователь
  const openOverlays = document.querySelectorAll('.modal-overlay.show');
  if(!openOverlays.length) return;
  const openOverlay = openOverlays[openOverlays.length - 1];
  if(e.key === 'Escape'){
    e.preventDefault();
    const cancelBtn = document.getElementById(openOverlay.dataset.cancelBtn);
    if(cancelBtn) cancelBtn.click();
  } else if(e.key === 'Enter'){
    // не перехватываем Enter, если его уже обработал сам элемент (кнопка, time-chip, месяц-кнопка)
    if(e.target.tagName === 'BUTTON' || (e.target.classList && e.target.classList.contains('time-chip'))) return;
    e.preventDefault();
    const confirmBtn = document.getElementById(openOverlay.dataset.confirmBtn);
    if(confirmBtn) confirmBtn.click();
  }
});
