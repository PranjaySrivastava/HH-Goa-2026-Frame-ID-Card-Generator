
import { getCropRect } from "./cropMath.js";

export const CANVAS_SIZES = {
  pfp: { w: 1080, h: 1080 },
  card: { w: 1200, h: 675 }
};

// --- HELPER FUNCTIONS ---

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

// --- AESTHETIC DRAWING FUNCTIONS ---

function drawArcTextWithBg(ctx, text, cx, cy, radius, font, textColor) {
  ctx.save();
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const widths = [];
  let total = 0;
  for (let i = 0; i < text.length; i++) {
    const w = ctx.measureText(text[i]).width + 4;
    widths.push(w);
    total += w;
  }

  ctx.translate(cx, cy);
  ctx.rotate(-(total / radius) / 2);
  ctx.fillStyle = textColor;

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

function drawEnhancedSun(ctx, cx, cy, r, fill, rayColor) {
  ctx.save();
  // Draw Rays
  ctx.strokeStyle = rayColor;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  for (let i = 0; i < 9; i++) {
    const a = Math.PI + (i / 8) * Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * (r + 15), cy + Math.sin(a) * (r + 15));
    ctx.lineTo(cx + Math.cos(a) * (r + 40), cy + Math.sin(a) * (r + 40));
    ctx.stroke();
  }
  // Draw Sun Body
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // Draw Sunset Reflection lines
  ctx.fillRect(cx - r * 0.8, cy + 10, r * 1.6, 6);
  ctx.fillRect(cx - r * 0.5, cy + 25, r, 6);
  ctx.fillRect(cx - r * 0.2, cy + 40, r * 0.4, 6);
  ctx.restore();
}

function drawFilledPalmTree(ctx, x, y, scale, rotation = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);

  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "#0E6B3A";
  ctx.lineWidth = 1.5;

  // Trunk
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-15, -60, -10, -120);
  ctx.quadraticCurveTo(5, -60, 10, 0);
  ctx.fill();

  const tx = -10;
  const ty = -115;

  // Fronds
  const drawFrond = (cx, cy, ex, ey) => {
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.quadraticCurveTo(cx, cy, ex, ey);
    ctx.quadraticCurveTo(cx - 10, cy + 10, tx, ty);
    ctx.fill();
    ctx.stroke();
  };

  drawFrond(tx - 40, ty - 20, tx - 70, ty + 20);
  drawFrond(tx - 30, ty - 50, tx - 80, ty - 10);
  drawFrond(tx - 10, ty - 70, tx - 30, ty - 80);
  drawFrond(tx + 40, ty - 20, tx + 70, ty + 20);
  drawFrond(tx + 30, ty - 50, tx + 80, ty - 10);
  drawFrond(tx + 10, ty - 70, tx + 30, ty - 80);
  drawFrond(tx, ty - 80, tx + 5, ty - 100);

  ctx.restore();
}

function drawBeachHut(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "#0E6B3A";
  ctx.lineWidth = 2;
  ctx.fillRect(-40, -50, 80, 50);
  ctx.strokeRect(-40, -50, 80, 50);

  ctx.strokeRect(-25, -35, 50, 20);

  ctx.fillStyle = "#FF2EA6";
  ctx.beginPath();
  ctx.moveTo(-50, -50);
  ctx.lineTo(0, -80);
  ctx.lineTo(50, -50);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#FFC857";
  ctx.fillRect(-25, -65, 50, 15);
  ctx.strokeRect(-25, -65, 50, 15);
  ctx.fillStyle = "#0E6B3A";
  ctx.font = "bold 8px 'Space Grotesk'";
  ctx.textAlign = "center";
  ctx.fillText("GOA BEACH", 0, -55);

  ctx.restore();
}

function drawSimpleWaves(ctx, W, yBase) {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineWidth = 2.5;

  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    let y = yBase + (i * 15);
    ctx.moveTo(0, y);
    for (let x = 0; x < W; x += 40) {
      ctx.quadraticCurveTo(x + 20, y - 8, x + 40, y);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function drawPost(ctx, x, y, width, height) {
  ctx.save();
  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "#0E6B3A";
  ctx.lineWidth = 3;
  ctx.fillRect(x, y, width, height);
  ctx.strokeRect(x, y, width, height);

  ctx.beginPath();
  ctx.strokeStyle = "rgba(14, 107, 58, 0.4)";
  ctx.moveTo(x + 8, y + 20);
  ctx.lineTo(x + 8, y + height - 20);
  ctx.moveTo(x + 22, y + 10);
  ctx.lineTo(x + 22, y + height - 40);
  ctx.stroke();
  ctx.restore();
}

function drawSignboard(ctx, x, y, width, height, text, bgCol, textCol, direction) {
  ctx.save();
  ctx.fillStyle = bgCol;
  ctx.beginPath();
  if (direction === "left") {
    ctx.moveTo(x + 20, y);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + 20, y + height);
    ctx.lineTo(x, y + height / 2);
  } else {
    ctx.moveTo(x, y);
    ctx.lineTo(x + width - 20, y);
    ctx.lineTo(x + width, y + height / 2);
    ctx.lineTo(x + width - 20, y + height);
    ctx.lineTo(x, y + height);
  }
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#0E6B3A";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = textCol;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  let fontSize = 18;
  ctx.font = `bold ${fontSize}px 'Space Grotesk', sans-serif`;
  ctx.fillText(text, x + width / 2, y + height / 2 + 1);
  ctx.restore();
}

// --- RENDER FUNCTIONS ---

export function renderPfp(ctx, canvas, { img, zoom, cx: fx, cy: fy }) {
  const W = canvas.width;
  const H = canvas.height;
  const cx = W / 2;
  const cy = H / 2;

  // Background
  ctx.fillStyle = "#0E6B3A";
  ctx.fillRect(0, 0, W, H);

  // Waves
  drawSimpleWaves(ctx, W, H - 80);

  // Outer Wrapper Ring (Scaled down so top trees don't get cut off)
  const outerR = W * 0.35;
  ctx.fillStyle = "#FFC857";
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.fill();

  // Draw circular palm trees (Scaled & repositioned)
  for (let i = 0; i < 8; i++) {
    let angle = (i / 8) * Math.PI * 2;
    let px = cx + Math.cos(angle) * (outerR + 10);
    let py = cy + Math.sin(angle) * (outerR + 10);
    drawFilledPalmTree(ctx, px, py, 0.42, angle + Math.PI / 2);
  }

  // Inner Dark Green Cutout for Text
  const textR = W * 0.29;
  ctx.fillStyle = "#0E6B3A";
  ctx.beginPath();
  ctx.arc(cx, cy, textR + 12, 0, Math.PI * 2);
  ctx.fill();

  // Draw Circular Text
  drawArcTextWithBg(
    ctx,
    "HH GOA 2026 \u2022 BUILDER SHORTLIST \u2022 ",
    cx,
    cy,
    textR - 8,
    "bold 26px 'Space Grotesk', sans-serif",
    "#FFC857"
  );

  // Photo Mask & Draw
  const photoR = W * 0.23;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, photoR, 0, Math.PI * 2);
  ctx.clip();
  if (img) {
    drawImageCover(ctx, img, cx - photoR, cy - photoR, photoR * 2, photoR * 2, zoom, fx, fy);
  } else {
    ctx.fillStyle = "#111111";
    ctx.fillRect(cx - photoR, cy - photoR, photoR * 2, photoR * 2);
  }
  ctx.restore();

  // Bold Gradient Border (Pink to Yellow)
  const ringGrad = ctx.createLinearGradient(cx - photoR, cy - photoR, cx + photoR, cy + photoR);
  ringGrad.addColorStop(0, "#FF2EA6");
  ringGrad.addColorStop(1, "#FFC857");

  ctx.beginPath();
  ctx.arc(cx, cy, photoR, 0, Math.PI * 2);
  ctx.lineWidth = 12;
  ctx.strokeStyle = ringGrad;
  ctx.stroke();

  // Corner Hashtag
  ctx.textAlign = "right";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "500 20px 'JetBrains Mono', monospace";
  ctx.fillText("#HackerHouseGoa", W - 30, H - 30);
}

export function renderCard(ctx, canvas, { img, zoom, cx: fx, cy: fy, name, role, title, serial }) {
  const W = canvas.width;
  const H = canvas.height;

  // Background
  ctx.fillStyle = "#0E6B3A";
  ctx.fillRect(0, 0, W, H);

  // Sun moved further right to W * 0.83
  drawEnhancedSun(ctx, W * 0.83, H * 0.42, 100, "#FFC857", "#FFC857");
  drawSimpleWaves(ctx, W, H - 100);

  // Landscape Assets
  drawFilledPalmTree(ctx, W * 0.65, H - 40, 1.1);
  drawFilledPalmTree(ctx, W * 0.88, H - 60, 1.3);
  drawFilledPalmTree(ctx, W * 0.96, H - 30, 0.9);
  drawBeachHut(ctx, W * 0.82, H - 65, 0.75);

  const dividerX = W * 0.32;

  // Photo Frame
  const padding = 40;
  const photoW = dividerX - padding;
  const photoH = H - padding * 2;
  const photoX = padding;
  const photoY = padding;
  const r = 16;

  // Border Behind Photo
  ctx.save();
  const goldGrad = ctx.createLinearGradient(photoX, photoY, photoX, photoY + photoH);
  goldGrad.addColorStop(0, "#F9D423");
  goldGrad.addColorStop(1, "#FF4E50");

  roundRectPath(ctx, photoX - 6, photoY - 6, photoW + 12, photoH + 12, r + 4);
  ctx.fillStyle = goldGrad;
  ctx.fill();
  ctx.restore();

  // Photo
  ctx.save();
  roundRectPath(ctx, photoX, photoY, photoW, photoH, r);
  ctx.clip();
  if (img) {
    drawImageCover(ctx, img, photoX, photoY, photoW, photoH, zoom, fx, fy);
  } else {
    ctx.fillStyle = "#222222";
    ctx.fillRect(photoX, photoY, photoW, photoH);
  }
  ctx.restore();

  const textX = dividerX + 40;

  // Wooden Pole shifted right to W * 0.53 to avoid overlapping photo
  const poleX = W * 0.53;
  drawPost(ctx, poleX, 150, 24, H - 150);

  // Headers
  ctx.textAlign = "left";
  ctx.fillStyle = "#FFC857";
  ctx.font = "bold 16px 'JetBrains Mono', monospace";
  ctx.fillText("HH GOA 2026 \u2022 BUILDER ID", textX, 70);

  // User Name
  const displayName = (name || "YOUR NAME HERE").toUpperCase();
  ctx.fillStyle = "#FFFFFF";
  fitText(ctx, displayName, textX, 115, W - textX - 40, 48, "700", "Space Grotesk");

  // Signboards
  const roleText = (role || "BUILDER").toUpperCase();
  const titleText = (title || "404 SUNBURN NOT FOUND").toUpperCase();
  const boardW = 230;
  const boardH = 45;

  // Left pointing pink board
  drawSignboard(ctx, poleX + 12 - boardW, 180, boardW, boardH, roleText, "#FF2EA6", "#FFFFFF", "left");

  // Right pointing wooden boards
  drawSignboard(ctx, poleX - 12, 265, boardW, boardH, titleText, "#D4A373", "#000000", "right");
  drawSignboard(ctx, poleX - 12, 345, boardW - 10, boardH, "#HackerHouseGoa", "#D4A373", "#000000", "right");

  // Footer / Serial
  ctx.fillStyle = "#A8C3B3";
  ctx.font = "500 14px 'JetBrains Mono', monospace";
  ctx.fillText(serial || "GOA26-1990", photoX, H - 15);

  // Updated Hashtag
  ctx.textAlign = "right";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("#HackerHouseGoa", W - padding, H - 15);
}

export function renderToCanvas(ctx, canvas, mode, payload) {
  if (mode === "pfp") renderPfp(ctx, canvas, payload);
  else renderCard(ctx, canvas, payload);
}