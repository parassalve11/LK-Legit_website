"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

export function Card({ title, description, children, className }) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-[rgba(212,175,55,0.18)] bg-[#0f0d09] p-6 shadow-[0_20px_40px_-30px_rgba(0,0,0,0.9)]",
        className,
      )}
    >
      {title ? (
        <header className="mb-5">
          <h2 className="font-display text-lg font-bold text-[#f2f0eb]">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-[#a19c8f]">{description}</p>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}

export function Field({ label, hint, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[#e6e2d6]">{label}</span>
      {children}
      {hint && !error ? <span className="mt-1 block text-xs text-[#a19c8f]">{hint}</span> : null}
      {error ? <span className="mt-1 block text-xs text-[#e6483c]">{error}</span> : null}
    </label>
  );
}

const inputStyles =
  "w-full rounded-lg border border-[rgba(212,175,55,0.25)] bg-[#0a0805] px-3 py-2.5 text-sm text-[#f2f0eb] outline-none transition focus:border-[#f5c451] disabled:opacity-50";

export function Input(props) {
  return <input {...props} className={cn(inputStyles, props.className)} />;
}

export function Textarea(props) {
  return <textarea {...props} className={cn(inputStyles, "min-h-24", props.className)} />;
}

export function Select({ children, ...props }) {
  return (
    <select {...props} className={cn(inputStyles, props.className)}>
      {children}
    </select>
  );
}

export function Toggle({ name, defaultChecked, label }) {
  const [on, setOn] = useState(Boolean(defaultChecked));
  return (
    <label className="flex cursor-pointer items-center gap-3">
      {/* Unchecked checkboxes send nothing, so pair with a hidden "off" value. */}
      <input type="hidden" name={name} value={on ? "true" : "false"} />
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => setOn((v) => !v)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition",
          on ? "bg-gold-gradient" : "bg-[#2a251a]",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-[#0a0805] transition-all",
            on ? "left-[22px]" : "left-0.5",
          )}
        />
      </button>
      <span className="text-sm text-[#e6e2d6]">{label}</span>
    </label>
  );
}

export function SubmitButton({ children = "Save Changes", className }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "btn-gold inline-flex items-center gap-2 rounded-full px-6 py-2.5 disabled:opacity-60",
        className,
      )}
    >
      {pending ? "Saving…" : children}
    </button>
  );
}

export function GhostButton({ children, className, ...props }) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.35)] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#f5c451] transition hover:bg-[rgba(245,196,81,0.08)]",
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Destructive actions always ask first (§28). */
export function ConfirmSubmit({ children = "Delete", message = "Delete this permanently?" }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      className="rounded-full border border-[#e6483c]/40 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#e6483c] transition hover:bg-[#e6483c]/10 disabled:opacity-50"
    >
      {pending ? "Working…" : children}
    </button>
  );
}

export function Status({ state }) {
  if (!state?.message) return null;
  return (
    <p
      role="status"
      className={cn(
        "mt-3 rounded-lg px-3 py-2 text-sm",
        state.ok
          ? "bg-[#3ddc84]/10 text-[#3ddc84]"
          : "bg-[#e6483c]/10 text-[#e6483c]",
      )}
    >
      {state.message}
    </p>
  );
}

export function EmptyState({ title, description, children }) {
  return (
    <div className="rounded-2xl border border-dashed border-[rgba(212,175,55,0.25)] p-10 text-center">
      <h3 className="font-display text-base font-bold text-[#f2f0eb]">{title}</h3>
      {description ? <p className="mt-1 text-sm text-[#a19c8f]">{description}</p> : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
