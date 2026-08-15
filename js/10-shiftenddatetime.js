/* shiftEndDateTime: one application-level function per file. */
function shiftEndDateTime(d){
  if(!d.start || !d.end) return null;
  const base = parseDate(d.date);
  const s = timeToMin(d.start), e = timeToMin(d.end);
  const dayOffset = (e <= s) ? 1 : 0;
  return new Date(base.getFullYear(), base.getMonth(), base.getDate()+dayOffset, Math.floor(e/60), e%60);
}
