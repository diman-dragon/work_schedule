/* data/export-csv-handler.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// ---------- ЭКСПОРТ В CSV ----------
$('exportCsvBtn').addEventListener('click', async () => {
  if(!order.length){ showToast('Нет данных для экспорта'); return; }
  const rows = [['Месяц','Год','Дата','День недели','Начало','Конец','Длительность (ч:мм)','Сумма, дин.','Автобус','Маршрут']];
  order.forEach(key => {
    const m = DATA[key];
    m.days.forEach(d => {
      rows.push([
        m.label, m.year, d.date, d.weekday,
        d.start || '', d.end || '',
        d.start ? minutesToHM(d.minutes) : '',
        d.start ? String(d.sum) : '',
        d.bus || '', d.route || ''
      ]);
    });
  });
  const csv = rows.map(r => r.map(v => {
    const s = String(v ?? '');
    return /[;"\n]/.test(s) ? '"' + s.replace(/"/g,'""') + '"' : s;
  }).join(';')).join('\r\n');
  const csvText = '\uFEFF' + csv;
  if(window.showSaveFilePicker){
    try{
      const handle = await window.showSaveFilePicker({
        suggestedName: 'график_данные.csv',
        types: [{ description: 'CSV файл', accept: {'text/csv': ['.csv']} }]
      });
      const writable = await handle.createWritable();
      await writable.write(csvText);
      await writable.close();
      showToast('CSV-файл сохранён (можно открыть в Excel)');
      return;
    } catch(err){
      if(err.name === 'AbortError') return;
      console.error('Не удалось сохранить через системный диалог', err);
    }
  }
  const blob = new Blob([csvText], {type:'text/csv;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'график_данные.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  showToast('CSV-файл сохранён (можно открыть в Excel)');
});
