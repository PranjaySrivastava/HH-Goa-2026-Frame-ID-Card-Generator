export default function HeroCopy() {
  return (
    <div className="animate-fadeUp">
      <span className="font-bold inline-block text-xs text-black tracking-wide px-2.5 py-1.5 rounded-md border border-black/40 bg-gold/80 mb-5 text-black">
        28-31 OCT 2026 --location=goa --year=2026
      </span>
      <h1 className="font-display font-bold text-[34px] sm:text-[46px] lg:text-[60px] leading-[1.03] tracking-tight max-w-[640px] text-black drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)]">
        Pack your bags.
        <br />
        Update your {" "}
        <em className="not-italic text-gold ">
          PFP!
        </em>
      </h1>
      <p className="mt-[18px] text-base leading-relaxed text-black/95 max-w-[480px] font-semibold">
        One photo in, a Goa-ready frame or Builder ID out - cropped properly, branded properly, done in seconds.
      </p>
      <div className="mt-6 inline-flex gap-6 flex-wrap border-2 border-black/80 bg-white/30 backdrop-blur-sm rounded-xl px-5 py-3 shadow-sm">
        <Stat value="< 2s" label="upload to export" />
        <Stat value="0" label="accounts required" />
        <Stat value="100%" label="runs in your browser" />
      </div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="text-xs text-black/80">
      <b className="block font-display text-[16px] text-black font-bold">{value}</b>
      {label}
    </div>
  );
}
