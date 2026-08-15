/* charts/build-charts.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
function buildCharts(stats){
  const col = chartColors();
  destroyCharts();
  // раньше здесь не задавался шрифт по умолчанию — Chart.js подставлял свой ('Helvetica Neue' и т.п.),
  // из-за чего подписи осей/легенд/тултипов визуально выбивались из общего нативного стиля страницы
  if(typeof Chart !== 'undefined'){
    Chart.defaults.font.family = cssVar('--font-ui');
    Chart.defaults.color = col.text;
  }
  const dl = (formatter, color, align, anchor) => ({
    display:true, color: color || col.text, font:{ size:10, weight:'700', family: cssVar('--font-ui') },
    formatter, align: align || 'end', anchor: anchor || 'end', offset:2
  });

  charts.hours = new Chart(document.getElementById('chartHours'), {
    type:'bar',
    data:{ labels: stats.monthly.map(m=>m.label), datasets:[{ label:'Часы', data: stats.monthly.map(m=>Math.round(m.minutes/60*10)/10), backgroundColor: col.accent+"cc", borderRadius:5, datalabels: dl(v=>hoursLabel(v), col.accent) }] },
    options: baseOptions()
  });
  charts.earnings = new Chart(document.getElementById('chartEarnings'), {
    type:'bar',
    data:{ labels: stats.monthly.map(m=>m.label), datasets:[{ label:'Заработок, дин.', data: stats.monthly.map(m=>m.sum), backgroundColor: col.teal+"cc", borderRadius:5, datalabels: dl(v=>moneyLabel(v), col.teal) }] },
    options: baseOptions()
  });
  const step = Math.max(1, Math.floor(stats.cumulative.length/30));
  const sampled = stats.cumulative.filter((_,i) => i % step === 0 || i === stats.cumulative.length-1);
  charts.cumulative = new Chart(document.getElementById('chartCumulative'), {
    type:'line',
    data:{ labels: sampled.map(c=>c.date.slice(0,5)), datasets:[{ label:'Накопительно, дин.', data: sampled.map(c=>c.value), borderColor: col.accent, backgroundColor: col.accent+"33", fill:true, tension:0.25, pointRadius:2, pointBackgroundColor: col.accent,
      datalabels: { display: (ctx)=> ctx.dataIndex === sampled.length-1, color: col.accent, font:{size:11,weight:'700'}, formatter: v=>moneyLabel(v), align:'top', anchor:'end' } }] },
    options: baseOptions()
  });
  const wdColors = stats.byWeekday.map(w => w.weekend ? col.weekend : col.workday);
  charts.weekdayCount = new Chart(document.getElementById('chartWeekdayCount'), {
    type:'bar',
    data:{ labels: stats.byWeekday.map(w=>w.weekday), datasets:[{ label:'Смен', data: stats.byWeekday.map(w=>w.count), backgroundColor: wdColors.map(c=>c+"cc"), borderRadius:5, datalabels: dl(v=>v, col.text) }] },
    options: baseOptions()
  });
  charts.weekdayAvg = new Chart(document.getElementById('chartWeekdayAvg'), {
    type:'bar',
    data:{ labels: stats.byWeekday.map(w=>w.weekday), datasets:[{ label:'Средняя длительность, ч', data: stats.byWeekday.map(w=>Math.round(w.avgMinutes/60*10)/10), backgroundColor: wdColors.map(c=>c+"cc"), borderRadius:5, datalabels: dl(v=>hoursLabel(v), col.text) }] },
    options: baseOptions()
  });
  charts.ratio = new Chart(document.getElementById('chartRatio'), {
    type:'doughnut',
    data:{ labels:['Рабочих','Выходных'], datasets:[{ data:[stats.totalShifts, stats.offDays], backgroundColor:[col.accent, col.grid], borderWidth:0,
      datalabels:{ display:true, color: col.surface, font:{size:13,weight:'700'}, formatter:v=>v } }] },
    options: baseOptions({ scales:undefined, plugins:{ legend:{ position:'bottom', labels:{ color: col.text } }, datalabels:{display:false} } })
  });
  charts.weekdayEarnings = new Chart(document.getElementById('chartWeekdayEarnings'), {
    type:'bar',
    data:{ labels: stats.byWeekday.map(w=>w.weekday), datasets:[{ label:'Средний заработок, дин.', data: stats.byWeekday.map(w=>Math.round(w.avgSum)), backgroundColor: wdColors.map(c=>c+"cc"), borderRadius:5, datalabels: dl(v=>moneyLabel(v), col.text) }] },
    options: baseOptions()
  });
  charts.weekendSplit = new Chart(document.getElementById('chartWeekendSplit'), {
    type:'doughnut',
    data:{ labels:['Будни','Выходные'], datasets:[{ data:[Math.round(stats.weekendVsWorkday.workdaySum), Math.round(stats.weekendVsWorkday.weekendSum)], backgroundColor:[col.workday, col.weekend], borderWidth:0,
      datalabels:{ display:true, color: col.surface, font:{size:12,weight:'700'}, formatter:v=>moneyLabel(v) } }] },
    options: baseOptions({ scales:undefined, plugins:{ legend:{ position:'bottom', labels:{ color: col.text } }, datalabels:{display:false} } })
  });
  charts.top5 = new Chart(document.getElementById('chartTop5'), {
    type:'bar',
    data:{ labels: stats.top5.map(d=>d.date.slice(0,5)), datasets:[{ label:'Заработок, дин.', data: stats.top5.map(d=>d.sum), backgroundColor: stats.top5.map(d=>(d.weekend?col.weekend:col.workday)+"cc"), borderRadius:5, datalabels: dl(v=>moneyLabel(v), col.text) }] },
    options: baseOptions({ indexAxis:'y' })
  });
  charts.shiftBuckets = new Chart(document.getElementById('chartShiftBuckets'), {
    type:'bar',
    data:{ labels: stats.shiftBuckets.map(b=>b.label), datasets:[{ label:'Смен', data: stats.shiftBuckets.map(b=>b.count), backgroundColor: col.accent+"cc", borderRadius:5, datalabels: dl(v=>v, col.accent) }] },
    options: baseOptions()
  });
  charts.weeklyTrend = new Chart(document.getElementById('chartWeeklyTrend'), {
    type:'line',
    data:{ labels: stats.weeklyTrend.map(w=>w.week), datasets:[{ label:'Часы за неделю', data: stats.weeklyTrend.map(w=>Math.round(w.minutes/60*10)/10), borderColor: col.teal, backgroundColor: col.teal+"33", fill:true, tension:0.3, pointRadius:3, pointBackgroundColor: col.teal,
      datalabels: dl(v=>hoursLabel(v), col.teal, 'top', 'end') }] },
    options: baseOptions()
  });
  charts.shiftTimes = new Chart(document.getElementById('chartShiftTimes'), {
    type:'bar',
    data:{ labels: stats.byShiftTime.map(s=>s.label), datasets:[{ label:'Смен', data: stats.byShiftTime.map(s=>s.count), backgroundColor: col.accent+"cc", borderRadius:5, datalabels: dl(v=>v, col.accent) }] },
    options: baseOptions({ indexAxis:'y' })
  });
  charts.startHour = new Chart(document.getElementById('chartStartHour'), {
    type:'bar',
    data:{ labels: stats.byStartHour.map(h=>h.hour), datasets:[{ label:'Смен', data: stats.byStartHour.map(h=>h.count), backgroundColor: col.teal+"cc", borderRadius:5, datalabels: dl(v=>v, col.teal) }] },
    options: baseOptions()
  });
  if(stats.byBus.length){
    charts.byBus = new Chart(document.getElementById('chartByBus'), {
      type:'bar',
      data:{ labels: stats.byBus.map(b=>b.label), datasets:[{ label:'Смен', data: stats.byBus.map(b=>b.count), backgroundColor: col.accent+"cc", borderRadius:5, datalabels: dl(v=>v, col.accent) }] },
      options: baseOptions({ indexAxis:'y' })
    });
    charts.byBusEarn = new Chart(document.getElementById('chartByBusEarn'), {
      type:'bar',
      data:{ labels: stats.byBus.map(b=>b.label), datasets:[{ label:'Заработок, дин.', data: stats.byBus.map(b=>Math.round(b.sum)), backgroundColor: col.teal+"cc", borderRadius:5, datalabels: dl(v=>moneyLabel(v), col.teal) }] },
      options: baseOptions({ indexAxis:'y' })
    });
  }
  if(stats.byRoute.length){
    charts.byRoute = new Chart(document.getElementById('chartByRoute'), {
      type:'bar',
      data:{ labels: stats.byRoute.map(r=>r.label), datasets:[{ label:'Смен', data: stats.byRoute.map(r=>r.count), backgroundColor: col.accent+"cc", borderRadius:5, datalabels: dl(v=>v, col.accent) }] },
      options: baseOptions({ indexAxis:'y' })
    });
    charts.byRouteEarn = new Chart(document.getElementById('chartByRouteEarn'), {
      type:'bar',
      data:{ labels: stats.byRoute.map(r=>r.label), datasets:[{ label:'Заработок, дин.', data: stats.byRoute.map(r=>Math.round(r.sum)), backgroundColor: col.teal+"cc", borderRadius:5, datalabels: dl(v=>moneyLabel(v), col.teal) }] },
      options: baseOptions({ indexAxis:'y' })
    });
  }
}
