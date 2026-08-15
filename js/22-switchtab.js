/* switchTab: one application-level function per file. */
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
