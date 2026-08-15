/* ui/initial-month-nav-label.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// Initial navigation label.
  const m = DATA[currentKey];
  if($('monthNavLabel') && m) $('monthNavLabel').textContent = `${m.label} ${m.year}`;
