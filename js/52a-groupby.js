/* Group day records by a field for statistics. */
function groupBy(allDays, field){
  const map = {};
  allDays.forEach(d => {
    const key = (d[field] || '').trim();
    if(!key) return;
    if(!map[key]) map[key] = { label:key, count:0, sum:0, minutes:0 };
    map[key].count++;
    map[key].sum += (d.sum || 0);
    map[key].minutes += (d.minutes || 0);
  });
  return Object.values(map).sort((a,b) => b.count - a.count).slice(0, 12);
}
