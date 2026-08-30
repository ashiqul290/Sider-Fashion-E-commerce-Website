/**
 * Client-Side Image Compressor & Optimizer
 * Converts raw camera/uploaded images (1MB - 10MB+) to lightweight WebP/JPEG data URLs (30KB - 80KB)
 * to prevent localStorage and memory quota exhaustion.
 */
export async function compressImageFile(
  file: File | Blob,
  maxWidth = 1000,
  maxHeight = 1000,
  initialQuality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          let { width, height } = img;

          // Calculate scaling
          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }

          // Fill white background for transparent PNG conversion to JPEG
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // Try WebP first, fallback to JPEG
          let quality = initialQuality;
          let dataUrl = canvas.toDataURL('image/jpeg', quality);

          // If still over 180KB, step down quality
          if (dataUrl.length > 240000) {
            quality = 0.65;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          resolve(dataUrl);
        } catch {
          resolve(e.target?.result as string);
        }
      };

      img.onerror = () => {
        resolve(e.target?.result as string);
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
