/* cloud/push-to-cloud.js
 * Отправка данных в облако с защитой от затирания.
 */
async function pushToCloud(){
  // ЗАЩИТА ОТ ПОТЕРИ ДАННЫХ: перед записью смотрим, что сейчас лежит в облаке.
  // Если там заметно больше заполненных дней, чем локально, — это почти всегда
  // означает, что устройство пустое (переустановка, очистка данных браузера),
  // и запись затрёт всю историю. Молча этого не делаем: спрашиваем.
  if(!cloudFileId) cloudFileId = await driveFindFile();

  if(cloudFileId){
    try{
      const existingEnc = await driveDownloadFile(cloudFileId);
      const existing = await decryptFromCloud(existingEnc, cloudPassword);
      const remoteFilled = countFilledDays(existing.months);
      const localFilled = countFilledDays(DATA);
      // сравниваем не только количество, но и содержимое — одинаковое число
      // смен ещё не значит одинаковые данные (см. day-fingerprints.js)
      const { onlyInA: onlyRemote } = diffDayFingerprints(existing.months, DATA);

      if(remoteFilled > 0 && (localFilled < remoteFilled || onlyRemote.size > 0)){
        const msg = onlyRemote.size > 0
          ? `В облаке есть изменения (смен: ${onlyRemote.size}), которых нет на этом устройстве. ` +
            `Если продолжить, они будут потеряны. Обычно в такой ситуации нужно сначала нажать ` +
            `«Синхронизировать» ещё раз, чтобы сначала забрать эти изменения, а не затирать их.`
          : `В облаке сохранено смен: ${remoteFilled}, а на этом устройстве только ${localFilled}. ` +
            `Если продолжить, облачная версия будет заменена этой, и ${remoteFilled - localFilled} смен(ы) пропадут. ` +
            `Обычно в такой ситуации нужно наоборот — загрузить данные из облака (кнопка «Загрузить из облака»).`;
        const ok = await showConfirmModal(msg, 'Заменить данные в облаке?', 'Всё равно заменить');
        if(!ok){
          throw new Error('SKIPPED_BY_USER');
        }
      }
    }catch(err){
      // если это наш собственный отказ — пробрасываем дальше
      if(err && err.message === 'SKIPPED_BY_USER') throw err;
      // не смогли прочитать облачную копию (напр. другой пароль) — не рискуем
      // затирать вслепую, сообщаем об этом
      if(err && /OPERATION_FAILED|decrypt/i.test(err.message || '')) throw err;
      // прочие ошибки чтения не блокируют запись
      console.warn('Не удалось проверить облачную копию перед записью', err);
    }
  }

  const payload = {
    schemaVersion: DATA_SCHEMA_VERSION,
    rate, currentKey, order, months: DATA,
    hiddenShiftTimes: Array.from(hiddenShiftTimes),
    hiddenBuses: Array.from(hiddenBuses),
    hiddenRoutes: Array.from(hiddenRoutes),
    updatedAt: APP.updatedAt || Date.now()
  };
  const encrypted = await encryptForCloud(payload, cloudPassword);
  if(!cloudFileId) cloudFileId = await driveCreateFile(encrypted);
  else await driveUpdateFile(cloudFileId, encrypted);
}
