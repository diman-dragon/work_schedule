/* b64encode: one application-level function per file. */
function b64encode(bytes){
  let bin = '';
  bytes.forEach(b => bin += String.fromCharCode(b));
  return btoa(bin);
}
