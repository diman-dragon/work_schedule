/* monthButton: one application-level function per file. */
function monthButton(key){
  const m = DATA[key];
  const btn = document.createElement('div');
  btn.className = 'month-btn' + (key === currentKey ? ' active' : '');
  btn.dataset.key = key;
  btn.tabIndex = 0;
  btn.setAttribute('role', 'button');
  btn.setAttribute('aria-label', `${m.label} ${m.year}, отработано ${minutesToHM(m.total_minutes)}`);
  const yy = String(m.year).slice(2);
  btn.innerHTML = `<span class="m-name">${m.label}</span><span class="m-year">'${yy}</span><span class="m-hours">${minutesToHM(m.total_minutes)}</span>`;
  btn.addEventListener('click', () => render(key));
  btn.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); render(key); } });
  return btn;
}
