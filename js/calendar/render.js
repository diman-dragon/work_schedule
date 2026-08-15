/* calendar/render.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// ---------- КАЛЕНДАРЬ ----------
function render(key){
  if(!DATA[key]) key = order[0];
  currentKey = key;
  renderMonthsStrip();
  updateHeaderSub();
  const m = DATA[key];
  animateMinutesLed('totalHours', m.total_minutes);
  const worked = m.days.filter(d => d.start && !d.pending);
  animateNumberLed('shiftCount', worked.length);
  animateNumberLed('totalSum', m.total_sum, fmtNum);
  const avg = worked.length ? m.total_minutes/worked.length : 0;
  animateMinutesLed('avgShift', avg);

  const grid = document.getElementById('calGrid');
  grid.innerHTML = '';
  const firstOfMonth = new Date(m.year, m.month-1, 1);
  let offset = firstOfMonth.getDay();
  offset = (offset + 6) % 7;
  for(let i=0;i<offset;i++){
    const empty = document.createElement('div');
    empty.className = 'day empty';
    grid.appendChild(empty);
  }
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isCurrentCalMonth = (m.year === today.getFullYear() && m.month === today.getMonth()+1);
  m.days.forEach((d, idx) => {
    const cell = document.createElement('div');
    const dayNum = parseInt(d.date.split('.')[0], 10);
    const dateObj = new Date(m.year, m.month-1, dayNum);
    const isToday = isCurrentCalMonth && dayNum === today.getDate();
    const isFuture = dateObj.getTime() > todayMidnight.getTime();
    let stateClass;
    if(d.start){ stateClass = d.pending ? 'pending-shift' : 'worked'; }
    else if(isFuture){ stateClass = 'future'; }
    else if(isToday){ stateClass = 'pending-today'; }
    else { stateClass = 'off'; }
    cell.className = 'day ' + stateClass + (isToday ? ' today' : '');
    cell.style.animationDelay = (Math.min(idx, 30) * 12) + 'ms';
    let inner = (d.photo ? `<span class="d-photo-badge" title="Есть фото графика смен">📷</span>` : '') +
      `<div class="d-head"><span class="d-num">${dayNum}</span>` +
      (d.start ? `<span class="d-time">${d.start}–${d.end}</span>` : '') +
      `</div><div class="d-body">`;
    let stateLabel;
    if(d.start){
      inner += `<div class="d-dur">${minutesToHM(d.minutes)}</div>`;
      if(d.bus) inner += `<div class="d-bus">🚌 <span class="d-tag">авт.</span> ${d.bus}</div>`;
      if(d.route) inner += `<div class="d-route">🧭 <span class="d-tag">маршр.</span> ${d.route}</div>`;
      if(d.pending){
        inner += `<div class="d-pending">🟡 идёт · после ${d.end}</div>`;
      } else {
        inner += `<div class="d-sum">${fmtNum(d.sum)} дин.</div>`;
      }
      stateLabel = d.pending
        ? `смена ${d.start}–${d.end} ещё не закончилась, доход будет засчитан после ${d.end}`
        : `смена ${d.start}–${d.end}, ${fmtNum(d.sum)} дин.` + (d.bus || d.route ? `, автобус ${d.bus || '—'}, маршрут ${d.route || '—'}` : '');
    } else if(isFuture){
      inner += `<div class="d-off">—</div>`;
      stateLabel = 'ещё не наступил';
    } else if(isToday){
      inner += `<div class="d-off">Сегодня</div>`;
      stateLabel = 'сегодня, данные ещё не внесены';
    } else {
      inner += `<div class="d-off">выходной</div>`;
      stateLabel = 'выходной';
    }
    inner += `</div>`;
    cell.innerHTML = inner;
    cell.tabIndex = 0;
    cell.setAttribute('role', 'button');
    cell.setAttribute('aria-label', `${dayNum}, ${d.weekday}, ${stateLabel}${d.photo ? ', есть фото графика смен' : ''}`);
    if(d.sum && !d.pending) cell.dataset.sum = d.sum;
    cell.addEventListener('click', () => openModal(key, idx));
    cell.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openModal(key, idx); } });
    grid.appendChild(cell);
  });

  renderOverallBar();
  applyHeatmap();
}
