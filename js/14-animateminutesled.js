/* animateMinutesLed: one application-level function per file. */
function animateMinutesLed(id, toMinutes, unit){
  const el = document.getElementById(id);
  if(!el) return;
  const from = parseFloat((el.dataset.raw||'0')) || 0;
  const suffix = unit ? `<span class="led-unit">${unit}</span>` : '';
  animateRaw(id, from, toMinutes || 0, v => { el.innerHTML = minutesToHM(v) + suffix; }, 650);
  el.dataset.raw = toMinutes || 0;
}
