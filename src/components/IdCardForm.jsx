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
          className="w-full px-3 py-2.5 rounded-[9px] border border-sand/15 bg-ink/55 text-sand text-sm placeholder:text-sand/30 outline-none focus:border-foam transition-colors"
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
          className="w-full px-3 py-2.5 rounded-[9px] border border-sand/15 bg-ink/55 text-sand text-sm placeholder:text-sand/30 outline-none focus:border-foam transition-colors"
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
            className="flex-1 px-3 py-2.5 rounded-[9px] border border-sand/15 bg-ink/55 text-sand text-sm placeholder:text-sand/30 outline-none"
          />
          <button
            type="button"
            onClick={onReroll}
            aria-label="Generate a new builder title"
            className="shrink-0 w-[42px] rounded-[9px] border border-gold/35 bg-gold/[0.08] text-gold flex items-center justify-center hover:rotate-[50deg] transition-transform"
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
      <label className="block font-mono text-[11px] tracking-wide text-sand-dim mb-1.5">{label}</label>
      {children}
    </div>
  );
}
