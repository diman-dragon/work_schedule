/* saveJsonFile: one application-level function per file. */
async function saveJsonFile(){
  const exportObj = { schemaVersion: DATA_SCHEMA_VERSION, exportedAt: new Date().toISOString(), rate, currentKey, order, months: DATA, hiddenShiftTimes: Array.from(hiddenShiftTimes) };
  const json = JSON.stringify(exportObj, null, 2);
  if(window.showSaveFilePicker){
    try{
      const handle = await window.showSaveFilePicker({
        suggestedName: 'график_данные.json',
        types: [{ description: 'JSON файл', accept: {'application/json': ['.json']} }]
      });
      const writable = await handle.createWritable();
      await writable.write(json);
      await writable.close();
      showToast('Файл сохранён');
      return;
    } catch(err){
      if(err.name === 'AbortError') return; // пользователь закрыл диалог — ничего не делаем
      console.error('Не удалось сохранить через системный диалог', err);
    }
  }
  try{
    const blob = new Blob([json], {type:'application/json;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'график_данные.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    showToast('Данные сохранены в JSON-файл');
  } catch(err){
    showToast('Не получилось сохранить: ' + err.message);
  }
}
