/* ui/backup-title-indicator.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// Show local-backup availability in the page title.
  try{
    if(localStorage.getItem(BACKUP_KEY)) document.title = 'Рабочий график · бэкап есть';
  }catch(e){}
