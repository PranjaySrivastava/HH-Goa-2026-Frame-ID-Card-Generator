// ISO-BMFF "ftyp" box brands that indicate HEIC/HEIF content. We check the
// file's actual bytes for these (see sniffIsHeic below) rather than trusting
// only the filename/MIME type, because a phone, export tool, or the person
// themself can save real HEIC data under a mismatched name (e.g. "photo.png"
// after a re-save/AirDrop) -- and the browser reports file.type from that
// same unreliable name, not from the content.
const HEIC_BRANDS = new Set([
  "heic", "heix", "heim", "heis", // HEIC still image (incl. sequences)
  "hevc", "hevx", "hevm", "hevs", // HEIC image sequences
  "mif1", "msf1"                  // generic HEIF still image / sequence
]);

// Reads the first 12 bytes of a File/Blob and checks whether they form an
// ISO-BMFF "ftyp" box advertising one of the brands above. Never throws --
// returns false for anything too short, unreadable, or not ISO-BMFF, so
// it's safe to call on arbitrary files.
async function sniffIsHeic(file) {
  try {
    const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    if (bytes.length < 12) return false;
    const ascii = (start, end) => String.fromCharCode(...bytes.subarray(start, end));
    return ascii(4, 8) === "ftyp" && HEIC_BRANDS.has(ascii(8, 12).toLowerCase());
  } catch {
    return false;
  }
}

export async function isHeicFile(file) {
  const name = (file.name || "").toLowerCase();
  if (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  ) {
    return true;
  }
  // Name/MIME say "not HEIC", but a mislabeled file would say that too --
  // confirm against the actual bytes before trusting the label.
  return sniffIsHeic(file);
}

function decodeToImage(blob) {
  const url = URL.createObjectURL(blob);
  return new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve({ img: el, url });
    el.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not decode image"));
    };
    el.src = url;
  });
}

async function convertHeic(file) {
  try {
    const { heicTo } = await import("heic-to");
    return await heicTo({ blob: file, type: "image/jpeg", quality: 0.92 });
  } catch (err) {
    console.error("[loadImage] HEIC conversion failed:", err);
    throw new Error(`HEIC conversion failed: ${err?.message || err}`);
  }
}

// Converts a File/Blob to an HTMLImageElement, transparently converting
// HEIC/HEIF (iPhone default format) to JPEG first via heic-to.
export async function fileToImage(file) {
  if (await isHeicFile(file)) {
    return decodeToImage(await convertHeic(file));
  }

  // Not flagged as HEIC by name, MIME, or content sniffing -- try decoding
  // directly. If the browser still can't decode it (e.g. an HEIC variant
  // our sniffer doesn't recognize), fall back to HEIC conversion once
  // before giving up, since that's the most common real-world reason an
  // otherwise-valid-looking photo fails to decode.
  try {
    return await decodeToImage(file);
  } catch (err) {
    try {
      return await decodeToImage(await convertHeic(file));
    } catch {
      throw err;
    }
  }
}
