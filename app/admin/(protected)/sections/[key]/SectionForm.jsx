"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveSection } from "@/app/admin/actions";
import {
  Card,
  Field,
  Input,
  Textarea,
  Toggle,
  SubmitButton,
  Status,
} from "@/components/admin/ui";

// Friendly labels so the editor never sees a database column name (§8).
const LABELS = {
  eyebrow: "Small Label Above the Heading",
  title: "Main Heading",
  subtitle: "Highlighted Text / Description",
};

const HINTS = {
  hero: {
    title: "Use | to split the heading across lines, e.g. MASTER|THE MARKETS|WITH LK",
  },
};

export default function SectionForm({ section }) {
  const [state, formAction] = useActionState(saveSection, { ok: false });
  const errors = state?.errors || {};

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="key" value={section.key} />

      <Card title="Section content">
        <div className="space-y-4">
          <Field label={LABELS.eyebrow} error={errors.eyebrow}>
            <Input name="eyebrow" defaultValue={section.eyebrow || ""} />
          </Field>
          <Field
            label={LABELS.title}
            hint={HINTS[section.key]?.title}
            error={errors.title}
          >
            <Input name="title" defaultValue={section.title || ""} />
          </Field>
          <Field label={LABELS.subtitle} error={errors.subtitle}>
            <Textarea name="subtitle" defaultValue={section.subtitle || ""} rows={3} />
          </Field>
        </div>
      </Card>

      {section.fields.length ? (
        <Card
          title="Buttons and extra text"
          description="Everything else this section shows on the website."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {section.fields.map((f) => {
              const isLong = f.value.length > 90;
              return (
                <div key={f.key} className={isLong ? "sm:col-span-2" : ""}>
                  <Field label={f.label}>
                    {isLong ? (
                      <Textarea name={`field_${f.key}`} defaultValue={f.value} rows={4} />
                    ) : (
                      <Input name={`field_${f.key}`} defaultValue={f.value} />
                    )}
                  </Field>
                </div>
              );
            })}
          </div>
        </Card>
      ) : null}

      <Card title="Visibility">
        <Toggle
          name="visible"
          defaultChecked={section.visible}
          label="Show this section on the website"
        />
      </Card>

      <div className="flex items-center gap-4">
        <SubmitButton />
        <Link
          href="/"
          target="_blank"
          className="text-xs font-semibold uppercase tracking-widest text-[#f5c451] hover:underline"
        >
          Preview website ↗
        </Link>
        <Link
          href="/admin/sections"
          className="text-xs font-semibold uppercase tracking-widest text-[#a19c8f] hover:text-[#f5c451]"
        >
          Back
        </Link>
      </div>

      <Status state={state} />
    </form>
  );
}
