/* openModal: one application-level function per file. */
function openModal(key, idx){
  editingDay = {key, idx};
  const d = DATA[key].days[idx];
  const dayNum = parseInt(d.date.split('.')[0],10);
  const m = DATA[key];
  document.getElementById('modalTitle').textContent = `${dayNum} ${monthNamesGen[m.month-1]} ${m.year}`;
  document.getElementById('modalSub').textContent = d.weekday;

  const isWorking = !!d.start;
  workSwitch.classList.toggle('on', isWorking);
  timeFields.style.display = isWorking ? 'block' : 'none';
  startInput.value = d.start || '15:00';
  endInput.value = d.end || '23:00';
  busInput.value = d.bus || '';
  routeInput.value = d.route || '';
  renderRecentTimes();
  updatePreview();

  overlay.classList.add('show');
  setTimeout(() => workSwitch.focus(), 50);
}
