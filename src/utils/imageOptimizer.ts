/**
 * 100% Free Client-Side Image Optimizer
 * Resizes, crops, and compresses user-uploaded avatar to lightweight Base64 string in browser memory.
 * No server or cloud storage needed!
 */
export async function optimizeUserImage(
  file: File,
  targetSize = 200,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = targetSize;
        canvas.height = targetSize;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context not available"));
          return;
        }

        // Center crop to square
        const minDim = Math.min(img.width, img.height);
        const startX = (img.width - minDim) / 2;
        const startY = (img.height - minDim) / 2;

        ctx.drawImage(
          img,
          startX,
          startY,
          minDim,
          minDim,
          0,
          0,
          targetSize,
          targetSize
        );

        // Convert to lightweight JPEG or WebP data URL
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };

      img.onerror = () => reject(new Error("Image failed to load"));
      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = () => reject(new Error("File failed to read"));
    reader.readAsDataURL(file);
  });
}
