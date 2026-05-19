"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, CheckCheck, Loader2, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  referenceId?: string | null;
};

function typeStyles(type: string) {
  switch (type) {
    case "paper_approved":
      return "bg-green-100 text-green-700";
    case "paper_rejected":
      return "bg-red-100 text-red-700";
    case "new_follower":
      return "bg-blue-100 text-blue-700";
    case "comment_reply":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function typeLabel(type: string) {
  switch (type) {
    case "paper_approved": return "Approved";
    case "paper_rejected": return "Rejected";
    case "new_follower":   return "Follower";
    case "comment_reply":  return "Reply";
    default:               return "System";
  }
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Poll unread count every 60s
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch("/api/notifications/count");
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.count ?? 0);
        }
      } catch {}
    };
    fetchCount();
    const interval = setInterval(fetchCount, 60_000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications?limit=15");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.results ?? []);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen((prev) => !prev);
    if (!open) fetchNotifications();
  };

  const handleMarkAllRead = async () => {
    await fetch("/api/notifications/read-all", { method: "POST" });
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleMarkRead = async (id: string) => {
    await fetch("/api/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId: id }),
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        id="notification-bell"
        aria-label="Notifications"
        onClick={handleOpen}
        className="p-2 text-text-secondary hover:bg-primary-light hover:text-primary rounded-full transition-all relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-error text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 border-2 border-surface">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-[360px] bg-surface rounded-xl shadow-modal border border-border z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-text-primary">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold bg-error text-white px-1.5 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                >
                  <CheckCheck size={12} />
                  Mark all read
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-text-muted hover:text-text-primary p-0.5">
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="max-h-[400px] overflow-y-auto divide-y divide-border">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="animate-spin w-5 h-5 text-primary" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="w-8 h-8 text-text-muted mx-auto mb-2 opacity-40" />
                <p className="text-sm text-text-secondary font-medium">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 hover:bg-background transition-colors cursor-pointer",
                    !n.isRead && "bg-primary-light/20"
                  )}
                  onClick={() => !n.isRead && handleMarkRead(n.id)}
                >
                  {/* Type badge */}
                  <span className={cn("text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded mt-0.5 flex-shrink-0", typeStyles(n.type))}>
                    {typeLabel(n.type)}
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-[13px] leading-snug", n.isRead ? "text-text-secondary" : "text-text-primary font-medium")}>
                      {n.message}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[11px] text-text-muted">{timeAgo(n.createdAt)}</span>
                      {n.referenceId && (
                        <Link
                          href={`/papers/${n.referenceId}`}
                          onClick={() => setOpen(false)}
                          className="text-[11px] font-bold text-primary hover:underline"
                        >
                          View paper →
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Unread dot */}
                  {!n.isRead && (
                    <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border px-4 py-2 text-center">
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="text-[12px] font-bold text-primary hover:underline"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
