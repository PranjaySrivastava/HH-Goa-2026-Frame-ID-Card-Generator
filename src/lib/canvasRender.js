import { getCropRect } from "./cropMath.js";

export const CANVAS_SIZES = {
  pfp: { w: 1080, h: 1080 },
  card: { w: 1200, h: 675 }
};

function drawImageCover(ctx, img, dx, dy, dw, dh, zoom, cx, cy) {
  const crop = getCropRect(img.naturalWidth || img.width, img.naturalHeight || img.height, dw, dh, zoom, cx, cy);
  ctx.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, dx, dy, dw, dh);
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawArcText(ctx, text, cx, cy, radius, font, color, letterSpacingPx = 0) {
  ctx.save();
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const widths = [];
  let total = 0;
  for (let i = 0; i < text.length; i++) {
    const w = ctx.measureText(text[i]).width + letterSpacingPx;
    widths.push(w);
    total += w;
  }

  ctx.translate(cx, cy);
  ctx.rotate(-(total / radius) / 2);

  for (let j = 0; j < text.length; j++) {
    const cw = widths[j];
    ctx.rotate(cw / 2 / radius);
    ctx.save();
    ctx.translate(0, -radius);
    ctx.fillText(text[j], 0, 0);
    ctx.restore();
    ctx.rotate(cw / 2 / radius);
  }
  ctx.restore();
}

function drawSun(ctx, cx, cy, r, color, rayColor) {
  ctx.save();
  ctx.strokeStyle = rayColor;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * (r + 6), cy + Math.sin(a) * (r + 6));
    ctx.lineTo(cx + Math.cos(a) * (r + 14), cy + Math.sin(a) * (r + 14));
    ctx.stroke();
  }
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function fitText(ctx, text, x, y, maxWidth, size, weight, family) {
  let s = size;
  ctx.font = `${weight} ${s}px '${family}', sans-serif`;
  while (ctx.measureText(text).width > maxWidth && s > 14) {
    s -= 2;
    ctx.font = `${weight} ${s}px '${family}', sans-serif`;
  }
  ctx.fillText(text, x, y);
  return s;
}

export function renderPfp(ctx, canvas, { img, zoom, cx: fx, cy: fy }) {
  const W = canvas.width;
  const H = canvas.height;

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0F2E38");
  bg.addColorStop(0.55, "#123A45");
  bg.addColorStop(1, "#081A20");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  drawSun(ctx, W * 0.84, H * 0.16, 26, "#FFC857", "rgba(255,200,87,0.55)");

  const photoR = W * 0.34;
  const cx = W / 2;
  const cy = H / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, photoR, 0, Math.PI * 2);
  ctx.clip();
  if (img) {
    drawImageCover(ctx, img, cx - photoR, cy - photoR, photoR * 2, photoR * 2, zoom, fx, fy);
  } else {
    ctx.fillStyle = "#0B242C";
    ctx.fillRect(cx - photoR, cy - photoR, photoR * 2, photoR * 2);
  }
  ctx.restore();

  const ringGrad = ctx.createLinearGradient(cx - photoR, cy - photoR, cx + photoR, cy + photoR);
  ringGrad.addColorStop(0, "#FF6B4A");
  ringGrad.addColorStop(1, "#FFC857");
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, photoR + 7, 0, Math.PI * 2);
  ctx.lineWidth = 10;
  ctx.strokeStyle = ringGrad;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, photoR + 18, 0, Math.PI * 2);
  ctx.setLineDash([2, 10]);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(245,241,230,0.5)";
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  drawArcText(
    ctx,
    "HH GOA 2026 \u2022 BUILDER SHORTLIST \u2022 ",
    cx,
    cy,
    photoR + 46,
    "600 26px 'Space Grotesk', sans-serif",
    "#F5F1E6",
    2
  );

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(245,241,230,0.55)";
  ctx.font = "500 22px 'JetBrains Mono', monospace";
  ctx.fillText("#FrameInGoa", cx, H - 34);
}

export function renderCard(ctx, canvas, { img, zoom, cx: fx, cy: fy, name, role, title, serial }) {
  const W = canvas.width;
  const H = canvas.height;

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0F2E38");
  bg.addColorStop(1, "#081A20");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // watermark
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "700 240px 'Space Grotesk', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.translate(W * 0.68, H * 0.5);
  ctx.rotate(-0.08);
  ctx.fillText("GOA", 0, 0);
  ctx.restore();

  // wave
  ctx.save();
  ctx.fillStyle = "rgba(78,205,196,0.10)";
  ctx.beginPath();
  ctx.moveTo(0, H * 0.82);
  ctx.bezierCurveTo(W * 0.25, H * 0.72, W * 0.5, H * 0.94, W * 0.75, H * 0.8);
  ctx.bezierCurveTo(W * 0.9, H * 0.72, W, H * 0.8, W, H * 0.78);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  drawSun(ctx, W - 70, 66, 20, "#FFC857", "rgba(255,200,87,0.5)");

  const dividerX = W * 0.365;
  ctx.save();
  ctx.setLineDash([10, 8]);
  ctx.strokeStyle = "rgba(245,241,230,0.22)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(dividerX, 40);
  ctx.lineTo(dividerX, H - 40);
  ctx.stroke();
  ctx.restore();

  const padding = 46;
  const photoW = dividerX - padding * 1.4;
  const photoH = H - padding * 2;
  const photoX = padding * 0.7;
  const photoY = padding;
  const r = 22;

  ctx.save();
  roundRectPath(ctx, photoX, photoY, photoW, photoH, r);
  ctx.clip();
  if (img) {
    drawImageCover(ctx, img, photoX, photoY, photoW, photoH, zoom, fx, fy);
  } else {
    ctx.fillStyle = "#0B242C";
    ctx.fillRect(photoX, photoY, photoW, photoH);
  }
  ctx.restore();

  ctx.save();
  roundRectPath(ctx, photoX, photoY, photoW, photoH, r);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(255,200,87,0.65)";
  ctx.stroke();
  ctx.restore();

  const textX = dividerX + 44;
  ctx.textAlign = "left";
  ctx.fillStyle = "#4ECDC4";
  ctx.font = "600 20px 'JetBrains Mono', monospace";
  ctx.fillText("HH GOA 2026 \u00B7 BUILDER ID", textX, 66);

  const displayName = (name || "Your Name Here").toUpperCase();
  ctx.fillStyle = "#F5F1E6";
  fitText(ctx, displayName, textX, 128, W - textX - 40, 54, "700", "Space Grotesk");

  const displayRole = role || "Builder";
  ctx.font = "600 22px 'Inter', sans-serif";
  const roleW = ctx.measureText(displayRole).width + 34;
  roundRectPath(ctx, textX, 156, roleW, 40, 20);
  ctx.fillStyle = "rgba(255,107,74,0.18)";
  ctx.fill();
  ctx.save();
  roundRectPath(ctx, textX, 156, roleW, 40, 20);
  ctx.strokeStyle = "rgba(255,107,74,0.55)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
  ctx.fillStyle = "#FF9C82";
  ctx.textBaseline = "middle";
  ctx.fillText(displayRole, textX + 17, 176);
  ctx.textBaseline = "alphabetic";

  const displayTitle = title || "Builder";
  ctx.fillStyle = "rgba(245,241,230,0.5)";
  ctx.font = "500 15px 'JetBrains Mono', monospace";
  ctx.fillText("BUILDER TITLE", textX, 238);
  ctx.fillStyle = "#FFC857";
  fitText(ctx, `\u2726 ${displayTitle}`, textX, 274, W - textX - 40, 30, "600", "Space Grotesk");

  ctx.fillStyle = "rgba(245,241,230,0.4)";
  ctx.font = "500 16px 'JetBrains Mono', monospace";
  ctx.fillText(serial || "GOA26-0000", textX, H - 34);

  ctx.textAlign = "right";
  ctx.fillText("#FrameInGoa", W - 40, H - 34);
  ctx.textAlign = "left";
}

export function renderToCanvas(ctx, canvas, mode, payload) {
  if (mode === "pfp") renderPfp(ctx, canvas, payload);
  else renderCard(ctx, canvas, payload);
}
