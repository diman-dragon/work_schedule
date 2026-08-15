/* driveDownloadFile: one application-level function per file. */
async function driveDownloadFile(fileId){
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${cloudAccessToken}` }
  });
  if(!res.ok) throw await driveApiError(res, 'Ошибка загрузки с Диска');
  return res.text();
}
