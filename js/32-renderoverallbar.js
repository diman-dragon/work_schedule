/* renderOverallBar: one application-level function per file. */
function renderOverallBar(){
  let totalMin = 0, totalSum = 0, totalShifts = 0;
  order.forEach(k => {
    const m = DATA[k];
    totalMin += m.total_minutes || 0;
    totalSum += m.total_sum || 0;
    totalShifts += m.days.filter(d => d.start).length;
  });
  document.getElementById('overallBar').innerHTML =
    `<span>Итого за весь период</span>
     <span><b>${minutesToHM(totalMin)}</b> · <b>${totalShifts}</b> смен · <b>${fmtNum(totalSum)} дин.</b></span>`;
}
