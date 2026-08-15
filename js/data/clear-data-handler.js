/* data/clear-data-handler.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// ---------- ПОЛНАЯ ОЧИСТКА ДАННЫХ ----------
document.getElementById('clearDataBtn').addEventListener('click', async () => {
  if(!order.length){ showToast('Данные уже пусты'); return; }
  const ok = await showConfirmModal(
    'Это действие необратимо. Если нужен бэкап — сначала нажмите «Сохранить» (JSON) или «CSV».',
    'Удалить все данные графика?',
    'Удалить'
  );
  if(!ok) return;
  createLocalBackup('перед полной очисткой');
  DATA = {}; order = []; currentKey = null;
  try{ localStorage.removeItem(STORAGE_KEY); }catch(err){}
  persist();
  currentKey = ensureCurrentMonthExists();
  render(currentKey);
  if(tabStats.classList.contains('active')) buildStats();
  showToast('Все данные удалены');
});
