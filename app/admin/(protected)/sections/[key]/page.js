import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import DbNotice from "@/components/admin/DbNotice";
import SectionForm from "./SectionForm";

export default async function EditSectionPage({ params }) {
  // Next 16: params is a promise.
  const { key } = await params;

  let section = null;
  let error = null;
  try {
    section = await prisma.section.findUnique({
      where: { key },
      include: { fields: { orderBy: { order: "asc" } } },
    });
  } catch (e) {
    error = e?.message;
  }

  if (!error && !section) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-[#f2f0eb]">
        {section?.name || "Section"}
      </h1>
      <p className="mt-1 text-sm text-[#a19c8f]">
        Changes appear on your website as soon as you save.
      </p>

      <div className="mt-6">
        <DbNotice error={error} />
      </div>

      {section ? <SectionForm section={section} /> : null}
    </div>
  );
}
