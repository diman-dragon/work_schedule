/* Advance one animation frame for animateRaw(). */
function animateRawFrame(id, now){
  const ctx = ledAnimContexts[id];
  if(!ctx) return;
  const t = Math.min(1, (now - ctx.start) / ctx.dur);
  const eased = 1 - Math.pow(1 - t, 3);
  const val = ctx.from + (ctx.to - ctx.from) * eased;
  ctx.render(val);
  if(t < 1){
    ledAnimState[id] = requestAnimationFrame(animateRawFrame.bind(null, id));
  }else{
    delete ledAnimContexts[id];
    delete ledAnimState[id];
  }
}
