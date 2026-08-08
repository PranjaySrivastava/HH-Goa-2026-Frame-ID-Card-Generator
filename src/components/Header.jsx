export default function Header() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-5 py-4 bg-hh-green/80 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center gap-2.5">
        <div className="w-[34px] h-[34px] rounded-[9px] bg-hh-pink flex items-center justify-center font-display font-bold text-white text-[15px] shadow-[0_6px_16px_-4px_rgba(255,46,166,0.5)]">
          HH
        </div>
        <div className="font-display font-bold text-[15px] tracking-tight text-white">
          GOA<span className="text-gold">&apos;26</span> · BUILDER SHORTLIST
        </div>
      </div>
      <a
        href="#app"
        className="text-[11px] tracking-wide px-3 py-1.5 rounded-full border border-gold/30 text-gold hover:text-white hover:border-white transition-colors"
      >
        Make yours ↓
      </a>
    </header>
  );
}
