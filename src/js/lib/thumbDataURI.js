export default (image, dSize = 256) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    const img = new Image();
    const canvas = document.createElement('canvas');
    canvas.width = dSize;
    canvas.height = dSize;
    reader.addEventListener('load', () => {
      img.addEventListener('load', () => {
        if (img.width === img.height) {
          canvas.getContext('2d').drawImage(img, 0, 0, dSize, dSize);
        } else {
          canvas
            .getContext('2d')
            .drawImage(
              img,
              img.width > img.height ? (img.width - img.height) / 2 : 0,
              img.width > img.height ? 0 : (img.height - img.width) / 2,
              img.width > img.height ? img.height : img.width,
              img.width > img.height ? img.height : img.width,
              0,
              0,
              dSize,
              dSize,
            );
        }
        resolve(canvas.toDataURL());
      });
      img.addEventListener('error', reject);
      img.src = reader.result;
    });
    reader.addEventListener('error', reject);
    reader.readAsDataURL(image);
  });
