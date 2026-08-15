/* requestCloudToken: one application-level function per file. */
function requestCloudToken(interactive){
  return new Promise((resolve, reject) => {
    let client;
    try{ client = ensureTokenClient(); } catch(err){ reject(err); return; }
    client.callback = (resp) => {
      if(resp && resp.access_token){ cloudAccessToken = resp.access_token; resolve(resp.access_token); }
      else reject(new Error('Не удалось получить доступ к Google-аккаунту'));
    };
    client.error_callback = (err) => reject(new Error(err && err.type ? err.type : 'Ошибка авторизации Google'));
    client.requestAccessToken({ prompt: interactive ? 'consent' : '' });
  });
}
