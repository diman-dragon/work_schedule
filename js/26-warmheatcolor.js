/* warmHeatColor: one application-level function per file. */
function warmHeatColor(ratio){
  const low = { r:255, g:214, b:130 };  // мягкий янтарный
  const mid = { r:255, g:123, b:57 };   // насыщенный оранжевый
  const high = { r:196, g:33, b:39 };   // глубокий красный
  return ratio < 0.5 ? mixRgb(low, mid, ratio*2) : mixRgb(mid, high, (ratio-0.5)*2);
}
