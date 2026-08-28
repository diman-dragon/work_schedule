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
  const workMins = computeMinutes(startInput.value, endInput.value);
  const garageMin = Math.max(0, parseInt(garageMinInput.value, 10) || 0);
  const mins = workMins + garageMin;
  const sum = Math.round(((workMins/60)*rate + (garageMin/60)*rate*0.5)*100)/100;
  const garageNote = garageMin ? ` (вкл. ${garageMin} мин до гаража по половине ставки)` : '';

  // определяем реальные дату/время начала и конца смены (та дата, что редактируется,
  // а не "сегодня"), чтобы правильно показать один из трёх статусов; конец смены —
  // это момент реального освобождения, то есть время окончания линии + довоз до гаража
  let startDt = null, endDt = null;
  if(editingDay){
    const d = DATA[editingDay.key].days[editingDay.idx];
    const base = parseDate(d.date);
    const sMin = timeToMin(startInput.value), eMin = timeToMin(endInput.value);
    const dayOffset = (eMin <= sMin) ? 1 : 0;
    startDt = new Date(base.getFullYear(), base.getMonth(), base.getDate(), Math.floor(sMin/60), sMin%60);
    endDt = new Date(base.getFullYear(), base.getMonth(), base.getDate()+dayOffset, Math.floor(eMin/60), eMin%60);
    if(garageMin) endDt.setMinutes(endDt.getMinutes() + garageMin);
  }
  const now = new Date();
  const releaseLabel = garageMin && endDt
    ? `${String(endDt.getHours()).padStart(2,'0')}:${String(endDt.getMinutes()).padStart(2,'0')}`
    : endInput.value;

  if(startDt && startDt.getTime() > now.getTime()){
    calcPreview.innerHTML = `<span class="calc-status calc-status--future">🕓 Смена ещё не началась</span><br>Начало в <b>${startInput.value}</b> · длительность: <b>${minutesToHM(mins)}</b>${garageNote} · доход будет: <b>${fmtNum(sum)} дин.</b>`;
  } else if(endDt && endDt.getTime() > now.getTime()){
    calcPreview.innerHTML = `<span class="calc-status calc-status--pending">🟡 Смена идёт</span><br>Длительность: <b>${minutesToHM(mins)}</b>${garageNote} · доход будет засчитан после <b>${releaseLabel}</b>`;
  } else {
    calcPreview.innerHTML = `<span class="calc-status calc-status--done">✅ Смена завершена</span><br>Смена: <b>${minutesToHM(mins)}</b>${garageNote} &nbsp;·&nbsp; заработок: <b>${fmtNum(sum)} дин.</b>`;
  }
}
