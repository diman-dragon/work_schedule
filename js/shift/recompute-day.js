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
    const workMin = computeMinutes(d.start, d.end);
    // довоз до гаража после последней остановки — не часть линии, оплачивается
    // по половине ставки, но входит в общее отработанное время (см. фото
    // туражной таблицы: рейс до 22:45 по полной, "долазак" 22:45–23:10 — по половине)
    const garageMin = Math.max(0, Number(d.garageMin) || 0);
    d.minutes = workMin + garageMin;
    d.hours = minutesToHM(d.minutes);
    d.sum = Math.round(((workMin/60)*rate + (garageMin/60)*rate*0.5)*100)/100;
  } else {
    d.minutes = null; d.hours = null; d.sum = null;
  }
}
