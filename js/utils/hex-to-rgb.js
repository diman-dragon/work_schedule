/* utils/hex-to-rgb.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
function hexToRgb(hex){
  hex = (hex || '').trim().replace('#','');
  if(hex.length === 3) hex = hex.split('').map(c => c+c).join('');
  const num = parseInt(hex, 16);
  if(isNaN(num)) return { r:76, g:194, b:255 };
  return { r:(num>>16)&255, g:(num>>8)&255, b:num&255 };
}
