/* stats/build-stats.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
async function buildStats(){
  const stats = computeStats();
  const grid = $('chartsGrid');
  if(stats.totalShifts === 0){
    grid.innerHTML = `<div class="chart-card wide"><div class="empty-state">Пока нет ни одной рабочей смены — отметьте смены в табеле или загрузите файл с данными.</div></div>`;
    renderStatCards(stats);
    renderCompareCards();
    return;
  }
  renderStatCards(stats);
  renderCompareCards();
  grid.innerHTML = `<div class="chart-card wide"><div class="empty-state">Загрузка графиков…</div></div>`;
  try{
    await ensureChartLibsLoaded();
  }catch(err){
    // Библиотека графиков лежит локально в проекте (js/vendor/) — если её всё же
    // не удалось загрузить (например, файл не выложен на хостинг вместе с остальными),
    // остальное приложение (табель, календарь, суммы, автосохранение) продолжает
    // работать полностью в обычном режиме.
    grid.innerHTML = `<div class="chart-card wide"><div class="empty-state">📉 Не удалось загрузить библиотеку графиков (${err.message}).<br>Табель, календарь, суммы и автосохранение при этом работают в обычном режиме.</div></div>`;
    return;
  }
  grid.innerHTML = `
    <div class="chart-card">
      <h3>Часы по месяцам</h3>
      <div class="chart-desc">суммарно отработанные часы за каждый месяц периода</div>
      <div class="chart-wrap"><canvas id="chartHours"></canvas></div>
    </div>
    <div class="chart-card">
      <h3>Заработок по месяцам</h3>
      <div class="chart-desc">сумма заработка за каждый месяц, дин.</div>
      <div class="chart-wrap"><canvas id="chartEarnings"></canvas></div>
    </div>
    <div class="chart-card wide">
      <h3>Накопительный заработок</h3>
      <div class="chart-desc">рост общего заработка день за днём за весь период</div>
      <div class="chart-wrap"><canvas id="chartCumulative"></canvas></div>
    </div>
    <div class="chart-card">
      <h3>Смены по дням недели</h3>
      <div class="chart-desc">будни — бирюзовым, выходные — коралловым</div>
      <div class="chart-wrap"><canvas id="chartWeekdayCount"></canvas></div>
    </div>
    <div class="chart-card">
      <h3>Средняя длительность смены</h3>
      <div class="chart-desc">по дням недели, часы</div>
      <div class="chart-wrap"><canvas id="chartWeekdayAvg"></canvas></div>
    </div>
    <div class="chart-card">
      <h3>Средний заработок по дням недели</h3>
      <div class="chart-desc">будни vs выходные, дин. за смену</div>
      <div class="chart-wrap"><canvas id="chartWeekdayEarnings"></canvas></div>
    </div>
    <div class="chart-card">
      <h3>Рабочие / выходные дни</h3>
      <div class="chart-desc">соотношение дней за весь период</div>
      <div class="chart-wrap"><canvas id="chartRatio"></canvas></div>
    </div>
    <div class="chart-card">
      <h3>Заработок: будни vs выходные</h3>
      <div class="chart-desc">кто приносит больше денег</div>
      <div class="chart-wrap"><canvas id="chartWeekendSplit"></canvas></div>
    </div>
    <div class="chart-card">
      <h3>Топ-5 смен</h3>
      <div class="chart-desc">самые прибыльные смены за весь период</div>
      <div class="chart-wrap"><canvas id="chartTop5"></canvas></div>
    </div>
    <div class="chart-card">
      <h3>Длительность смен</h3>
      <div class="chart-desc">распределение смен по продолжительности</div>
      <div class="chart-wrap"><canvas id="chartShiftBuckets"></canvas></div>
    </div>
    <div class="chart-card wide">
      <h3>Динамика по неделям</h3>
      <div class="chart-desc">отработанные часы по неделям за весь период</div>
      <div class="chart-wrap"><canvas id="chartWeeklyTrend"></canvas></div>
    </div>
    <div class="chart-card">
      <h3>Частые времена смен</h3>
      <div class="chart-desc">какие пары начало–конец встречаются чаще всего</div>
      <div class="chart-wrap"><canvas id="chartShiftTimes"></canvas></div>
    </div>
    <div class="chart-card">
      <h3>Начало смены по часам</h3>
      <div class="chart-desc">в какое время суток чаще всего начинаются смены</div>
      <div class="chart-wrap"><canvas id="chartStartHour"></canvas></div>
    </div>
    ${stats.byBus.length ? `
    <div class="chart-card">
      <h3>Смены по автобусам</h3>
      <div class="chart-desc">на каком автобусе отработано больше всего смен</div>
      <div class="chart-wrap"><canvas id="chartByBus"></canvas></div>
    </div>` : ''}
    ${stats.byRoute.length ? `
    <div class="chart-card">
      <h3>Смены по маршрутам</h3>
      <div class="chart-desc">на каком маршруте отработано больше всего смен</div>
      <div class="chart-wrap"><canvas id="chartByRoute"></canvas></div>
    </div>` : ''}
    ${stats.byBus.length ? `
    <div class="chart-card">
      <h3>Заработок по автобусам</h3>
      <div class="chart-desc">суммарный доход за смены на каждом автобусе, дин.</div>
      <div class="chart-wrap"><canvas id="chartByBusEarn"></canvas></div>
    </div>` : ''}
    ${stats.byRoute.length ? `
    <div class="chart-card">
      <h3>Заработок по маршрутам</h3>
      <div class="chart-desc">суммарный доход за смены на каждом маршруте, дин.</div>
      <div class="chart-wrap"><canvas id="chartByRouteEarn"></canvas></div>
    </div>` : ''}
  `;
  try{
    buildCharts(stats);
  }catch(err){
    console.error('Не удалось построить графики', err);
    grid.innerHTML = `<div class="chart-card wide"><div class="empty-state">📉 Не удалось построить графики (${err.message}). Табель и данные при этом не затронуты.</div></div>`;
  }
}
