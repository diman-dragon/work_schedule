/* shift/pending-shift-watcher.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// раз в минуту проверяем — не закончилась ли ещё идущая смена; если да, пересчитываем
// итоги, чтобы доход появился в статистике сам, без перезагрузки страницы
setInterval(() => {
  const m = DATA[currentKey];
  if(!m) return;
  const hadPending = m.days.some(d => d.pending);
  if(hadPending){
    recomputeMonth(currentKey);
    render(currentKey);
    persist();
  }
}, 60000);
