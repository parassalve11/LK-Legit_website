import Link from "next/link";
import { getCurrentUser } from "@/lib/dal";
import { logout } from "@/app/admin/login/actions";
import Sidebar from "@/components/admin/Sidebar";

export const metadata = {
  title: "Admin — Trade with LK",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  // verifySession() inside getCurrentUser redirects to /admin/login when there
  // is no valid session. proxy.js already bounced obvious cases; this is the
  // check that actually matters.
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen bg-[#080704]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[rgba(212,175,55,0.18)] bg-[#0a0805] px-6 py-4">
          <Link
            href="/"
            target="_blank"
            className="text-xs font-semibold uppercase tracking-widest text-[#f5c451] hover:underline"
          >
            View website ↗
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#c9c4b8]">{user?.name || user?.email}</span>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-full border border-[rgba(212,175,55,0.35)] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#c9c4b8] transition hover:text-[#f5c451]"
              >
                Sign out
              </button>
            </form>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
