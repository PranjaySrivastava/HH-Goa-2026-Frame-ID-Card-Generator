export default function Header() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-5 py-4 bg-sea-deep/72 backdrop-blur-md border-b border-sand/10">
      <div className="flex items-center gap-2.5">
        <div className="w-[34px] h-[34px] rounded-[9px] bg-gradient-to-br from-coral to-gold flex items-center justify-center font-display font-bold text-ink text-[15px] shadow-[0_6px_16px_-4px_rgba(255,107,74,0.5)]">
          HH
        </div>
        <div className="font-display font-bold text-[15px] tracking-tight">
          GOA<span className="text-gold">&apos;26</span> · BUILDER SHORTLIST
        </div>
      </div>
      <a
        href="#app"
        className="text-[11px] tracking-wide px-3 py-1.5 rounded-full border border-sand/20 text-sand-dim hover:text-sand hover:border-sand/40 transition-colors"
      >
        Make yours ↓
      </a>
    </header>
  );
}
