/* Move the selected month by a relative offset. */
function moveMonth(delta){
  if(!order.length) return;
  const idx = order.indexOf(currentKey);
  const next = idx + delta;
  if(next >= 0 && next < order.length) render(order[next]);
  else showToast(delta < 0 ? 'Это самый ранний месяц' : 'Это самый поздний месяц');
}
