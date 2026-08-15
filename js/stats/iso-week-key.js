/* stats/iso-week-key.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// ---------- СТАТИСТИКА ----------
function isoWeekKey(dateObj){
  const d = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()));
  const dayNum = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(),0,4));
  const week = 1 + Math.round(((d - firstThursday) / 86400000 - 3 + ((firstThursday.getUTCDay()+6)%7)) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2,'0')}`;
}
