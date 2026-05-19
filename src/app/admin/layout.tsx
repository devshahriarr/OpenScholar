import AdminSidebar from "@/components/admin/sidebar";
import NotificationBell from "@/components/dashboard/NotificationBell";
import { Search } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();
  let adminName = "Admin";
  let adminInitial = "A";
  let adminRole = "Admin";

  if (session) {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.sub },
      select: { name: true, role: { select: { name: true } } },
    });
    if (dbUser) {
      adminName = dbUser.name;
      adminInitial = dbUser.name.charAt(0).toUpperCase();
      adminRole = dbUser.role?.name ?? "Admin";
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Admin Topbar */}
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Search menu items..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-6">
            {/* Shared NotificationBell — works identically for all roles */}
            <NotificationBell />

            <div className="flex items-center gap-3 pl-6 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {adminInitial}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-text-primary leading-tight">{adminName}</p>
                <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider">{adminRole}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
