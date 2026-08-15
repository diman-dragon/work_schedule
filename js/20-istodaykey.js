/* isTodayKey: one application-level function per file. */
function isTodayKey(key){
  const {y, m} = getTodayYM();
  return DATA[key] && DATA[key].year === y && DATA[key].month === m;
}
