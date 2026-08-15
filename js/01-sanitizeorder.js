/* sanitizeOrder: one application-level function per file. */
function sanitizeOrder(ord, data){
  return (Array.isArray(ord) ? ord : []).filter(k => data && data[k]);
}
