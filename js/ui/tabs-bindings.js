/* ui/tabs-bindings.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// ---------- ВКЛАДКИ ----------
const tabBtnTable = document.getElementById('tabBtnTable');
const tabBtnStats = document.getElementById('tabBtnStats');
const tabTable = document.getElementById('tabTable');
const tabStats = document.getElementById('tabStats');
tabBtnTable.addEventListener('click', () => switchTab('table'));
tabBtnStats.addEventListener('click', () => switchTab('stats'));
