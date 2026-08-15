/* cloud/sync-status-styling.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// Improved sync status styling.
  const status = $('cloudSyncStatus');
  if(status){
    const observer = new MutationObserver(() => {
      const t = status.textContent || '';
      status.classList.toggle('ok', /синхрониз|подключено/.test(t));
      status.classList.toggle('error', /ошибка|не удалось|неверный/.test(t));
    });
    observer.observe(status,{childList:true,subtree:true,characterData:true});
  }
