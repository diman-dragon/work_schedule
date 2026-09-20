/* data/restore-backup-button-binding.js
 * "Восстановить бэкап" — показывает список последних локальных бэкапов
 * (до 5 штук, см. create-local-backup.js) и восстанавливает выбранный.
 * Раньше локальный бэкап был только один и перезаписывался каждым новым
 * импортом/очисткой — при неудачном восстановлении отступать было некуда.
 */
$('restoreBackupBtn')?.addEventListener('click', async () => {
  const list = listLocalBackups();
  if(!list.length){
    showToast('Локальных бэкапов пока нет');
    return;
  }
  const lines = list.map((b, i) => {
    const d = new Date(b.backupAt);
    const when = isNaN(d.getTime()) ? b.backupAt : d.toLocaleString('ru-RU', {day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'});
    return `${i + 1}. ${when} — ${b.reason} (смен: ${b.filledDays})`;
  }).join('\n');
  const ok = await showConfirmModal(
    `Доступные бэкапы (от нового к старому):\n\n${lines}\n\nБудет восстановлен самый свежий (№1). Текущие данные перед этим тоже сохранятся отдельным бэкапом.`,
    'Восстановить из бэкапа',
    'Восстановить №1'
  );
  if(!ok) return;
  try{
    restoreLocalBackup(list[0].key);
    showToast('Данные восстановлены из бэкапа от ' + (new Date(list[0].backupAt).toLocaleString('ru-RU') || list[0].backupAt));
  }catch(err){
    showToast('Не удалось восстановить бэкап: ' + err.message);
  }
});
