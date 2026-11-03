"use client";

import { useActionState } from "react";
import { login } from "./actions";
import { Card, Field, Input, SubmitButton, Status } from "@/components/admin/ui";

export default function LoginForm() {
  const [state, formAction] = useActionState(login, { ok: false });
  const errors = state?.errors || {};

  return (
    <Card>
      <form action={formAction} className="space-y-4">
        <Field label="Email address" error={errors.email}>
          <Input
            name="email"
            type="email"
            autoComplete="username"
            placeholder="you@example.com"
            required
          />
        </Field>
        <Field label="Password" error={errors.password}>
          <Input
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />
        </Field>
        <SubmitButton className="w-full justify-center">Sign In</SubmitButton>
        <Status state={state} />
      </form>
    </Card>
  );
}
