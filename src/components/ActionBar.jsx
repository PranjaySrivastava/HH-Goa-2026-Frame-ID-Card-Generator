import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

const CAPTIONS = {
  pfp: "New profile pic, same builder energy. Locked in for HH Goa 2026 \uD83C\uDF0A\uD83D\uDCBB",
  card: "Builder ID: activated \uD83E\uDEAA\uD83C\uDF34 Building at HH Goa 2026 \u2014 see you on the sand."
};

function exportCanvas(canvas, filename) {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 4000);
        resolve();
      },
      "image/png",
      1.0
    );
  });
}

// Uploads the rendered canvas and gets back a share page URL whose
// og:image / twitter:image point at the real generated graphic, so the
// X link preview shows it instead of a blank/default thumbnail.
async function createShareLink(canvas, mode, caption) {
  const dataUrl = canvas.toDataURL("image/png");

  const res = await fetch("/api/share/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: dataUrl, mode, caption })
  });

  if (!res.ok) throw new Error(`share/create failed: ${res.status}`);
  const data = await res.json();
  if (!data.shareUrl) throw new Error("share/create returned no shareUrl");
  return data.shareUrl;
}

export default function ActionBar({ canvasRef, mode, disabled }) {
  const [note, setNote] = useState("");
  const [sharing, setSharing] = useState(false);

  const filename = () => (mode === "pfp" ? "hhgoa2026-pfp-frame.png" : "hhgoa2026-builder-id.png");

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    await exportCanvas(canvasRef.current, filename());
  };

  const openIntent = (text, url) => {
    const params = new URLSearchParams({ text });
    if (url) params.set("url", url);
    window.open(`https://x.com/intent/tweet?${params.toString()}`, "_blank", "noopener");
  };

  const handleShare = async () => {
    if (!canvasRef.current || sharing) return;
    setSharing(true);
    const text = `${CAPTIONS[mode]} #FramedINGoa`;

    try {
      // Primary path: upload the render, share a link with a real preview.
      const shareUrl = await createShareLink(canvasRef.current, mode, text);
      openIntent(text, shareUrl);
      setNote("Posted with a live preview of your image \u2728");
    } catch (err) {
      console.warn("Share link upload failed, falling back to manual attach:", err);
      // Fallback: download the PNG and open a text-only intent so the
      // flow never dead-ends if the upload API isn't reachable/configured.
      await exportCanvas(canvasRef.current, filename());
      openIntent(text);
      setNote("Image downloaded — attach it to your tweet on X!");
    } finally {
      setSharing(false);
      setTimeout(() => setNote(""), 6000);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-2.5 mt-4">
        <button
          type="button"
          disabled={disabled}
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 rounded-[11px] py-3 font-display font-semibold text-sm bg-black/30 text-white border border-white/20 hover:bg-black/50 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97] transition-all"
        >
          <Download size={16} />
          Download PNG
        </button>
        <button
          type="button"
          disabled={disabled || sharing}
          onClick={handleShare}
          className="flex items-center justify-center gap-2 rounded-[11px] py-3 font-display font-semibold text-sm bg-hh-pink text-white hover:bg-hh-pink/95 hover:scale-[1.02] shadow-[0_8px_18px_-6px_rgba(255,46,166,0.5)] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97] transition-all"
        >
          {sharing ? <Loader2 size={16} className="animate-spin" /> : <XGlyph />}
          {sharing ? "Preparing\u2026" : "Share on X"}
        </button>
      </div>
      <div className={"font-mono text-[11px] text-center mt-2.5 min-h-[14px] " + (note ? "text-gold" : "text-transparent")}>
        {note || "placeholder"}
      </div>
    </div>
  );
}

function XGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2H21.5l-7.5 8.57L22.75 22h-6.86l-5.37-6.98L4.32 22H1.06l8.03-9.17L1 2h7.03l4.86 6.42L18.244 2Zm-1.2 18h1.9L7.03 4h-1.9l11.914 16Z" />
    </svg>
  );
}
