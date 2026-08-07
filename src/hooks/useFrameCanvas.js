import { useCallback, useEffect, useRef } from "react";
import { CANVAS_SIZES, renderToCanvas } from "../lib/canvasRender.js";
import { getCropRect, clamp01 } from "../lib/cropMath.js";

// Encapsulates the <canvas> element, its 2D context, and pointer-drag /
// zoom-to-reposition behavior for the currently loaded image.
export function useFrameCanvas({ mode, img, zoom, focal, setFocal, cardFields }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const dragState = useRef({ dragging: false, lastX: 0, lastY: 0 });

  const size = CANVAS_SIZES[mode];

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Keep the backing resolution in sync with the active mode/size on
    // every draw so it's correct even the first time the canvas mounts
    // (e.g. right after an image finishes loading).
    if (canvas.width !== size.w || canvas.height !== size.h) {
      canvas.width = size.w;
      canvas.height = size.h;
    }
    const ctx = canvas.getContext("2d");
    const payload = {
      img,
      zoom,
      cx: focal.x,
      cy: focal.y,
      ...cardFields
    };
    renderToCanvas(ctx, canvas, mode, payload);
  }, [mode, img, zoom, focal, cardFields, size]);

  useEffect(() => {
    draw();
  }, [draw]);

  const getPoint = (e) => {
    const t = (e.touches && e.touches[0]) || e;
    return { x: t.clientX, y: t.clientY };
  };

  const onPointerDown = (e) => {
    if (!img) return;
    dragState.current.dragging = true;
    const p = getPoint(e);
    dragState.current.lastX = p.x;
    dragState.current.lastY = p.y;
    if (frameRef.current?.setPointerCapture && e.pointerId != null) {
      frameRef.current.setPointerCapture(e.pointerId);
    }
  };

  const onPointerMove = (e) => {
    if (!dragState.current.dragging || !img || !frameRef.current) return;
    const p = getPoint(e);
    const dx = p.x - dragState.current.lastX;
    const dy = p.y - dragState.current.lastY;
    dragState.current.lastX = p.x;
    dragState.current.lastY = p.y;

    const rect = frameRef.current.getBoundingClientRect();
    const crop = getCropRect(img.naturalWidth || img.width, img.naturalHeight || img.height, size.w, size.h, zoom, focal.x, focal.y);
    const scaleX = crop.sw / rect.width;
    const scaleY = crop.sh / rect.height;

    setFocal((prev) => {
      const next = { ...prev };
      if (crop.slackX > 0) next.x = clamp01(prev.x - (dx * scaleX) / crop.slackX);
      if (crop.slackY > 0) next.y = clamp01(prev.y - (dy * scaleY) / crop.slackY);
      return next;
    });
  };

  const endDrag = () => {
    dragState.current.dragging = false;
  };

  return {
    canvasRef,
    frameRef,
    size,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerLeave: endDrag,
      onPointerCancel: endDrag
    }
  };
}
