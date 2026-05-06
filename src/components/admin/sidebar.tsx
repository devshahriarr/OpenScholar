"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileCheck, 
  Users, 
  Settings, 
  LogOut,
  GraduationCap
} from "lucide-react";
import { clsx } from "clsx";

const adminLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Pending Approval", href: "/admin/pending", icon: FileCheck },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen sticky top-0 bg-surface border-r border-border flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg text-white">
            <GraduationCap size={24} />
          </div>
          <span className="text-xl font-bold text-text-primary tracking-tight">ThesisLib</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {adminLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                isActive 
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/20" 
                  : "text-text-secondary hover:bg-background hover:text-text-primary"
              )}
            >
              <Icon size={20} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-text-secondary hover:bg-red-50 hover:text-red-600 transition-all">
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
