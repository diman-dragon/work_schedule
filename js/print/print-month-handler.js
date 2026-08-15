/* print/print-month-handler.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
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
