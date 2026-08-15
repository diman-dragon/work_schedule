/* driveApiError: one application-level function per file. */
async function driveApiError(res, action){
  let detail = '';
  try{
    const body = await res.json();
    detail = (body && body.error && (body.error.message || (body.error.errors && body.error.errors[0] && body.error.errors[0].reason))) || '';
  }catch(e){ /* ignore, body wasn't JSON */ }
  return new Error(`${action}: ${res.status}${detail ? ' — ' + detail : ''}`);
}
