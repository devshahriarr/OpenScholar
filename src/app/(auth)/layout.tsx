import * as React from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white" />
          <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full bg-white" />
        </div>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 relative z-10">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-white">OpenScholar</span>
        </Link>

        {/* Center content */}
        <div className="relative z-10 space-y-6">
          <blockquote className="space-y-3">
            <p className="text-2xl font-semibold leading-snug text-white">
              &ldquo;Advancing knowledge through open access to research.&rdquo;
            </p>
            <p className="text-sm text-white/70">
              Join thousands of researchers, students, and academics sharing and discovering breakthrough research.
            </p>
          </blockquote>

          <div className="flex gap-6">
            <div className="space-y-1">
              <p className="text-2xl font-semibold text-white">50K+</p>
              <p className="text-xs text-white/70">Research Papers</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-semibold text-white">12K+</p>
              <p className="text-xs text-white/70">Active Researchers</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-semibold text-white">98%</p>
              <p className="text-xs text-white/70">Open Access</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-white/50 relative z-10">
          © {new Date().getFullYear()} OpenScholar. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-6 sm:p-10">
        {/* Mobile logo */}
        <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-text-primary">OpenScholar</span>
        </Link>

        <div className="w-full max-w-[420px]">{children}</div>
      </div>
    </div>
  );
}
