"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Grouped the way the person editing the site thinks about it, not the way
// the database is laid out.
const GROUPS = [
  {
    title: null,
    items: [{ href: "/admin", label: "Dashboard", exact: true }],
  },
  {
    title: "Website",
    items: [
      { href: "/admin/sections", label: "Page Sections" },
      { href: "/admin/navigation", label: "Menu" },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/content/videos", label: "Videos" },
      { href: "/admin/content/testimonials", label: "Testimonials" },
    ],
  },
  {
    title: "Enquiries",
    items: [{ href: "/admin/leads", label: "Contact Enquiries" }],
  },
  {
    title: "Settings",
    items: [
      { href: "/admin/settings", label: "Website Settings" },
      { href: "/admin/settings/social", label: "Social Media" },
      { href: "/admin/settings/seo", label: "Search & Sharing" },
    ],
  },
];

export default function Sidebar({ siteName = "Trade with LK" }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[rgba(212,175,55,0.18)] bg-[#0a0805]">
      <div className="flex items-center gap-3 border-b border-[rgba(212,175,55,0.18)] px-5 py-5">
        <img src="/Logo.png" alt="" className="h-9 w-9 rounded-full ring-1 ring-[rgba(212,175,55,0.4)]" />
        <div className="min-w-0">
          <div className="truncate font-display text-sm font-bold tracking-wide text-[#f2f0eb]">
            {siteName}
          </div>
          <div className="text-[10px] uppercase tracking-[0.24em] text-[#f5c451]">Admin</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {GROUPS.map((group, gi) => (
          <div key={group.title || gi} className={gi > 0 ? "mt-6" : ""}>
            {group.title ? (
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#6f6a5e]">
                {group.title}
              </div>
            ) : null}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "block rounded-lg px-3 py-2 text-sm transition",
                        active
                          ? "bg-[rgba(245,196,81,0.12)] font-semibold text-[#f5c451]"
                          : "text-[#c9c4b8] hover:bg-white/5 hover:text-[#f2f0eb]",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
