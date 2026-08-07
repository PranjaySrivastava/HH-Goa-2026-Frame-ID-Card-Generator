export default function HeroCopy() {
  return (
    <div className="animate-fadeUp">
      <span className="font-mono inline-block text-xs text-foam tracking-wide px-2.5 py-1.5 rounded-md border border-foam/35 bg-foam/[0.06] mb-5">
        28-31 OCT 2026 --location=goa --year=2026
      </span>
      <h1 className="font-display font-bold text-[34px] sm:text-[46px] lg:text-[60px] leading-[1.03] tracking-tight max-w-[640px]">
        Pack your bags.
        <br />
        Update your{" "}
        <em className="not-italic text-gold [background:linear-gradient(180deg,transparent_62%,rgba(255,200,87,0.28)_62%)]">
          PFP.
        </em>
      </h1>
      <p className="mt-[18px] text-base leading-relaxed text-sand-dim max-w-[480px]">
        One photo in, a Goa-ready frame or Builder ID out - cropped properly, branded properly, done in seconds.
      </p>
      <div className="mt-6 flex gap-6 flex-wrap">
        <Stat value="< 2s" label="upload to export" />
        <Stat value="0" label="accounts required" />
        <Stat value="100%" label="runs in your browser" />
      </div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="text-xs text-sand-dim">
      <b className="block font-display text-[15px] text-sand font-semibold">{value}</b>
      {label}
    </div>
  );
}
