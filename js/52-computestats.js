/* computeStats: one application-level function per file. */
function computeStats(){
  const allDays = [];
  order.forEach(key => {
    const m = DATA[key];
    m.days.forEach(d => {
      if(d.start){
        allDays.push({ ...d, monthKey: key, monthLabel: m.label, year: m.year, dateObj: parseDate(d.date) });
      }
    });
  });
  allDays.sort((a,b) => a.dateObj - b.dateObj);

  const totalMinutes = allDays.reduce((s,d) => s + (d.minutes||0), 0);
  const totalSum = allDays.reduce((s,d) => s + (d.sum||0), 0);
  const totalShifts = allDays.length;
  const avgShiftMin = totalShifts ? totalMinutes/totalShifts : 0;
  const avgDailyEarn = totalShifts ? totalSum/totalShifts : 0;
  const effectiveRate = totalMinutes ? (totalSum/(totalMinutes/60)) : 0;

  let bestDay = null;
  allDays.forEach(d => { if(!bestDay || d.sum > bestDay.sum) bestDay = d; });

  const monthly = order.map(key => {
    const m = DATA[key];
    const worked = m.days.filter(d => d.start).length;
    return { key, label: m.label + " '" + String(m.year).slice(2), minutes: m.total_minutes||0, sum: m.total_sum||0, shifts: worked };
  });

  let bestMonth = null;
  monthly.forEach(mo => { if(!bestMonth || mo.sum > bestMonth.sum) bestMonth = mo; });

  const isWeekendWd = wd => wd === 'Суббота' || wd === 'Воскресенье';

  const byWeekday = WEEKDAYS_ORDER.map((wd, i) => {
    const days = allDays.filter(d => d.weekday === wd);
    const min = days.reduce((s,d) => s + (d.minutes||0), 0);
    const sum = days.reduce((s,d) => s + (d.sum||0), 0);
    return { weekday: WEEKDAYS_SHORT[i], count: days.length, avgMinutes: days.length ? min/days.length : 0,
             avgSum: days.length ? sum/days.length : 0, weekend: isWeekendWd(wd) };
  });

  let running = 0;
  const cumulative = allDays.map(d => { running += d.sum; return { date: d.date, value: Math.round(running*100)/100 }; });

  const totalDaysInPeriod = order.reduce((s,key) => s + DATA[key].days.length, 0);
  const offDays = totalDaysInPeriod - totalShifts;

  // выходные vs будни: сумма и часы
  const weekendDays = allDays.filter(d => isWeekendWd(d.weekday));
  const workdayDays = allDays.filter(d => !isWeekendWd(d.weekday));
  const weekendVsWorkday = {
    weekendSum: weekendDays.reduce((s,d)=>s+(d.sum||0),0),
    workdaySum: workdayDays.reduce((s,d)=>s+(d.sum||0),0),
    weekendMin: weekendDays.reduce((s,d)=>s+(d.minutes||0),0),
    workdayMin: workdayDays.reduce((s,d)=>s+(d.minutes||0),0),
    weekendCount: weekendDays.length, workdayCount: workdayDays.length
  };

  // топ-5 смен по заработку
  const top5 = [...allDays].sort((a,b)=>b.sum-a.sum).slice(0,5)
    .map(d => ({ date: d.date, sum: d.sum, weekend: isWeekendWd(d.weekday) }));

  // распределение по длительности смены
  const bucketDefs = [ [0,4,'до 4ч'], [4,6,'4–6ч'], [6,8,'6–8ч'], [8,10,'8–10ч'], [10,Infinity,'10ч+'] ];
  const shiftBuckets = bucketDefs.map(([lo,hi,label]) => ({
    label, count: allDays.filter(d => { const h=(d.minutes||0)/60; return h>=lo && h<hi; }).length
  }));

  // недельная динамика (часы по неделям)
  const weekMap = {};
  allDays.forEach(d => {
    const wk = isoWeekKey(d.dateObj);
    if(!weekMap[wk]) weekMap[wk] = { minutes:0, sum:0 };
    weekMap[wk].minutes += (d.minutes||0);
    weekMap[wk].sum += (d.sum||0);
  });
  const weeklyTrend = Object.keys(weekMap).sort().map(wk => ({ week: wk.split('-W')[1]+' нед.', minutes: weekMap[wk].minutes, sum: weekMap[wk].sum }));

  // статистика по автобусам и маршрутам (только там, где эти поля заполнены)
  const byBus = groupBy(allDays, 'bus');
  const byRoute = groupBy(allDays, 'route');

  // частота конкретных пар "начало–конец" смены — какие времена смен встречаются чаще всего
  const shiftTimeMap = {};
  allDays.forEach(d => {
    if(!d.start || !d.end) return;
    const key = d.start + '–' + d.end;
    if(!shiftTimeMap[key]) shiftTimeMap[key] = { label:key, count:0, sum:0 };
    shiftTimeMap[key].count++; shiftTimeMap[key].sum += (d.sum||0);
  });
  const byShiftTime = Object.values(shiftTimeMap).sort((a,b) => b.count - a.count).slice(0, 10);

  // распределение смен по часу начала (0–23) — когда чаще всего стартуют смены
  const startHourCounts = new Array(24).fill(0);
  allDays.forEach(d => { if(d.start){ startHourCounts[parseInt(d.start.split(':')[0],10)]++; } });
  const byStartHour = startHourCounts.map((count, h) => ({ hour: String(h).padStart(2,'0')+':00', count })).filter(h => h.count > 0);

  return { totalMinutes, totalSum, totalShifts, avgShiftMin, avgDailyEarn, effectiveRate,
           bestDay, monthly, bestMonth, byWeekday, cumulative, totalDaysInPeriod, offDays,
           weekendVsWorkday, top5, shiftBuckets, weeklyTrend, byBus, byRoute, byShiftTime, byStartHour };
}
