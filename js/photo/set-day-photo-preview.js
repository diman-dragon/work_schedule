/* photo/set-day-photo-preview.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
function setDayPhotoPreview(dataUrl){
  pendingDayPhoto = dataUrl || null;
  if(pendingDayPhoto){
    dayPhotoPreview.src = pendingDayPhoto;
    dayPhotoPreview.style.display = 'block';
    dayPhotoHint.style.display = 'block';
    dayPhotoRemoveBtn.style.display = '';
  } else {
    dayPhotoPreview.src = '';
    dayPhotoPreview.style.display = 'none';
    dayPhotoHint.style.display = 'none';
    dayPhotoRemoveBtn.style.display = 'none';
  }
}
