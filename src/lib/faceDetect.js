import { getCropRect, clamp01 } from "./cropMath.js";

let modelPromise = null;
let faceapiPromise = null;

// Lazily imports the face-api.js bundle and loads the (tiny, ~190KB) tiny
// face detector model. Both only happen once, on first use, so a page load
// that never uploads a photo never pays this cost.
async function ensureModel() {
  if (!faceapiPromise) {
    faceapiPromise = import("@vladmandic/face-api");
  }
  const faceapi = await faceapiPromise;

  if (!modelPromise) {
    modelPromise = faceapi.nets.tinyFaceDetector.loadFromUri("/models");
  }
  await modelPromise;
  return faceapi;
}

// Runs face detection on a loaded <img>. Returns the face's center as a
// fraction of the image's full pixel dimensions ({x, y} in [0,1]), or null
// if detection is unavailable / no face was found — callers should fall
// back to a plain center crop in that case.
export async function detectFaceCenter(img) {
  try {
    const faceapi = await ensureModel();
    const detection = await faceapi.detectSingleFace(
      img,
      new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 })
    );
    if (!detection) return null;

    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    const { x, y, width, height } = detection.box;

    return {
      x: clamp01((x + width / 2) / w),
      y: clamp01((y + height / 2) / h)
    };
  } catch (err) {
    console.warn("Face detection unavailable, falling back to center crop:", err);
    return null;
  }
}

// Converts a face center (fraction of full image) into the "focal"
// coordinate space our cropMath uses (a fraction of the available crop
// slack for a given box size + zoom), so the crop is centered on the face
// rather than the geometric center of the photo.
export function focalFromFaceCenter(imgW, imgH, boxW, boxH, zoom, faceCenter) {
  const base = getCropRect(imgW, imgH, boxW, boxH, zoom, 0.5, 0.5);
  const faceXpx = faceCenter.x * imgW;
  const faceYpx = faceCenter.y * imgH;

  let cx = 0.5;
  let cy = 0.5;
  if (base.slackX > 0) cx = clamp01((faceXpx - base.sw / 2) / base.slackX);
  if (base.slackY > 0) cy = clamp01((faceYpx - base.sh / 2) / base.slackY);

  return { x: cx, y: cy };
}
