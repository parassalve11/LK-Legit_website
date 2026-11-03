"use client";

import { useActionState } from "react";
import { saveNavItem } from "@/app/admin/actions";
import { Field, Input, Toggle, SubmitButton, Status } from "@/components/admin/ui";

export default function NavItemForm() {
  const [state, formAction] = useActionState(saveNavItem, { ok: false });
  const errors = state?.errors || {};

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Menu Text" error={errors.label}>
          <Input name="label" placeholder="Contact" required />
        </Field>
        <Field
          label="Jumps To"
          hint="A section on the home page, e.g. #contact"
          error={errors.anchor}
        >
          <Input name="anchor" placeholder="#contact" required />
        </Field>
      </div>
      <Toggle name="visible" defaultChecked label="Show in the menu" />
      <SubmitButton>Add Link</SubmitButton>
      <Status state={state} />
    </form>
  );
}
