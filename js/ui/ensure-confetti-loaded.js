/* ui/ensure-confetti-loaded.js
 * Конфетти при сохранении рабочей смены — приятная мелочь, а не что-то
 * нужное сразу при открытии приложения. Раньше грузилась с CDN на каждом
 * запуске; теперь лежит локально (js/vendor/) и подгружается лениво, при
 * первом реальном сохранении рабочего дня — без интернета, так как файл
 * локальный, просто не тратим время на него, пока он не понадобился.
 */
let confettiLoadPromise = null;
function ensureConfettiLoaded(){
  if(typeof window.confetti !== 'undefined') return Promise.resolve();
  if(confettiLoadPromise) return confettiLoadPromise;
  confettiLoadPromise = loadScriptOnce('js/vendor/confetti.browser.min.js?v=' + APP_VERSION)
    .catch(err => { confettiLoadPromise = null; throw err; });
  return confettiLoadPromise;
}
