/* heatmap/heatmap-toggle-bindings.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// ---------- ТЕПЛОВАЯ КАРТА КАЛЕНДАРЯ (по аналогии с GitHub) ----------
// чем выше заработок за смену относительно самой прибыльной смены за весь период,
// тем насыщеннее заливка дня акцентным цветом
let heatmapMode = false;
const heatmapToggleBtn = $('heatmapToggleBtn');
heatmapToggleBtn.addEventListener('click', () => {
  heatmapMode = !heatmapMode;
  heatmapToggleBtn.classList.toggle('active', heatmapMode);
  heatmapToggleBtn.setAttribute('aria-pressed', String(heatmapMode));
  applyHeatmap();
});
