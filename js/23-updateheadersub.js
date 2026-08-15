/* updateHeaderSub: one application-level function per file. */
function updateHeaderSub(){
  if(!order.length){ document.getElementById('headerSub').textContent = 'НЕТ ДАННЫХ'; return; }
  const first = DATA[order[0]], last = DATA[order[order.length-1]];
  document.getElementById('headerSub').textContent =
    `${first.label.toUpperCase()} ${first.year} — ${last.label.toUpperCase()} ${last.year}`;
}
