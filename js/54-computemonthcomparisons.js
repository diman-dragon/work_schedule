/* computeMonthComparisons: one application-level function per file. */
function computeMonthComparisons(){
  const rows = [];
  for(let i=1;i<order.length;i++){
    const cur = DATA[order[i]], prev = DATA[order[i-1]];
    const curSum = cur.total_sum || 0, prevSum = prev.total_sum || 0;
    const curMin = cur.total_minutes || 0, prevMin = prev.total_minutes || 0;
    const deltaSum = curSum - prevSum;
    const deltaPct = prevSum ? (deltaSum / prevSum * 100) : (curSum ? 100 : 0);
    const deltaHours = (curMin - prevMin) / 60;
    rows.push({
      label: cur.label + " '" + String(cur.year).slice(2),
      prevLabel: prev.label + " '" + String(prev.year).slice(2),
      sum: curSum, deltaSum, deltaPct, deltaHours
    });
  }
  return rows;
}
