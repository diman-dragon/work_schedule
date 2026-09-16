/* day-modal/render-recent-bus-route.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// подстановка недавних значений поля (автобус/маршрут) по клику на чип;
// используется и для recentBuses, и для recentRoutes — логика идентична,
// отличается только исходный список значений, контейнер, связанный инпут,
// набор скрытых значений и функция повторного рендера (нужна крестику "✕")
function renderRecentFieldChips(containerId, items, input, label, hiddenSet, rerender){
  const wrap = $(containerId);
  if(!wrap) return;
  wrap.innerHTML = '';
  if(!items.length) return;

  // ВАЖНО: f.value приходит из пользовательского ввода (поле "автобус"/"маршрут"),
  // поэтому собираем DOM через createElement/textContent, а не через innerHTML —
  // иначе значение вида "<img src=x onerror=...>" выполнилось бы как разметка (XSS).
  const labelEl = document.createElement('div');
  labelEl.className = 'rt-label';
  labelEl.textContent = label;
  wrap.appendChild(labelEl);

  items.forEach(f => {
    const chip = document.createElement('span');
    chip.className = 'time-chip';
    chip.dataset.value = f.value;
    chip.tabIndex = 0;
    chip.setAttribute('role', 'button');
    chip.setAttribute('aria-label', `Подставить ${f.value}`);

    if(f.count > 1){
      const countEl = document.createElement('span');
      countEl.className = 'rt-count';
      countEl.textContent = String(f.count);
      chip.appendChild(countEl);
    }
    chip.appendChild(document.createTextNode(f.value));

    const del = document.createElement('span');
    del.className = 'rt-del';
    del.dataset.delValue = f.value;
    del.setAttribute('role', 'button');
    del.tabIndex = 0;
    del.setAttribute('aria-label', `Убрать ${f.value} из подсказок`);
    del.title = 'Убрать из подсказок';
    del.textContent = '✕';
    chip.appendChild(del);

    wrap.appendChild(chip);

    const apply = () => { input.value = chip.dataset.value; };
    chip.addEventListener('click', apply);
    chip.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); apply(); } });

    // крестик "убрать из подсказок" — скрывает конкретное значение навсегда (сохраняется
    // между сессиями), сама история дней не меняется; если то же значение снова
    // сохранят в карточке дня, оно автоматически вернётся (см. save-day-handler.js)
    const remove = (e) => {
      e.stopPropagation();
      hiddenSet.add(del.dataset.delValue);
      persist();
      rerender();
    };
    del.addEventListener('click', remove);
    del.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); remove(e); } });
  });
}

function renderRecentBuses(){
  renderRecentFieldChips('recentBuses', getFrequentBuses(), busInput, 'недавние автобусы', hiddenBuses, renderRecentBuses);
}

function renderRecentRoutes(){
  renderRecentFieldChips('recentRoutes', getFrequentRoutes(), routeInput, 'недавние маршруты', hiddenRoutes, renderRecentRoutes);
}
