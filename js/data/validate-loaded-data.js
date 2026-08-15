/* data/validate-loaded-data.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
function validateLoadedData(obj){
  if(!obj || typeof obj !== 'object') throw new Error('файл не является JSON-объектом');
  if(!obj.months || typeof obj.months !== 'object') throw new Error('в файле отсутствует корректное поле months');
  if(!Array.isArray(obj.order)) throw new Error('в файле отсутствует корректное поле order');
  const keys = Object.keys(obj.months);
  for(const key of keys){
    const m = obj.months[key];
    if(!m || !Array.isArray(m.days) || typeof m.year !== 'number' || typeof m.month !== 'number'){
      throw new Error('структура одного из месяцев повреждена');
    }
  }
}
