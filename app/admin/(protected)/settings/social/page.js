import { prisma } from "@/lib/db";
import DbNotice from "@/components/admin/DbNotice";
import SocialForm from "./SocialForm";

export default async function SocialPage() {
  let links = [];
  let error = null;
  try {
    links = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
  } catch (e) {
    error = e?.message;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-[#f2f0eb]">Social Media</h1>
      <p className="mt-1 text-sm text-[#a19c8f]">
        Where your visitors can follow you. Leave a link empty to hide that icon.
      </p>

      <div className="mt-6">
        <DbNotice error={error} />
      </div>

      {!error ? <SocialForm links={links} /> : null}
    </div>
  );
}
