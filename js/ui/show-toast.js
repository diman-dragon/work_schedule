/* ui/show-toast.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// ---------- ТОСТ ----------
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}
