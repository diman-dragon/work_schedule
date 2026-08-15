/* recomputeAll: one application-level function per file. */
function recomputeAll(){
  order.forEach(k => recomputeMonth(k));
}
