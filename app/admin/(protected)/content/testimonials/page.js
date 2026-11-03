import { prisma } from "@/lib/db";
import DbNotice from "@/components/admin/DbNotice";
import TestimonialManager from "./TestimonialManager";

export default async function TestimonialsPage() {
  let items = [];
  let error = null;
  try {
    items = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  } catch (e) {
    error = e?.message;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-2xl font-bold text-[#f2f0eb]">Testimonials</h1>
      <p className="mt-1 text-sm text-[#a19c8f]">
        Feedback from traders, shown in the rotating panel on your home page.
      </p>

      <div className="mt-6">
        <DbNotice error={error} />
      </div>

      {!error ? <TestimonialManager items={items} /> : null}
    </div>
  );
}
