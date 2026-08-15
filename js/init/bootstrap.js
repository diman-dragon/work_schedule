/* init/bootstrap.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// init
currentKey = ensureCurrentMonthExists();
APP.currentKey = currentKey;
$('rateInput').value = rate;
render(currentKey);
$('monthNavLabel') && ($('monthNavLabel').textContent = `${DATA[currentKey].label} ${DATA[currentKey].year}`);
persist();
