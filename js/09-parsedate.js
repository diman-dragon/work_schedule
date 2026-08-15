/* parseDate: one application-level function per file. */
function parseDate(d){
  const [dd, mm, yyyy] = d.split('.').map(Number);
  return new Date(yyyy, mm-1, dd);
}
