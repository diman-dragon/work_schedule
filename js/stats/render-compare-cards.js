/* stats/render-compare-cards.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
function renderCompareCards(){
  const wrap = $('compareCards');
  const rows = computeMonthComparisons();
  if(!rows.length){ wrap.innerHTML = ''; return; }
  wrap.innerHTML = rows.map(r => {
    const dir = r.deltaSum > 0 ? 'positive' : (r.deltaSum < 0 ? 'negative' : 'neutral');
    const arrow = r.deltaSum > 0 ? '↑' : (r.deltaSum < 0 ? '↓' : '·');
    const pctText = isFinite(r.deltaPct) ? `${r.deltaPct > 0 ? '+' : ''}${Math.round(r.deltaPct)}%` : '—';
    const hoursText = `${r.deltaHours > 0 ? '+' : ''}${Math.round(r.deltaHours*10)/10} ч`;
    return `
    <div class="compare-card">
      <div class="cc-label">${r.label}</div>
      <div class="cc-sum">${fmtNum(r.sum)} дин.</div>
      <span class="cc-delta ${dir}">${arrow} ${pctText}</span>
      <div class="cc-vs">${hoursText} к ${r.prevLabel}</div>
    </div>`;
  }).join('');
}
