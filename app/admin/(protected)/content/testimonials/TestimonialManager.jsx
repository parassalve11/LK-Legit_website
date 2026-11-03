"use client";

import { useActionState, useState } from "react";
import {
  saveTestimonial,
  deleteTestimonial,
  moveTestimonial,
} from "@/app/admin/actions";
import {
  Card,
  Field,
  Input,
  Textarea,
  Select,
  Toggle,
  SubmitButton,
  ConfirmSubmit,
  Status,
  GhostButton,
  EmptyState,
} from "@/components/admin/ui";

function TestimonialForm({ item, onDone }) {
  const [state, formAction] = useActionState(saveTestimonial, { ok: false });
  const errors = state?.errors || {};

  return (
    <form action={formAction} className="space-y-4">
      {item?.id ? <input type="hidden" name="id" value={item.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Person's Name" error={errors.name}>
          <Input name="name" defaultValue={item?.name || ""} required />
        </Field>
        <Field label="Their Title" hint="e.g. Options Trader" error={errors.role}>
          <Input name="role" defaultValue={item?.role || ""} />
        </Field>
      </div>

      <Field label="What They Said" error={errors.quote}>
        <Textarea name="quote" defaultValue={item?.quote || ""} rows={4} required />
      </Field>

      <Field label="Star Rating" error={errors.rating}>
        <Select name="rating" defaultValue={String(item?.rating ?? 5)}>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} star{n > 1 ? "s" : ""}
            </option>
          ))}
        </Select>
      </Field>

      <Toggle name="visible" defaultChecked={item?.visible ?? true} label="Show on website" />

      <div className="flex items-center gap-3">
        <SubmitButton>{item?.id ? "Save Testimonial" : "Add Testimonial"}</SubmitButton>
        {onDone ? (
          <GhostButton type="button" onClick={onDone}>
            Cancel
          </GhostButton>
        ) : null}
      </div>

      <Status state={state} />
    </form>
  );
}

export default function TestimonialManager({ items }) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);

  return (
    <div className="space-y-6">
      {items.length ? (
        <Card title="Your testimonials">
          <ul className="divide-y divide-[rgba(212,175,55,0.12)]">
            {items.map((t, i) => (
              <li key={t.id} className="py-4">
                {editing === t.id ? (
                  <TestimonialForm item={t} onDone={() => setEditing(null)} />
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-gradient font-display font-bold text-[#0a0805]">
                      {t.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-[#f2f0eb]">
                        {t.name}{" "}
                        <span className="font-normal text-[#a19c8f]">· {t.role}</span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-[#c9c4b8]">{t.quote}</p>
                      {!t.visible ? (
                        <span className="mt-1 inline-block text-[10px] uppercase tracking-widest text-[#a19c8f]">
                          Hidden
                        </span>
                      ) : null}
                    </div>

                    <div className="flex gap-1">
                      <form action={moveTestimonial}>
                        <input type="hidden" name="id" value={t.id} />
                        <input type="hidden" name="direction" value="up" />
                        <button
                          disabled={i === 0}
                          aria-label="Move up"
                          className="rounded border border-[rgba(212,175,55,0.25)] px-2 text-xs text-[#f5c451] disabled:opacity-25"
                        >
                          ↑
                        </button>
                      </form>
                      <form action={moveTestimonial}>
                        <input type="hidden" name="id" value={t.id} />
                        <input type="hidden" name="direction" value="down" />
                        <button
                          disabled={i === items.length - 1}
                          aria-label="Move down"
                          className="rounded border border-[rgba(212,175,55,0.25)] px-2 text-xs text-[#f5c451] disabled:opacity-25"
                        >
                          ↓
                        </button>
                      </form>
                    </div>

                    <GhostButton type="button" onClick={() => setEditing(t.id)}>
                      Edit
                    </GhostButton>

                    <form action={deleteTestimonial}>
                      <input type="hidden" name="id" value={t.id} />
                      <ConfirmSubmit
                        message={`Delete the testimonial from ${t.name}? This cannot be undone.`}
                      />
                    </form>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <EmptyState
          title="No testimonials yet"
          description="Add feedback from your traders to build trust on the home page."
        />
      )}

      {adding ? (
        <Card title="Add a testimonial">
          <TestimonialForm onDone={() => setAdding(false)} />
        </Card>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="btn-gold rounded-full px-6 py-2.5 text-sm"
        >
          + Add Testimonial
        </button>
      )}
    </div>
  );
}
