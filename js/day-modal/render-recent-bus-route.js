/* day-modal/render-recent-bus-route.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// подстановка недавних значений поля (автобус/маршрут) по клику на чип;
// используется и для recentBuses, и для recentRoutes — логика идентична,
// отличается только исходный список значений, контейнер и связанный инпут
function renderRecentFieldChips(containerId, items, input, label){
  const wrap = $(containerId);
  if(!wrap) return;
  if(!items.length){ wrap.innerHTML = ''; return; }
  wrap.innerHTML = `<div class="rt-label">${label}</div>` +
    items.map(f => `<span class="time-chip" data-value="${f.value}" tabindex="0" role="button" aria-label="Подставить ${f.value}">${f.count > 1 ? `<span class="rt-count">${f.count}</span>` : ''}${f.value}</span>`).join('');
  wrap.querySelectorAll('.time-chip').forEach(chip => {
    const apply = () => { input.value = chip.dataset.value; };
    chip.addEventListener('click', apply);
    chip.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); apply(); } });
  });
}

function renderRecentBuses(){
  renderRecentFieldChips('recentBuses', getFrequentBuses(), busInput, 'недавние автобусы');
}

function renderRecentRoutes(){
  renderRecentFieldChips('recentRoutes', getFrequentRoutes(), routeInput, 'недавние маршруты');
}
