import { prisma } from "@/lib/db";
import { SITE_SETTINGS } from "@/lib/defaults";
import DbNotice from "@/components/admin/DbNotice";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  let settings = null;
  let error = null;
  try {
    settings = (await prisma.siteSettings.findUnique({ where: { id: 1 } })) || SITE_SETTINGS;
  } catch (e) {
    error = e?.message;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-[#f2f0eb]">Website Settings</h1>
      <p className="mt-1 text-sm text-[#a19c8f]">
        Your website name, contact details and footer text.
      </p>

      <div className="mt-6">
        <DbNotice error={error} />
      </div>

      {settings ? <SettingsForm settings={settings} /> : null}
    </div>
  );
}
