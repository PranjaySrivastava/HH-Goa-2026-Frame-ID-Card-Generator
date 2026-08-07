import { useEffect, useMemo, useRef, useState } from "react";
import ModeToggle from "./ModeToggle.jsx";
import Dropzone from "./Dropzone.jsx";
import CanvasPreview from "./CanvasPreview.jsx";
import IdCardForm from "./IdCardForm.jsx";
import ActionBar from "./ActionBar.jsx";
import { useFrameCanvas } from "../hooks/useFrameCanvas.js";
import { fileToImage } from "../lib/loadImage.js";
import { randomBuilderTitle } from "../lib/builderTitles.js";
import { detectFaceCenter, focalFromFaceCenter } from "../lib/faceDetect.js";
import { CANVAS_SIZES } from "../lib/canvasRender.js";

export default function AppCard() {
  const [mode, setMode] = useState("pfp");
  const [img, setImg] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [focal, setFocal] = useState({ x: 0.5, y: 0.5 });
  const [serial, setSerial] = useState("");
  const [status, setStatus] = useState("");

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [title, setTitle] = useState("");

  // guards against a slow face-detection result overwriting a newer upload
  const uploadIdRef = useRef(0);

  const cardFields = useMemo(() => ({ name, role, title, serial }), [name, role, title, serial]);

  const { canvasRef, frameRef, size, handlers } = useFrameCanvas({
    mode,
    img,
    zoom,
    focal,
    setFocal,
    cardFields
  });

  // revoke object URLs on unmount
  useEffect(() => {
    return () => {
      if (img?._objectUrl) URL.revokeObjectURL(img._objectUrl);
    };
  }, [img]);

  const handleFile = async (file) => {
    const thisUpload = ++uploadIdRef.current;
    setStatus("Reading photo\u2026");
    try {
      const { img: loadedImg, url } = await fileToImage(file);
      if (thisUpload !== uploadIdRef.current) return; // a newer upload started meanwhile

      loadedImg._objectUrl = url;
      setImg(loadedImg);
      setZoom(1);
      setFocal({ x: 0.5, y: 0.5 });
      setSerial(`GOA26-${Math.floor(1000 + Math.random() * 9000)}`);
      if (!title) setTitle(randomBuilderTitle());
      setStatus("Auto-centering on your face\u2026");

      // Non-blocking: the preview above already looks correct with a plain
      // center crop, so face detection only refines the focal point once
      // it resolves rather than delaying the initial render.
      const faceCenter = await detectFaceCenter(loadedImg);
      if (thisUpload !== uploadIdRef.current) return;

      if (faceCenter) {
        const box = CANVAS_SIZES[mode];
        const focal = focalFromFaceCenter(
          loadedImg.naturalWidth || loadedImg.width,
          loadedImg.naturalHeight || loadedImg.height,
          box.w,
          box.h,
          1,
          faceCenter
        );
        setFocal(focal);
        setStatus("Auto-centered on your face \u2713");
      } else {
        setStatus("No face detected \u2014 drag to reposition");
      }
      setTimeout(() => {
        if (thisUpload === uploadIdRef.current) setStatus("");
      }, 2200);
    } catch (err) {
      if (thisUpload !== uploadIdRef.current) return;
      setStatus(
        err?.message?.includes("HEIC") || file.name?.toLowerCase().endsWith(".heic")
          ? "That HEIC file wouldn't convert \u2014 try exporting as JPG."
          : "Couldn't read that file \u2014 try a JPG or PNG."
      );
    }
  };

  const hasImage = Boolean(img);

  return (
    <div className="card-border relative rounded-xl2 p-5 bg-gradient-to-b from-sea-mid to-sea-deep border border-sea-line shadow-hard animate-fadeUp [animation-delay:120ms]">
      <ModeToggle mode={mode} onChange={setMode} />

      <Dropzone onFile={handleFile} statusNote={status} />

      {hasImage && (
        <div className="mt-4">
          <CanvasPreview
            canvasRef={canvasRef}
            frameRef={frameRef}
            handlers={handlers}
            size={size}
            zoom={zoom}
            onZoomChange={setZoom}
          />

          {mode === "card" && (
            <IdCardForm
              name={name}
              role={role}
              title={title}
              onNameChange={setName}
              onRoleChange={setRole}
              onReroll={() => setTitle(randomBuilderTitle(title))}
            />
          )}

          <ActionBar canvasRef={canvasRef} mode={mode} disabled={!hasImage} />
        </div>
      )}
    </div>
  );
}
