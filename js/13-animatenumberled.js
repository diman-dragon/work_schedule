/* animateNumberLed: one application-level function per file. */
function animateNumberLed(id, to, formatter){
  const el = document.getElementById(id);
  if(!el) return;
  const from = parseFloat((el.dataset.raw||'0')) || 0;
  const f = formatter || (v => Math.round(v).toLocaleString('ru-RU'));
  animateRaw(id, from, to || 0, v => { el.textContent = f(v); }, 650);
  el.dataset.raw = to || 0;
}
