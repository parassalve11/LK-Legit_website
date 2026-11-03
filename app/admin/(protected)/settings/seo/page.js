import { prisma } from "@/lib/db";
import { SEO } from "@/lib/defaults";
import DbNotice from "@/components/admin/DbNotice";
import SeoForm from "./SeoForm";

export default async function SeoPage() {
  let seo = null;
  let error = null;
  try {
    seo = (await prisma.seoMeta.findUnique({ where: { pageKey: "home" } })) || SEO;
  } catch (e) {
    error = e?.message;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-[#f2f0eb]">Search &amp; Sharing</h1>
      <p className="mt-1 text-sm text-[#a19c8f]">
        How your website appears in Google results and when someone shares the link.
      </p>

      <div className="mt-6">
        <DbNotice error={error} />
      </div>

      {seo ? <SeoForm seo={seo} /> : null}
    </div>
  );
}
