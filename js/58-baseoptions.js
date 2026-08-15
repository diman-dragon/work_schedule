/* baseOptions: one application-level function per file. */
function baseOptions(extra){
  const col = chartColors();
  return Object.assign({
    responsive:true, maintainAspectRatio:false,
    plugins:{
      legend:{ labels:{ color: col.text } },
      tooltip:{ backgroundColor: col.grid, titleColor: col.text, bodyColor: col.text },
      datalabels:{ display:false }
    },
    scales:{ x:{ ticks:{ color: col.text }, grid:{ color: col.grid } }, y:{ ticks:{ color: col.text }, grid:{ color: col.grid } } }
  }, extra || {});
}
