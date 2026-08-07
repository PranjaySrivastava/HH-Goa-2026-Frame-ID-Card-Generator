import { Move, ZoomIn, ZoomOut } from "lucide-react";

export default function CanvasPreview({ canvasRef, frameRef, handlers, size, zoom, onZoomChange }) {
  return (
    <div>
      <div
        ref={frameRef}
        className="relative w-full rounded-2xl overflow-hidden bg-black touch-none cursor-grab active:cursor-grabbing shadow-[inset_0_0_0_1px_rgba(245,241,230,0.08)]"
        style={{ aspectRatio: `${size.w} / ${size.h}` }}
        {...handlers}
      >
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>

      <div className="font-mono flex items-center justify-center gap-1.5 text-[11px] text-sand-dim mt-2">
        <Move size={13} />
        drag photo to reposition
      </div>

      <div className="flex items-center gap-2.5 mt-3">
        <ZoomOut size={15} className="text-sand-dim shrink-0" />
        <input
          type="range"
          min={100}
          max={300}
          value={Math.round(zoom * 100)}
          onChange={(e) => onZoomChange(Number(e.target.value) / 100)}
          aria-label="Zoom"
        />
        <ZoomIn size={15} className="text-sand-dim shrink-0" />
      </div>
    </div>
  );
}
