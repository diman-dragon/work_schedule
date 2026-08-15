/* fmtNum: one application-level function per file. */
function fmtNum(n){
  if(n === null || n === undefined || isNaN(n)) return "—";
  return Math.round(n).toLocaleString('ru-RU');
}
