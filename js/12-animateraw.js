/* animateRaw: one application-level function per file. */
function animateRaw(id, from, to, render, duration){
  if(ledAnimState[id]) cancelAnimationFrame(ledAnimState[id]);
  const start = performance.now();
  const dur = duration || 650;
  ledAnimContexts[id] = { start, dur, from, to, render };
  ledAnimState[id] = requestAnimationFrame(animateRawFrame.bind(null, id));
}
