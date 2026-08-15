/* getFrequentShiftTimes: one application-level function per file. */
function getFrequentShiftTimes(limit){
  const map = {};
  Object.values(DATA).forEach(m => {
    m.days.forEach(d => {
      if(d.start && d.end){
        const key = d.start + '–' + d.end;
        const dt = parseDate(d.date);
        if(!map[key]) map[key] = { start: d.start, end: d.end, count: 0, lastUsed: dt };
        map[key].count++;
        if(dt > map[key].lastUsed) map[key].lastUsed = dt;
      }
    });
  });
  // сортируем по свежести использования (самые недавние — первыми), чтобы только
  // что введённая смена сразу оказывалась в начале списка, а не терялась за более
  // "популярными" по числу повторений вариантами; скрытые пользователем варианты исключаем
  const sorted = Object.values(map)
    .filter(f => !hiddenShiftTimes.has(f.start + '–' + f.end))
    .sort((a, b) => (b.lastUsed - a.lastUsed) || (b.count - a.count));
  // без limit — показываем вообще все встречавшиеся варианты времени смены
  return limit ? sorted.slice(0, limit) : sorted;
}
