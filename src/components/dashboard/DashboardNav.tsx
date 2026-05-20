import Link from "next/link";
import { BookOpen } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import NotificationBell from "./NotificationBell";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function DashboardNav() {
  const session = await getSessionUser();
  let userProps = null;

  if (session) {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.sub },
      select: { name: true }
    });
    
    if (dbUser) {
      userProps = {
        id: session.sub,
        name: dbUser.name,
        initials: dbUser.name.charAt(0).toUpperCase()
      };
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/search" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-text-primary">OpenScholar</span>
        </Link>

        {/* Center links (desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/search" className="text-sm font-medium text-primary hover:text-primary-hover transition-colors">
            Discovery
          </Link>
          {session && (
            <>
              <Link href="/following" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                Following
              </Link>
              <Link href="/my-uploads" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                My Uploads
              </Link>
              <Link href="/saved" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                Saved
              </Link>
            </>
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          {session && <NotificationBell />}
          
          <ProfileDropdown user={userProps} />
        </div>
      </div>
    </header>
  );
}

