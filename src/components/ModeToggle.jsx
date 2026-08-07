import { CircleUserRound, CreditCard } from "lucide-react";

export default function ModeToggle({ mode, onChange }) {
  return (
    <div role="tablist" aria-label="Output format" className="grid grid-cols-2 gap-1.5 bg-ink/60 rounded-xl p-[5px] mb-4">
      <TabButton
        active={mode === "pfp"}
        onClick={() => onChange("pfp")}
        icon={<CircleUserRound size={16} />}
        label="PFP Frame"
      />
      <TabButton
        active={mode === "card"}
        onClick={() => onChange("card")}
        icon={<CreditCard size={16} />}
        label="Builder ID"
      />
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={
        "flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-[9px] font-display font-semibold text-[13px] transition-all " +
        (active
          ? "bg-gradient-to-br from-coral to-[#ff8a63] text-ink shadow-[0_6px_14px_-4px_rgba(255,107,74,0.55)]"
          : "text-sand-dim hover:text-sand bg-transparent")
      }
    >
      {icon}
      {label}
    </button>
  );
}
