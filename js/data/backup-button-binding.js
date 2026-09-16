/* data/backup-button-binding.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// ручной быстрый бэкап — намеренно отдельно от обычного экспорта JSON
$('backupBtn')?.addEventListener('click', () => {
  if(createLocalBackup('ручной бэкап')){
    showToast('Локальный бэкап создан');
  }else{
    showToast('Не удалось создать бэкап');
  }
});
