/* ui/update-header-sub.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// ---------- HEADER SUB ----------
function updateHeaderSub(){
  if(!order.length){ document.getElementById('headerSub').textContent = 'НЕТ ДАННЫХ'; return; }
  const first = DATA[order[0]], last = DATA[order[order.length-1]];
  document.getElementById('headerSub').textContent =
    `${first.label.toUpperCase()} ${first.year} — ${last.label.toUpperCase()} ${last.year}`;
}
