/* recomputeDay: one application-level function per file. */
function recomputeDay(d){
  if(!d.edited) return;
  if(d.start && d.end){
    d.minutes = computeMinutes(d.start, d.end);
    d.hours = minutesToHM(d.minutes);
    d.sum = Math.round((d.minutes/60)*rate*100)/100;
  } else {
    d.minutes = null; d.hours = null; d.sum = null;
  }
}
