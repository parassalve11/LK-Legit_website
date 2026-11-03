import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, EmptyState } from "@/components/admin/ui";
import DbNotice from "@/components/admin/DbNotice";
import { setSectionVisibility, moveSection } from "@/app/admin/actions";

async function loadSections() {
  try {
    return { ok: true, rows: await prisma.section.findMany({ orderBy: { order: "asc" } }) };
  } catch (error) {
    return { ok: false, error: error?.message, rows: [] };
  }
}

export default async function SectionsPage() {
  const { ok, error, rows } = await loadSections();

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-2xl font-bold text-[#f2f0eb]">Page Sections</h1>
      <p className="mt-1 text-sm text-[#a19c8f]">
        These are the blocks that make up your home page, in the order visitors see them.
        Hide a section to remove it from the website without deleting anything.
      </p>

      <div className="mt-6">
        <DbNotice error={ok ? null : error} />
      </div>

      {ok ? (
        rows.length ? (
          <Card>
            <ul className="divide-y divide-[rgba(212,175,55,0.12)]">
              {rows.map((s, i) => (
                <li key={s.key} className="flex items-center gap-4 py-4">
                  <div className="flex flex-col gap-1">
                    <form action={moveSection}>
                      <input type="hidden" name="key" value={s.key} />
                      <input type="hidden" name="direction" value="up" />
                      <button
                        type="submit"
                        disabled={i === 0}
                        aria-label={`Move ${s.name} up`}
                        className="rounded border border-[rgba(212,175,55,0.25)] px-2 text-xs text-[#f5c451] disabled:opacity-25"
                      >
                        ↑
                      </button>
                    </form>
                    <form action={moveSection}>
                      <input type="hidden" name="key" value={s.key} />
                      <input type="hidden" name="direction" value="down" />
                      <button
                        type="submit"
                        disabled={i === rows.length - 1}
                        aria-label={`Move ${s.name} down`}
                        className="rounded border border-[rgba(212,175,55,0.25)] px-2 text-xs text-[#f5c451] disabled:opacity-25"
                      >
                        ↓
                      </button>
                    </form>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-[#f2f0eb]">{s.name}</div>
                    <div className="truncate text-xs text-[#a19c8f]">
                      {s.title || "—"} {s.subtitle ? `· ${s.subtitle}` : ""}
                    </div>
                  </div>

                  <span
                    className={
                      s.visible
                        ? "rounded-full bg-[#3ddc84]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#3ddc84]"
                        : "rounded-full bg-[#6f6a5e]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#a19c8f]"
                    }
                  >
                    {s.visible ? "Visible" : "Hidden"}
                  </span>

                  <form action={setSectionVisibility}>
                    <input type="hidden" name="key" value={s.key} />
                    <input type="hidden" name="visible" value={s.visible ? "false" : "true"} />
                    <button
                      type="submit"
                      className="rounded-full border border-[rgba(212,175,55,0.35)] px-3 py-1.5 text-xs font-semibold text-[#c9c4b8] transition hover:text-[#f5c451]"
                    >
                      {s.visible ? "Hide" : "Show"}
                    </button>
                  </form>

                  <Link
                    href={`/admin/sections/${s.key}`}
                    className="rounded-full bg-gold-gradient px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#0a0805]"
                  >
                    Edit
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        ) : (
          <EmptyState
            title="No sections yet"
            description="Run the setup command to load your website's current content into the database."
          />
        )
      ) : null}
    </div>
  );
}
