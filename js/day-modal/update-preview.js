/* day-modal/update-preview.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
function updatePreview(){
  if(!workSwitch.classList.contains('on')){
    calcPreview.innerHTML = 'День отмечен как выходной';
    return;
  }
  if(startInput.value === endInput.value){
    calcPreview.innerHTML = '<span style="color:var(--weekend)">Начало и конец совпадают — укажите корректное время смены</span>';
    return;
  }
  const mins = computeMinutes(startInput.value, endInput.value);
  const hours = mins/60;
  const sum = Math.round(hours*rate*100)/100;

  // определяем реальные дату/время начала и конца смены (та дата, что редактируется,
  // а не "сегодня"), чтобы правильно показать один из трёх статусов
  let startDt = null, endDt = null;
  if(editingDay){
    const d = DATA[editingDay.key].days[editingDay.idx];
    const base = parseDate(d.date);
    const sMin = timeToMin(startInput.value), eMin = timeToMin(endInput.value);
    const dayOffset = (eMin <= sMin) ? 1 : 0;
    startDt = new Date(base.getFullYear(), base.getMonth(), base.getDate(), Math.floor(sMin/60), sMin%60);
    endDt = new Date(base.getFullYear(), base.getMonth(), base.getDate()+dayOffset, Math.floor(eMin/60), eMin%60);
  }
  const now = new Date();

  if(startDt && startDt.getTime() > now.getTime()){
    calcPreview.innerHTML = `<span class="calc-status calc-status--future">🕓 Смена ещё не началась</span><br>Начало в <b>${startInput.value}</b> · длительность: <b>${minutesToHM(mins)}</b> · доход будет: <b>${fmtNum(sum)} дин.</b>`;
  } else if(endDt && endDt.getTime() > now.getTime()){
    calcPreview.innerHTML = `<span class="calc-status calc-status--pending">🟡 Смена идёт</span><br>Длительность: <b>${minutesToHM(mins)}</b> · доход будет засчитан после <b>${endInput.value}</b>`;
  } else {
    calcPreview.innerHTML = `<span class="calc-status calc-status--done">✅ Смена завершена</span><br>Смена: <b>${minutesToHM(mins)}</b> &nbsp;·&nbsp; заработок: <b>${fmtNum(sum)} дин.</b>`;
  }
}
