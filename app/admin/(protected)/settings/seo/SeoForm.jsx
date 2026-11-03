"use client";

import { useActionState, useState } from "react";
import { saveSeo } from "@/app/admin/actions";
import {
  Card,
  Field,
  Input,
  Textarea,
  Toggle,
  SubmitButton,
  Status,
} from "@/components/admin/ui";

export default function SeoForm({ seo }) {
  const [state, formAction] = useActionState(saveSeo, { ok: false });
  const [title, setTitle] = useState(seo.title);
  const [description, setDescription] = useState(seo.description);
  const errors = state?.errors || {};

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="pageKey" value="home" />

      <Card title="Home page">
        <div className="space-y-4">
          <Field
            label="Page Title"
            hint={`${title.length} characters — around 60 works best in Google.`}
            error={errors.title}
          >
            <Input
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Field>
          <Field
            label="Page Description"
            hint={`${description.length} characters — around 155 works best.`}
            error={errors.description}
          >
            <Textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </Field>
        </div>
      </Card>

      {/* A plain-language preview beats explaining meta tags. */}
      <Card title="How this looks in Google">
        <div className="rounded-lg border border-[rgba(212,175,55,0.18)] bg-[#0a0805] p-4">
          <div className="truncate text-base text-[#8ab4f8]">{title || "Your page title"}</div>
          <div className="mt-0.5 text-xs text-[#3ddc84]">https://tradewithlk55.com</div>
          <p className="mt-1 line-clamp-2 text-sm text-[#c9c4b8]">
            {description || "Your page description will appear here."}
          </p>
        </div>
      </Card>

      <Card
        title="Search visibility"
        description="Leave this off unless you deliberately want to hide the site from Google."
      >
        <Toggle
          name="noIndex"
          defaultChecked={seo.noIndex}
          label="Hide this website from search engines"
        />
      </Card>

      <SubmitButton />
      <Status state={state} />
    </form>
  );
}
