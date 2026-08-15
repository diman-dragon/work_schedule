/* stats/render-stat-cards.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
function renderStatCards(stats){
  const wrap = $('statCards');
  const cards = [
    { label: 'Всего отработано', value: minutesToHM(stats.totalMinutes), sub: stats.totalShifts + ' смен' },
    { label: 'Общий заработок', value: fmtNum(stats.totalSum) + ' дин.', sub: 'за весь период' },
    { label: 'Средняя смена', value: minutesToHM(stats.avgShiftMin), sub: fmtNum(stats.avgDailyEarn) + ' дин./смену' },
    { label: 'Средняя ставка', value: fmtNum(stats.effectiveRate) + ' дин./ч', sub: 'фактическая, по данным' },
    { label: 'Лучший месяц', value: stats.bestMonth ? stats.bestMonth.label : '—', sub: stats.bestMonth ? fmtNum(stats.bestMonth.sum) + ' дин.' : '' },
    { label: 'Лучшая смена', value: stats.bestDay ? fmtNum(stats.bestDay.sum) + ' дин.' : '—', sub: stats.bestDay ? stats.bestDay.date : '' },
    { label: 'Рабочих / выходных', value: stats.totalShifts + ' / ' + stats.offDays, sub: 'дней в периоде: ' + stats.totalDaysInPeriod },
    { label: 'Заработок в выходные', value: fmtNum(stats.weekendVsWorkday.weekendSum) + ' дин.', sub: stats.weekendVsWorkday.weekendCount + ' смен в выходные' },
    { label: 'Лучший часовой доход', value: stats.bestDay && stats.bestDay.minutes ? fmtNum(stats.bestDay.sum / (stats.bestDay.minutes/60)) + ' дин./ч' : '—', sub: stats.bestDay ? stats.bestDay.date : '' },
    { label: 'Средняя неделя', value: stats.weeklyTrend.length ? minutesToHM(stats.weeklyTrend.reduce((s,w)=>s+w.minutes,0)/stats.weeklyTrend.length) : '—', sub: 'часов в неделю' },
  ];
  wrap.innerHTML = cards.map(c => `
    <div class="stat-card">
      <div class="s-label">${c.label}</div>
      <div class="s-value">${c.value}</div>
      <div class="s-sub">${c.sub}</div>
    </div>`).join('');
}
