/* timeToMin: one application-level function per file. */
function timeToMin(t){
  const [h,m] = t.split(':').map(Number);
  return h*60+m;
}
