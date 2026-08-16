/* ui/backup-title-indicator.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// показываем в заголовке вкладки, что есть локальный бэкап
try{
  if(localStorage.getItem(BACKUP_KEY)) document.title = 'Рабочий график · бэкап есть';
}catch(e){}
