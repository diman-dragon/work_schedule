/* day-modal/get-frequent-bus-routes.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// ---------- ЧАСТО ИСПОЛЬЗУЕМЫЕ АВТОБУС / МАРШРУТ (подстановка исторических данных) ----------
// та же идея, что и в get-frequent-shift-times.js: собираем значения поля из всей
// истории дней, считаем частоту и дату последнего использования, чтобы можно было
// в один клик подставить привычный номер автобуса или маршрута.
function getFrequentFieldValues(field, limit){
  const map = {};
  Object.values(DATA).forEach(m => {
    m.days.forEach(d => {
      const val = d[field];
      if(val){
        const dt = parseDate(d.date);
        if(!map[val]) map[val] = { value: val, count: 0, lastUsed: dt };
        map[val].count++;
        if(dt > map[val].lastUsed) map[val].lastUsed = dt;
      }
    });
  });
  // сортируем по свежести использования (самые недавние — первыми), как и для смен
  const sorted = Object.values(map).sort((a, b) => (b.lastUsed - a.lastUsed) || (b.count - a.count));
  return limit ? sorted.slice(0, limit) : sorted;
}

function getFrequentBuses(limit){ return getFrequentFieldValues('bus', limit); }
function getFrequentRoutes(limit){ return getFrequentFieldValues('route', limit); }
