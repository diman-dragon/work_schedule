/* photo/day-photo-input-bindings.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
dayPhotoAddBtn.addEventListener('click', () => dayPhotoInput.click());
dayPhotoInput.addEventListener('change', async () => {
  const file = dayPhotoInput.files && dayPhotoInput.files[0];
  dayPhotoInput.value = ''; // сбрасываем, чтобы повторный выбор того же файла тоже сработал
  if(!file) return;
  if(!file.type.startsWith('image/')){ showToast('Выберите файл изображения'); return; }
  try{
    dayPhotoAddBtn.disabled = true;
    dayPhotoAddBtn.textContent = 'Обработка…';
    const compressed = await compressImageFile(file);
    setDayPhotoPreview(compressed);
  }catch(err){
    console.error('Не удалось обработать фото', err);
    showToast('Не удалось обработать фото: ' + err.message);
  }finally{
    dayPhotoAddBtn.disabled = false;
    dayPhotoAddBtn.textContent = 'Добавить фото';
  }
});
dayPhotoRemoveBtn.addEventListener('click', () => setDayPhotoPreview(null));
