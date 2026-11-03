import { prisma } from "@/lib/db";
import { Card, EmptyState, ConfirmSubmit } from "@/components/admin/ui";
import DbNotice from "@/components/admin/DbNotice";
import { moveNavItem, deleteNavItem } from "@/app/admin/actions";
import NavItemForm from "./NavItemForm";

export default async function NavigationPage() {
  let items = [];
  let error = null;
  try {
    items = await prisma.navItem.findMany({ orderBy: { order: "asc" } });
  } catch (e) {
    error = e?.message;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-[#f2f0eb]">Menu</h1>
      <p className="mt-1 text-sm text-[#a19c8f]">
        The links across the top of your website. Each one jumps to a section of the home page.
      </p>

      <div className="mt-6">
        <DbNotice error={error} />
      </div>

      {!error ? (
        <div className="space-y-6">
          {items.length ? (
            <Card title="Menu links">
              <ul className="divide-y divide-[rgba(212,175,55,0.12)]">
                {items.map((n, i) => (
                  <li key={n.id} className="flex items-center gap-4 py-3">
                    <div className="flex gap-1">
                      <form action={moveNavItem}>
                        <input type="hidden" name="id" value={n.id} />
                        <input type="hidden" name="direction" value="up" />
                        <button
                          disabled={i === 0}
                          aria-label="Move up"
                          className="rounded border border-[rgba(212,175,55,0.25)] px-2 text-xs text-[#f5c451] disabled:opacity-25"
                        >
                          ↑
                        </button>
                      </form>
                      <form action={moveNavItem}>
                        <input type="hidden" name="id" value={n.id} />
                        <input type="hidden" name="direction" value="down" />
                        <button
                          disabled={i === items.length - 1}
                          aria-label="Move down"
                          className="rounded border border-[rgba(212,175,55,0.25)] px-2 text-xs text-[#f5c451] disabled:opacity-25"
                        >
                          ↓
                        </button>
                      </form>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-[#f2f0eb]">{n.label}</div>
                      <div className="text-xs text-[#a19c8f]">
                        Jumps to {n.anchor} {n.visible ? "" : "· Hidden"}
                      </div>
                    </div>
                    <form action={deleteNavItem}>
                      <input type="hidden" name="id" value={n.id} />
                      <ConfirmSubmit message={`Remove "${n.label}" from the menu?`} children="Remove" />
                    </form>
                  </li>
                ))}
              </ul>
            </Card>
          ) : (
            <EmptyState title="No menu links yet" description="Add your first menu link below." />
          )}

          <Card title="Add a menu link">
            <NavItemForm />
          </Card>
        </div>
      ) : null}
    </div>
  );
}
