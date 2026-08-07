export function isHeicFile(file) {
  const name = (file.name || "").toLowerCase();
  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  );
}

// Converts a File/Blob to an HTMLImageElement, transparently converting
// HEIC/HEIF (iPhone default format) to JPEG first via heic2any.
export async function fileToImage(file) {
  let blob = file;

  if (isHeicFile(file)) {
    try {
      const { heicTo } = await import("heic-to");
      blob = await heicTo({ blob: file, type: "image/jpeg", quality: 0.92 });
    } catch (err) {
      console.error("[loadImage] HEIC conversion failed:", err);
      throw err;
    }
  }

  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Could not decode image"));
      el.src = url;
    });
    return { img, url };
  } catch (err) {
    URL.revokeObjectURL(url);
    throw err;
  }
}
