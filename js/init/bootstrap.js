/* init/bootstrap.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// init
currentKey = ensureCurrentMonthExists();
APP.currentKey = currentKey;
document.getElementById('rateInput').value = rate;
render(currentKey);
document.getElementById('monthNavLabel') && (document.getElementById('monthNavLabel').textContent = `${DATA[currentKey].label} ${DATA[currentKey].year}`);
persist();
