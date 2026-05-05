import Link from "next/link";
import { BookOpen, Bell } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DashboardNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/search" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-text-primary">ThesisLib</span>
        </Link>

        {/* Center links (desktop) */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/search" className="text-sm font-medium text-primary hover:text-primary-hover transition-colors">
            Home
          </Link>
          <Link href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            Following
          </Link>
          <Link href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            My Uploads
          </Link>
          <Link href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            Saved
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <button aria-label="Notifications" className="text-text-secondary hover:text-text-primary transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-semibold">
              J
            </div>
            <span className="text-sm font-medium text-text-primary hidden sm:block">John Doe</span>
          </div>
        </div>
      </div>
    </header>
  );
}
