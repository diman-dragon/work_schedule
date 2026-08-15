/* destroyCharts: one application-level function per file. */
function destroyCharts(){ Object.values(charts).forEach(c => c.destroy()); charts = {}; }
