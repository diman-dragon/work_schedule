/* data/apply-loaded-json.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
function applyLoadedJson(text, fileLabel){
  const obj = JSON.parse(text);
  validateLoadedData(obj);
  createLocalBackup('перед импортом ' + (fileLabel || 'JSON'));
  DATA = obj.months;
  order = sanitizeOrder(obj.order, obj.months);
  hiddenShiftTimes = new Set(Array.isArray(obj.hiddenShiftTimes) ? obj.hiddenShiftTimes : []);
  rate = (typeof obj.rate === 'number' && obj.rate >= 0) ? obj.rate : 700;
  sortOrderChronologically();
  recomputeAll();
  currentKey = ensureCurrentMonthExists(); // фокус на сегодняшнем месяце, создаём его, если отсутствует
  document.getElementById('rateInput').value = rate;
  render(currentKey);
  if(tabStats.classList.contains('active')) buildStats();
  persist();
  showToast('Данные загружены' + (fileLabel ? ' из ' + fileLabel : '') + ' и сохранены локально');
}
