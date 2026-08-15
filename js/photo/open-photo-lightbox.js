/* photo/open-photo-lightbox.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
function openPhotoLightbox(src){
  $('photoLightboxImg').src = src;
  $('photoLightboxOverlay').classList.add('show');
}
