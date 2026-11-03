import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, EmptyState } from "@/components/admin/ui";
import DbNotice from "@/components/admin/DbNotice";

async function loadStats() {
  try {
    const [leads, newLeads, videos, testimonials, sections, recent] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.video.count({ where: { visible: true } }),
      prisma.testimonial.count({ where: { visible: true } }),
      prisma.section.count({ where: { visible: true } }),
      prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);
    return { ok: true, leads, newLeads, videos, testimonials, sections, recent };
  } catch (error) {
    return { ok: false, error: error?.message };
  }
}

function Tile({ label, value, accent }) {
  return (
    <div className="rounded-2xl border border-[rgba(212,175,55,0.18)] bg-[#0f0d09] px-5 py-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a19c8f]">
        {label}
      </div>
      <div
        className={
          accent
            ? "mt-2 font-display text-3xl font-bold text-gold-gradient"
            : "mt-2 font-display text-3xl font-bold text-[#f2f0eb]"
        }
      >
        {value}
      </div>
    </div>
  );
}

export default async function AdminDashboard() {
  const s = await loadStats();

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl font-bold text-[#f2f0eb]">Dashboard</h1>
      <p className="mt-1 text-sm text-[#a19c8f]">
        A quick look at your website and the people getting in touch.
      </p>

      <div className="mt-6">
        <DbNotice error={s.ok ? null : s.error} />
      </div>

      {s.ok ? (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Tile label="New enquiries" value={s.newLeads} accent />
            <Tile label="Total enquiries" value={s.leads} />
            <Tile label="Videos live" value={s.videos} />
            <Tile label="Testimonials live" value={s.testimonials} />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Card title="Recent enquiries" description="The latest messages from your website.">
              {s.recent.length ? (
                <ul className="divide-y divide-[rgba(212,175,55,0.12)]">
                  {s.recent.map((l) => (
                    <li key={l.id} className="flex items-center justify-between gap-4 py-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-[#f2f0eb]">
                          {l.name}
                        </div>
                        <div className="truncate text-xs text-[#a19c8f]">{l.email}</div>
                      </div>
                      <div className="shrink-0 text-xs text-[#a19c8f]">
                        {new Date(l.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  title="No enquiries yet"
                  description="Messages sent through your contact form will appear here."
                />
              )}
              <div className="mt-4">
                <Link
                  href="/admin/leads"
                  className="text-xs font-semibold uppercase tracking-widest text-[#f5c451] hover:underline"
                >
                  View all enquiries →
                </Link>
              </div>
            </Card>

            <Card title="Quick actions">
              <div className="flex flex-col gap-2">
                {[
                  { href: "/admin/sections", label: "Edit page sections" },
                  { href: "/admin/content/videos", label: "Add a video" },
                  { href: "/admin/content/testimonials", label: "Add a testimonial" },
                  { href: "/admin/settings", label: "Website settings" },
                ].map((a) => (
                  <Link
                    key={a.href}
                    href={a.href}
                    className="rounded-lg border border-[rgba(212,175,55,0.2)] px-4 py-3 text-sm text-[#e6e2d6] transition hover:border-[#f5c451] hover:text-[#f5c451]"
                  >
                    {a.label}
                  </Link>
                ))}
              </div>
              <p className="mt-4 text-xs text-[#a19c8f]">
                {s.sections} sections are currently visible on your home page.
              </p>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
