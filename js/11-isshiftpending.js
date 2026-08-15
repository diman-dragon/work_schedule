/* isShiftPending: one application-level function per file. */
function isShiftPending(d){
  const endDt = shiftEndDateTime(d);
  if(!endDt) return false;
  return endDt.getTime() > Date.now();
}
