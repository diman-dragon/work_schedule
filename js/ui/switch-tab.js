/* ui/switch-tab.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
function switchTab(which){
  const isTable = which === 'table';
  tabBtnTable.classList.toggle('active', isTable);
  tabBtnStats.classList.toggle('active', !isTable);
  tabBtnTable.setAttribute('aria-selected', String(isTable));
  tabBtnStats.setAttribute('aria-selected', String(!isTable));
  tabTable.classList.toggle('active', isTable);
  tabStats.classList.toggle('active', !isTable);
  if(!isTable) buildStats();
}
