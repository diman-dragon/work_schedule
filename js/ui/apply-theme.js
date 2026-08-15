/* ui/apply-theme.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  document.getElementById('themeToggle').textContent = t === 'dark' ? '🌙' : '☀️';
  if(tabStats.classList.contains('active')) buildStats();
  applyHeatmap(); // цвет акцента разный в темах — пересчитываем тепловую карту
}
