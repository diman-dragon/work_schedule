/* shift/recompute-day.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// recompute derived fields (minutes/hours/sum) for a single day based on start/end + rate.
// IMPORTANT: only days the user has actually edited (d.edited === true) get recalculated
// against the live rate. Original data loaded from the file keeps its numbers exactly as
// they were originally calculated, regardless of rate changes.
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
