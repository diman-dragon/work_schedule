/* day-modal/auto-focus-on-open.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
// Auto-focus first useful field in day modal.
  const originalOpenDay = window.openDayModal;
  if(typeof originalOpenDay === 'function'){
    window.openDayModal = function(...args){
      const r = originalOpenDay.apply(this,args);
      setTimeout(() => $('startInput')?.focus(), 80);
      return r;
    };
  }
