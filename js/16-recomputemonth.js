/* recomputeMonth: one application-level function per file. */
function recomputeMonth(key){
  const m = DATA[key];
  let totalMin = 0, totalSum = 0;
  m.days.forEach(d => {
    recomputeDay(d);
    d.pending = !!(d.start && d.end && isShiftPending(d));
    // пока смена не закончилась — она не входит ни в часы, ни в доход месяца
    if(d.minutes && !d.pending){ totalMin += d.minutes; totalSum += d.sum; }
  });
  m.total_minutes = totalMin;
  m.total_sum = Math.round(totalSum*100)/100;
}
