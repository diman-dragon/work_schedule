/* photo/day-photo-lightbox-bindings.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
dayPhotoPreview.addEventListener('click', () => { if(pendingDayPhoto) openPhotoLightbox(pendingDayPhoto); });
dayPhotoPreview.addEventListener('keydown', (e) => {
  if((e.key === 'Enter' || e.key === ' ') && pendingDayPhoto){ e.preventDefault(); openPhotoLightbox(pendingDayPhoto); }
});
document.getElementById('photoLightboxCloseBtn').addEventListener('click', () => {
  document.getElementById('photoLightboxOverlay').classList.remove('show');
});
document.getElementById('photoLightboxOverlay').addEventListener('click', (e) => {
  if(e.target.id === 'photoLightboxOverlay') document.getElementById('photoLightboxOverlay').classList.remove('show');
});
