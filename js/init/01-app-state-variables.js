/* init/01-app-state-variables.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
let DATA = APP.months;
let order = sanitizeOrder(APP.order, APP.months);
let rate = APP.rate;
let currentKey = APP.currentKey;
let editingDay = null;
let charts = {};
// пары "начало–конец", которые пользователь скрыл из подсказок (напр. случайно
// введённое время или опечатка) — сама история смен при этом не трогается
let hiddenShiftTimes = new Set(Array.isArray(APP.hiddenShiftTimes) ? APP.hiddenShiftTimes : []);
