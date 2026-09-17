/* charts/ensure-chart-libs-loaded.js
 * Chart.js и плагин подписей раньше грузились с CDN при каждом открытии
 * приложения, даже если пользователь ни разу не заходил во вкладку
 * «Статистика» — это лишний сетевой запрос при обычном открытии и
 * задержка перед тем, как вообще что-то можно было увидеть на экране.
 * Теперь оба файла лежат локально (js/vendor/, см. README там) и грузятся
 * только при первом реальном открытии вкладки статистики — с локального
 * файла, поэтому интернет для этого не нужен, просто откладываем разбор
 * этого немаленького кода браузером до момента, когда он действительно
 * нужен.
 */
let chartLibsLoadPromise = null;
function ensureChartLibsLoaded(){
  if(typeof Chart !== 'undefined' && typeof ChartDataLabels !== 'undefined'){
    return Promise.resolve();
  }
  if(chartLibsLoadPromise) return chartLibsLoadPromise;
  chartLibsLoadPromise = loadScriptOnce('js/vendor/chart.umd.min.js?v=' + APP_VERSION)
    .then(() => loadScriptOnce('js/vendor/chartjs-plugin-datalabels.min.js?v=' + APP_VERSION))
    .then(() => {
      if(window.Chart && window.ChartDataLabels) Chart.register(ChartDataLabels);
    })
    .catch(err => { chartLibsLoadPromise = null; throw err; });
  return chartLibsLoadPromise;
}
