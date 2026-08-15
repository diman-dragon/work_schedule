/* photo/open-photo-lightbox.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
function openPhotoLightbox(src){
  document.getElementById('photoLightboxImg').src = src;
  document.getElementById('photoLightboxOverlay').classList.add('show');
}
