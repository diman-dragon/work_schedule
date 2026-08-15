/* ui/keyboard-month-nav.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// Keyboard month navigation when not typing.
  document.addEventListener('keydown', e => {
    const tag = (e.target?.tagName || '').toLowerCase();
    if(['input','textarea','select'].includes(tag)) return;
    if(e.key === 'ArrowLeft') moveMonth(-1);
    if(e.key === 'ArrowRight') moveMonth(1);
    if((e.key === 't' || e.key === 'т') && !e.ctrlKey && !e.metaKey){
      const key = ensureCurrentMonthExists();
      render(key);
    }
  });
