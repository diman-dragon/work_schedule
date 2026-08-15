/* renderMonthsStrip: one application-level function per file. */
function renderMonthsStrip(){
  const {y: ty, m: tm} = getTodayYM();
  const todayIdx = ty*12+tm;
  const monthsEl = document.getElementById('months');
  const pastEl = document.getElementById('monthsPast');
  const pastDetails = document.getElementById('pastMonthsDetails');
  monthsEl.innerHTML = '';
  pastEl.innerHTML = '';
  let pastCount = 0;
  order.forEach(key => {
    const m = DATA[key];
    const idx = m.year*12+m.month;
    const monthsAgo = todayIdx - idx; // 0 = текущий, 1 = прошлый, 2 = позапрошлый, 3+ = уходит в спойлер
    if(monthsAgo >= 3){
      pastEl.appendChild(monthButton(key));
      pastCount++;
    } else {
      monthsEl.appendChild(monthButton(key));
    }
  });
  document.getElementById('pastMonthsSummary').textContent = `Прошедшие месяцы (${pastCount})`;
  pastDetails.style.display = pastCount ? '' : 'none';
}
