import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-text-primary">Research Portal</p>
            <p className="text-[10px] text-text-secondary">Academic Excellence</p>
          </div>
        </Link>

        {/* Nav links (desktop) */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#featured" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            Research
          </Link>
          <Link href="#methodology" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            Methodology
          </Link>
          <Link href="#stats" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            About
          </Link>
        </nav>

        {/* Auth */}
        <Link href="/login">
          <Button variant="primary" size="sm" aria-label="Sign in to your account">
            Sign in
          </Button>
        </Link>
      </div>
    </header>
  );
}
