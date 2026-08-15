/* Enhancement orchestration: one application-level function. */
function initEnhancements(){
  const $ = document.getElementById.bind(document);

  // Data dropdown
  const menuBtn = $('dataMenuBtn');
  const dataMenu = $('dataMenu');
  menuBtn?.addEventListener('click', e => {
    e.stopPropagation();
    const show = !dataMenu.classList.contains('show');
    dataMenu.classList.toggle('show', show);
    menuBtn.setAttribute('aria-expanded', String(show));
  });
  document.addEventListener('click', e => {
    if(dataMenu && !dataMenu.contains(e.target) && e.target !== menuBtn) closeDataMenu();
  });
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape'){
      closeDataMenu();
      document.querySelectorAll('.modal-overlay.show').forEach(x => x.classList.remove('show'));
    }
  });
  dataMenu?.querySelectorAll('button').forEach(btn => btn.addEventListener('click', closeDataMenu));

  // Today
  $('todayBtn')?.addEventListener('click', () => {
    const key = ensureCurrentMonthExists();
    render(key);
    window.scrollTo({top:0, behavior:'smooth'});
    showToast('Текущий месяц открыт');
  });

  // Month navigation
  $('prevMonthBtn')?.addEventListener('click', () => moveMonth(-1));
  $('nextMonthBtn')?.addEventListener('click', () => moveMonth(1));

  // Keep navigation label current by wrapping render once.
  if(typeof window.__enhancedRenderWrapped === 'undefined'){
    window.__enhancedRenderWrapped = true;
    const originalRender = render;
    window.render = function(key){
      const result = originalRender(key);
      const m = DATA[currentKey];
      const label = $('monthNavLabel');
      if(label && m) label.textContent = `${m.label} ${m.year}`;
      return result;
    };
  }

  // Keyboard month navigation when not typing.
  document.addEventListener('keydown', e => {
    const tag = (e.target?.tagName || '').toLowerCase();
    if(['input','textarea','select'].includes(tag)) return;
    if(e.key === 'ArrowLeft') moveMonth(-1);
    if(e.key === 'ArrowRight') moveMonth(1);
    if((e.key === 't' || e.key === 'т') && !e.ctrlKey && !e.metaKey){
      const key = ensureCurrentMonthExists();
      render(key);
    }
  });

  // Swipe month-to-month on the calendar.
  let touchX = null, touchY = null;
  const cal = $('calGrid');
  cal?.addEventListener('touchstart', e => {
    const t = e.changedTouches[0];
    touchX = t.clientX; touchY = t.clientY;
  }, {passive:true});
  cal?.addEventListener('touchend', e => {
    if(touchX === null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchX, dy = t.clientY - touchY;
    touchX = touchY = null;
    if(Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy)*1.25) moveMonth(dx < 0 ? 1 : -1);
  }, {passive:true});

  // Auto-focus first useful field in day modal.
  const originalOpenDay = window.openDayModal;
  if(typeof originalOpenDay === 'function'){
    window.openDayModal = function(...args){
      const r = originalOpenDay.apply(this,args);
      setTimeout(() => $('startInput')?.focus(), 80);
      return r;
    };
  }

  // Print current month as a clean A4 report.
  $('printBtn')?.addEventListener('click', () => {
    const m = DATA[currentKey];
    if(!m) return;
    const rows = m.days.filter(d => d.start).map(d => `
      <tr>
        <td>${d.date}</td>
        <td>${d.weekday || ''}</td>
        <td>${d.start || ''}–${d.end || ''}</td>
        <td>${minutesToHM(d.minutes || 0)}</td>
        <td>${d.bus || '—'}</td>
        <td>${d.route || '—'}</td>
        <td class="num">${fmtNum(d.sum || 0)} дин.</td>
      </tr>`).join('');
    const sheet = $('printSheet');
    sheet.innerHTML = `
      <h1>Рабочий график — ${m.label} ${m.year}</h1>
      <div class="print-meta">Сформировано ${new Date().toLocaleString('ru-RU')} · ставка для новых/изменённых смен: ${fmtNum(rate)} дин./ч</div>
      <table>
        <thead><tr><th>Дата</th><th>День</th><th>Смена</th><th>Длительность</th><th>Автобус</th><th>Маршрут</th><th>Заработок</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="7">Нет рабочих смен</td></tr>'}</tbody>
      </table>
      <div class="total">Итого: ${minutesToHM(m.total_minutes)} · ${m.days.filter(d=>d.start && !d.pending).length} завершённых смен · ${fmtNum(m.total_sum)} дин.</div>`;
    document.body.classList.add('printing');
    window.print();
    setTimeout(() => document.body.classList.remove('printing'), 300);
  });

  // Manual quick backup. The backup is intentionally separate from the normal export.
  $('backupBtn')?.addEventListener('click', () => {
    if(createLocalBackup('ручной бэкап')){
      showToast('Локальный бэкап создан');
    }else{
      showToast('Не удалось создать бэкап');
    }
  });

  // Warn before leaving with unsaved form data.
  let modalDirty = false;
  ['startInput','endInput','busInput','routeInput'].forEach(id => {
    $(id)?.addEventListener('input', () => { modalDirty = true; });
  });
  $('saveBtn')?.addEventListener('click', () => { modalDirty = false; });
  $('cancelBtn')?.addEventListener('click', () => { modalDirty = false; });

  // Show local-backup availability in the page title.
  try{
    if(localStorage.getItem(BACKUP_KEY)) document.title = 'Рабочий график · бэкап есть';
  }catch(e){}

  // Improved sync status styling.
  const status = $('cloudSyncStatus');
  if(status){
    const observer = new MutationObserver(() => {
      const t = status.textContent || '';
      status.classList.toggle('ok', /синхрониз|подключено/.test(t));
      status.classList.toggle('error', /ошибка|не удалось|неверный/.test(t));
    });
    observer.observe(status,{childList:true,subtree:true,characterData:true});
  }

  // Initial navigation label.
  const m = DATA[currentKey];
  if($('monthNavLabel') && m) $('monthNavLabel').textContent = `${m.label} ${m.year}`;
}
