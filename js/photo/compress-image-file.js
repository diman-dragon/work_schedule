/* photo/compress-image-file.js
 * Автоматически выделено из монолитного index.html при разбиении на модули.
 */
function compressImageFile(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Файл повреждён или это не изображение'));
      img.onload = () => {
        const MAX_SIDE = 1600;
        let { width, height } = img;
        if(width > MAX_SIDE || height > MAX_SIDE){
          const ratio = Math.min(MAX_SIDE/width, MAX_SIDE/height);
          width = Math.round(width*ratio);
          height = Math.round(height*ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff'; // на случай PNG с прозрачностью — чтобы не стало чёрным на JPEG
        ctx.fillRect(0,0,width,height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
