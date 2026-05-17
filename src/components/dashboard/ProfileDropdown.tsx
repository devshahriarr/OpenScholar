"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Settings, User } from "lucide-react";

interface ProfileDropdownProps {
  user: {
    id: string;
    name: string;
    initials: string;
  } | null;
}

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (!user) {
    return (
      <Link href="/login" className="text-sm font-medium text-primary hover:underline">
        Sign in
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pl-2 border-l border-border hover:opacity-80 transition-opacity focus:outline-none"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-semibold shadow-sm uppercase">
          {user.initials}
        </div>
        <span className="text-sm font-semibold text-text-primary hidden sm:block">
          {user.name}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-surface rounded-md shadow-modal border border-border py-1 z-50 animate-in fade-in slide-in-from-top-2">
          <Link 
            href={`/users/${user.id}`}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-background hover:text-text-primary transition-colors"
          >
            <User size={16} />
            Public Profile
          </Link>
          <Link 
            href="/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-background hover:text-text-primary transition-colors"
          >
            <Settings size={16} />
            Settings
          </Link>
          <div className="h-px bg-border my-1" />
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-error/5 transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
