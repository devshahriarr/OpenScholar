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
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/search" className="text-sm font-medium text-primary hover:text-primary-hover transition-colors">
            Home
          </Link>
          <Link href="/following" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
            Following
          </Link>
          <Link href="/my-uploads" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
            My Uploads
          </Link>
          <Link href="/saved" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
            Saved
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <button aria-label="Notifications" className="p-2 text-text-secondary hover:bg-primary-light hover:text-primary rounded-full transition-all relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
          </button>
          
          <Link href="/profile" className="flex items-center gap-2 pl-2 border-l border-border hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-semibold shadow-sm">
              J
            </div>
            <span className="text-sm font-semibold text-text-primary hidden sm:block">John Doe</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
