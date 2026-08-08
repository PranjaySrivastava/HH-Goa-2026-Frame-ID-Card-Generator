import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

export default function Dropzone({ onFile, statusNote }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const openPicker = () => inputRef.current?.click();

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload a photo"
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPicker();
          }
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        className={
          "border-[1.5px] border-dashed rounded-2xl px-4 py-6 text-center cursor-pointer transition-colors " +
          (isDragging ? "border-hh-pink bg-hh-pink/[0.08]" : "border-white/25 hover:border-gold hover:bg-white/5")
        }
      >
        <UploadCloud className="mx-auto mb-2.5 text-gold" size={26} />
        <p className="text-[13.5px] text-white/80 m-0">
          <strong className="text-white">Drop a photo</strong> or tap to browse
        </p>
        <div className="font-mono text-[11px] mt-1.5 text-white/40">.jpg · .png · .heic — any size, any orientation</div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.heic,.heif,image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
      {statusNote && (
        <div className="font-mono text-xs text-gold/90 text-center mt-3.5" role="status">
          {statusNote}
        </div>
      )}
    </>
  );
}
