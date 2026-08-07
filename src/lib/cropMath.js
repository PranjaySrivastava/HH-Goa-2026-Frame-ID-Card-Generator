// Computes a source rectangle (in image pixel space) that "covers" a
// destination box of ratio boxW/boxH, honoring an extra zoom factor and a
// normalized focal point (cx, cy in [0,1]) so users can reposition
// off-center subjects without a manual crop step.
export function getCropRect(imgW, imgH, boxW, boxH, zoom, cx, cy) {
  const boxRatio = boxW / boxH;
  let sw0, sh0;

  if (imgW / imgH > boxRatio) {
    sh0 = imgH;
    sw0 = sh0 * boxRatio;
  } else {
    sw0 = imgW;
    sh0 = sw0 / boxRatio;
  }

  const sw = sw0 / zoom;
  const sh = sh0 / zoom;
  const slackX = Math.max(imgW - sw, 0);
  const slackY = Math.max(imgH - sh, 0);
  const sx = slackX * clamp01(cx);
  const sy = slackY * clamp01(cy);

  return { sx, sy, sw, sh, slackX, slackY };
}

export function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}
