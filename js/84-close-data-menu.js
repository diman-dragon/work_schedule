/* Close the data dropdown. */
function closeDataMenu(){
  const dataMenu = document.getElementById('dataMenu');
  const menuBtn = document.getElementById('dataMenuBtn');
  if(!dataMenu) return;
  dataMenu.classList.remove('show');
  menuBtn && menuBtn.setAttribute('aria-expanded','false');
}
