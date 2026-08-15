/* data/backup-button-binding.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// Manual quick backup. The backup is intentionally separate from the normal export.
  $('backupBtn')?.addEventListener('click', () => {
    if(createLocalBackup('ручной бэкап')){
      showToast('Локальный бэкап создан');
    }else{
      showToast('Не удалось создать бэкап');
    }
  });
