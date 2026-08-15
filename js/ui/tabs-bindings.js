/* ui/tabs-bindings.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// ---------- ВКЛАДКИ ----------
const tabBtnTable = $('tabBtnTable');
const tabBtnStats = $('tabBtnStats');
const tabTable = $('tabTable');
const tabStats = $('tabStats');
tabBtnTable.addEventListener('click', () => switchTab('table'));
tabBtnStats.addEventListener('click', () => switchTab('stats'));
