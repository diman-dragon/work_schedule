/* applyHeatmap: one application-level function per file. */
function applyHeatmap(){
  const grid = document.getElementById('calGrid');
  const cells = document.querySelectorAll('#calGrid .day');
  grid.classList.toggle('heatmap-active', heatmapMode);
  if(!heatmapMode){
    cells.forEach(cell => { cell.style.background = ''; });
    return;
  }
  // растягиваем контраст по мин/макс именно среди показанных сейчас смен, а не по
  // всему архиву — иначе один сильно выделяющийся месяц "съедал" контраст остальных,
  // а при близких суммах (одна ставка, похожие смены) все дни выглядели одинаково
  let min = Infinity, max = -Infinity;
  cells.forEach(cell => {
    const sum = parseFloat(cell.dataset.sum || '0');
    if(sum > 0){ if(sum < min) min = sum; if(sum > max) max = sum; }
  });
  const hasRange = isFinite(min) && isFinite(max) && max > min;
  cells.forEach(cell => {
    const sum = parseFloat(cell.dataset.sum || '0');
    if(!sum){ cell.style.background = ''; return; }
    // если разброс есть — растягиваем 0..1 по факт. диапазону; если все суммы одинаковые — красим ровным средним тоном
    const ratio = hasRange ? (sum - min) / (max - min) : 0.5;
    const rgb = warmHeatColor(ratio);
    const alpha = 0.38 + ratio * 0.4; // насыщенность заливки растёт вместе с цветом
    cell.style.background = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha.toFixed(2)})`;
  });
}
