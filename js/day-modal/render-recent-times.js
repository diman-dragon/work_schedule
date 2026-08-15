/* day-modal/render-recent-times.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
function renderRecentTimes(){
  const wrap = document.getElementById('recentTimes');
  const freq = getFrequentShiftTimes();
  if(!freq.length){ wrap.innerHTML = ''; return; }
  wrap.innerHTML = '<div class="rt-label">недавние смены</div>' +
    freq.map(f => `<span class="time-chip" data-start="${f.start}" data-end="${f.end}" tabindex="0" role="button" aria-label="Подставить смену ${f.start}–${f.end}">${f.count > 1 ? `<span class="rt-count">${f.count}</span>` : ''}${f.start}–${f.end}<span class="rt-del" data-del-start="${f.start}" data-del-end="${f.end}" role="button" tabindex="0" aria-label="Убрать ${f.start}–${f.end} из подсказок" title="Убрать из подсказок">✕</span></span>`).join('');
  wrap.querySelectorAll('.time-chip').forEach(chip => {
    const apply = () => {
      startInput.value = chip.dataset.start;
      endInput.value = chip.dataset.end;
      if(!workSwitch.classList.contains('on')){
        workSwitch.classList.add('on');
        timeFields.style.display = 'block';
      }
      updatePreview();
    };
    chip.addEventListener('click', apply);
    chip.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); apply(); } });
  });
  // крестик "убрать из подсказок" — скрывает конкретную пару время-начало/время-конец
  // из списка навсегда (сохраняется между сессиями), сама история смен не меняется
  wrap.querySelectorAll('.rt-del').forEach(del => {
    const remove = (e) => {
      e.stopPropagation();
      hiddenShiftTimes.add(del.dataset.delStart + '–' + del.dataset.delEnd);
      persist();
      renderRecentTimes();
    };
    del.addEventListener('click', remove);
    del.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); remove(e); } });
  });
}
