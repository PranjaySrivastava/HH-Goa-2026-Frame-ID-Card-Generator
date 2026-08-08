import { Dices } from "lucide-react";
import { ROLE_SUGGESTIONS } from "../lib/builderTitles.js";

export default function IdCardForm({ name, role, title, onNameChange, onRoleChange, onReroll }) {
  return (
    <div>
      <Field label="Full name">
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g. Ananya Rao"
            maxLength={26}
            className="w-full px-3 py-2.5 rounded-[9px] border border-white/20 bg-black/20 text-white text-sm placeholder:text-white/40 outline-none focus:border-gold transition-colors"
          />
      </Field>

      <Field label="Tech stack / role">
          <input
            type="text"
            value={role}
            onChange={(e) => onRoleChange(e.target.value)}
            placeholder="e.g. Full-Stack, AI Engineer"
            list="roleOptions"
            maxLength={24}
            className="w-full px-3 py-2.5 rounded-[9px] border border-white/20 bg-black/20 text-white text-sm placeholder:text-white/40 outline-none focus:border-gold transition-colors"
          />
        <datalist id="roleOptions">
          {ROLE_SUGGESTIONS.map((r) => (
            <option key={r} value={r} />
          ))}
        </datalist>
      </Field>

      <Field label="Builder title">
        <div className="flex gap-2 mt-1.5">
          <input
            type="text"
            value={title}
            readOnly
            placeholder="Tap the dice"
            className="flex-1 px-3 py-2.5 rounded-[9px] border border-white/20 bg-black/20 text-white text-sm placeholder:text-white/40 outline-none"
          />
          <button
            type="button"
            onClick={onReroll}
            aria-label="Generate a new builder title"
            className="shrink-0 w-[42px] rounded-[9px] border border-transparent bg-gold text-hh-green font-bold flex items-center justify-center hover:rotate-[50deg] hover:scale-105 active:scale-95 transition-all shadow-[0_4px_12px_rgba(255,200,87,0.3)]"
          >
            <Dices size={17} />
          </button>
        </div>
      </Field>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="mt-3.5">
      <label className="block font-mono text-[11px] tracking-wide text-white/80 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
