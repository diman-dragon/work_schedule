/* day-modal/modal-dirty-tracking.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// Warn before leaving with unsaved form data.
  let modalDirty = false;
  ['startInput','endInput','busInput','routeInput'].forEach(id => {
    $(id)?.addEventListener('input', () => { modalDirty = true; });
  });
  $('saveBtn')?.addEventListener('click', () => { modalDirty = false; });
  $('cancelBtn')?.addEventListener('click', () => { modalDirty = false; });
