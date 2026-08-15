/* cloud/last-sync-time.js
 * Дата и время последней успешной синхронизации с Google Диском — хранится в
 * localStorage (переживает перезагрузку страницы), обновляется при каждой
 * успешной подгрузке/отправке данных, показывается рядом со статусом "подключено".
 */
const CLOUD_LAST_SYNC_KEY = 'cloudLastSyncAt_v1';

function recordLastSyncTime(){
  try{ localStorage.setItem(CLOUD_LAST_SYNC_KEY, String(Date.now())); }catch(err){}
}

function formatLastSyncTime(){
  try{
    const raw = localStorage.getItem(CLOUD_LAST_SYNC_KEY);
    if(!raw) return null;
    const d = new Date(parseInt(raw, 10));
    if(isNaN(d.getTime())) return null;
    return d.toLocaleString('ru-RU', {day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'});
  }catch(err){ return null; }
}
