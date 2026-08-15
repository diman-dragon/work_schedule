/* ui/data-menu-bindings.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// Data dropdown
  const menuBtn = $('dataMenuBtn');
  const dataMenu = $('dataMenu');
  function closeDataMenu(){
    if(!dataMenu) return;
    dataMenu.classList.remove('show');
    menuBtn && menuBtn.setAttribute('aria-expanded','false');
  }
  menuBtn?.addEventListener('click', e => {
    e.stopPropagation();
    const show = !dataMenu.classList.contains('show');
    dataMenu.classList.toggle('show', show);
    menuBtn.setAttribute('aria-expanded', String(show));
  });
  document.addEventListener('click', e => {
    if(dataMenu && !dataMenu.contains(e.target) && e.target !== menuBtn) closeDataMenu();
  });
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape'){
      closeDataMenu();
      document.querySelectorAll('.modal-overlay.show').forEach(x => x.classList.remove('show'));
    }
  });
  dataMenu?.querySelectorAll('button').forEach(btn => btn.addEventListener('click', closeDataMenu));
