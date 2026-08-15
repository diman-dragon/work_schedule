/* loadJsonFile: one application-level function per file. */
async function loadJsonFile(){
  if(window.showOpenFilePicker){
    try{
      const [handle] = await window.showOpenFilePicker({
        types: [{ description: 'JSON файл', accept: {'application/json': ['.json']} }]
      });
      const file = await handle.getFile();
      const text = await file.text();
      applyLoadedJson(text, file.name);
      return;
    } catch(err){
      if(err.name === 'AbortError') return;
      console.error('Не удалось открыть через системный диалог', err);
    }
  }
  loadFileInput.click();
}
