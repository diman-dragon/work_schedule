/* getTodayYM: one application-level function per file. */
function getTodayYM(){
  const now = new Date();
  return { y: now.getFullYear(), m: now.getMonth()+1 };
}
