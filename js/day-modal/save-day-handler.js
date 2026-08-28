/* day-modal/save-day-handler.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
$('saveBtn').addEventListener('click', (ev) => {
  if(!editingDay) return;
  const {key, idx} = editingDay;
  const d = DATA[key].days[idx];
  const isWorking = workSwitch.classList.contains('on');
  if(isWorking && startInput.value === endInput.value){
    showToast('Начало и конец смены совпадают — исправьте время');
    return;
  }
  d.edited = true;
  if(isWorking){
    d.start = startInput.value;
    d.end = endInput.value;
    // довоз до гаража после последней остановки — считается отдельно, по
    // половине ставки (см. recomputeDay); 0/пусто, если довоза не было
    d.garageMin = Math.max(0, parseInt(garageMinInput.value, 10) || 0);
    d.bus = busInput.value.trim() || null;
    d.route = routeInput.value.trim() || null;
  } else {
    d.start = null;
    d.end = null;
    d.garageMin = null;
    d.bus = null;
    d.route = null;
  }
  // фото графика смен сохраняем независимо от того, рабочий это день или выходной —
  // расписание на доске вывешивают на весь блок дней (5 рабочих + выходные) сразу
  d.photo = pendingDayPhoto || null;
  recomputeMonth(key);
  closeModal();
  render(key);
  persist();
  if(typeof isCloudSyncActive === 'function' && isCloudSyncActive()) pushAfterDaySave();
  if(isWorking && window.confetti){
    confetti({ particleCount: 45, spread: 55, startVelocity: 28, gravity: 1.1,
      origin: { x: 0.5, y: 0.35 }, colors: [cssVar('--accent'), cssVar('--teal')], scalar: 0.8, ticks: 140 });
  }
});
