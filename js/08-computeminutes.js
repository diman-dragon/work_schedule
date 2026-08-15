/* computeMinutes: one application-level function per file. */
function computeMinutes(start, end){
  let s = timeToMin(start), e = timeToMin(end);
  if(e <= s) e += 24*60;
  return e - s;
}
