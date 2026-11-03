"use client";

import { useActionState } from "react";
import { saveSettings } from "@/app/admin/actions";
import {
  Card,
  Field,
  Input,
  Textarea,
  Toggle,
  SubmitButton,
  Status,
} from "@/components/admin/ui";

export default function SettingsForm({ settings }) {
  const [state, formAction] = useActionState(saveSettings, { ok: false });
  const errors = state?.errors || {};

  return (
    <form action={formAction} className="space-y-6">
      <Card title="Your website" description="Shown in the header, footer and browser tab.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Website Name" error={errors.siteName}>
            <Input name="siteName" defaultValue={settings.siteName} required />
          </Field>
          <Field label="Tagline" hint="The small line under your logo" error={errors.tagline}>
            <Input name="tagline" defaultValue={settings.tagline} />
          </Field>
        </div>
      </Card>

      <Card title="Contact details" description="Shown in the contact section and footer.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email Address" error={errors.email}>
            <Input name="email" type="email" defaultValue={settings.email} required />
          </Field>
          <Field label="Phone Number" error={errors.phone}>
            <Input name="phone" defaultValue={settings.phone} />
          </Field>
          <Field label="WhatsApp Number" error={errors.whatsapp}>
            <Input name="whatsapp" defaultValue={settings.whatsapp} />
          </Field>
          <Field label="Location" error={errors.address}>
            <Input name="address" defaultValue={settings.address} />
          </Field>
        </div>
      </Card>

      <Card title="Footer">
        <div className="space-y-4">
          <Field label="Footer Description" error={errors.footerText}>
            <Textarea name="footerText" defaultValue={settings.footerText} rows={3} />
          </Field>
          <Field label="Disclaimer" error={errors.disclaimer}>
            <Textarea name="disclaimer" defaultValue={settings.disclaimer} rows={3} />
          </Field>
          <Field label="Copyright Line" error={errors.copyright}>
            <Input name="copyright" defaultValue={settings.copyright} />
          </Field>
        </div>
      </Card>

      <Card
        title="Maintenance mode"
        description="Turn this on only if you need to take the website offline temporarily."
      >
        <Toggle
          name="maintenanceMode"
          defaultChecked={settings.maintenanceMode}
          label="Take the website offline for visitors"
        />
      </Card>

      <SubmitButton />
      <Status state={state} />
    </form>
  );
}
