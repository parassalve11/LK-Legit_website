import { prisma } from "@/lib/db";
import { Card, EmptyState, ConfirmSubmit } from "@/components/admin/ui";
import DbNotice from "@/components/admin/DbNotice";
import { updateLeadStatus, deleteLead } from "@/app/admin/actions";

const STATUS_STYLES = {
  NEW: "bg-[#3ddc84]/10 text-[#3ddc84]",
  CONTACTED: "bg-[#f5c451]/10 text-[#f5c451]",
  CLOSED: "bg-[#6f6a5e]/15 text-[#a19c8f]",
};

const NEXT_LABEL = { NEW: "Mark Contacted", CONTACTED: "Mark Closed", CLOSED: "Reopen" };
const NEXT_STATUS = { NEW: "CONTACTED", CONTACTED: "CLOSED", CLOSED: "NEW" };

export default async function LeadsPage() {
  let leads = [];
  let error = null;
  try {
    leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  } catch (e) {
    error = e?.message;
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-2xl font-bold text-[#f2f0eb]">Contact Enquiries</h1>
      <p className="mt-1 text-sm text-[#a19c8f]">
        Everyone who has sent a message through your website&apos;s contact form.
      </p>

      <div className="mt-6">
        <DbNotice error={error} />
      </div>

      {!error ? (
        leads.length ? (
          <Card>
            <ul className="divide-y divide-[rgba(212,175,55,0.12)]">
              {leads.map((l) => (
                <li key={l.id} className="py-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-semibold text-[#f2f0eb]">{l.name}</span>
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                            STATUS_STYLES[l.status] || STATUS_STYLES.CLOSED
                          }`}
                        >
                          {l.status}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-[#a19c8f]">
                        <a href={`mailto:${l.email}`} className="hover:text-[#f5c451]">
                          {l.email}
                        </a>
                        {l.phone ? ` · ${l.phone}` : ""} ·{" "}
                        {new Date(l.createdAt).toLocaleString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      {l.subject ? (
                        <div className="mt-2 text-sm font-medium text-[#e6e2d6]">{l.subject}</div>
                      ) : null}
                      <p className="mt-1 max-w-2xl whitespace-pre-wrap text-sm text-[#c9c4b8]">
                        {l.message}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <form action={updateLeadStatus}>
                        <input type="hidden" name="id" value={l.id} />
                        <input type="hidden" name="status" value={NEXT_STATUS[l.status] || "NEW"} />
                        <button className="rounded-full border border-[rgba(212,175,55,0.35)] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#f5c451] transition hover:bg-[rgba(245,196,81,0.08)]">
                          {NEXT_LABEL[l.status] || "Reopen"}
                        </button>
                      </form>
                      <form action={deleteLead}>
                        <input type="hidden" name="id" value={l.id} />
                        <ConfirmSubmit
                          message={`Delete the enquiry from ${l.name}? This cannot be undone.`}
                        />
                      </form>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        ) : (
          <EmptyState
            title="No enquiries yet"
            description="When someone fills in your contact form, their message will appear here."
          />
        )
      ) : null}
    </div>
  );
}
