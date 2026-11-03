"use client";

import { useActionState } from "react";
import { saveSocialLink } from "@/app/admin/actions";
import { Card, Field, Input, Toggle, SubmitButton, Status } from "@/components/admin/ui";

function Row({ platform, label, link }) {
  const [state, formAction] = useActionState(saveSocialLink, { ok: false });
  const errors = state?.errors || {};

  return (
    <form action={formAction} className="border-t border-[rgba(212,175,55,0.12)] py-5 first:border-0">
      <input type="hidden" name="platform" value={platform} />
      <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_auto]">
        <Field label={label} error={errors.url}>
          <Input
            name="url"
            type="url"
            placeholder={`https://…`}
            defaultValue={link?.url || ""}
          />
        </Field>
        <Toggle name="enabled" defaultChecked={link?.enabled ?? true} label="Show icon" />
        <SubmitButton>Save</SubmitButton>
      </div>
      <Status state={state} />
    </form>
  );
}

const PLATFORMS = [
  { platform: "youtube", label: "YouTube Channel Link" },
  { platform: "instagram", label: "Instagram Profile Link" },
  { platform: "telegram", label: "Telegram Link" },
  { platform: "whatsapp", label: "WhatsApp Link" },
  { platform: "twitter", label: "X / Twitter Link" },
];

export default function SocialForm({ links }) {
  const byPlatform = Object.fromEntries(links.map((l) => [l.platform, l]));
  return (
    <Card
      title="Social media"
      description="Icons only appear on your website when a link is filled in and switched on."
    >
      {PLATFORMS.map((p) => (
        <Row key={p.platform} {...p} link={byPlatform[p.platform]} />
      ))}
    </Card>
  );
}
