/* photo/day-photo-lightbox-bindings.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
dayPhotoPreview.addEventListener('click', () => { if(pendingDayPhoto) openPhotoLightbox(pendingDayPhoto); });
dayPhotoPreview.addEventListener('keydown', (e) => {
  if((e.key === 'Enter' || e.key === ' ') && pendingDayPhoto){ e.preventDefault(); openPhotoLightbox(pendingDayPhoto); }
});
$('photoLightboxCloseBtn').addEventListener('click', () => {
  $('photoLightboxOverlay').classList.remove('show');
});
$('photoLightboxOverlay').addEventListener('click', (e) => {
  if(e.target.id === 'photoLightboxOverlay') $('photoLightboxOverlay').classList.remove('show');
});
