const STEPS = [
  {
    cmd: "$ upload",
    title: "Drop any photo",
    body: "JPG, PNG or HEIC straight off an iPhone. Landscape, portrait, off-center selfie — it's auto-fit to the frame, no crop tool required."
  },
  {
    cmd: "$ customize",
    title: "Frame it your way",
    body: "Switch between a PFP frame or a Builder ID card, drag to reposition your face, and roll a builder title until one sticks."
  },
  {
    cmd: "$ ship",
    title: "Post it",
    body: "Download a full-resolution PNG, or hit Share to open X with your caption and #FrameInGoa ready — just attach the image and post."
  }
];

export default function HowItWorks() {
  return (
    <>
      <svg className="w-full h-[70px] block" viewBox="0 0 1440 70" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0,40 C240,90 480,0 720,30 C960,60 1200,10 1440,40 L1440,70 L0,70 Z"
          fill="#F5F1E6"
        />
      </svg>
      <div className="bg-sand pb-16">
        <div className="max-w-[1180px] mx-auto px-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {STEPS.map((s) => (
            <div key={s.cmd} className="bg-white border border-sand-dim/40 rounded-2xl p-[22px] shadow-sm">
              <div className="font-mono text-[12.5px] text-hh-pink font-bold mb-2.5">{s.cmd}</div>
              <h3 className="font-display text-lg mb-2 text-hh-green font-bold">{s.title}</h3>
              <p className="text-[13.5px] text-hh-green/85 leading-relaxed m-0">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
