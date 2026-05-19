"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, CheckCheck, Loader2, RefreshCw } from "lucide-react";
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

const TYPE_STYLES: Record<string, string> = {
  paper_approved: "bg-green-100 text-green-700 border-green-200",
  paper_rejected: "bg-red-100 text-red-700 border-red-200",
  new_follower:   "bg-blue-100 text-blue-700 border-blue-200",
  comment_reply:  "bg-purple-100 text-purple-700 border-purple-200",
  system:         "bg-gray-100 text-gray-600 border-gray-200",
};

const TYPE_LABELS: Record<string, string> = {
  paper_approved: "Approved",
  paper_rejected: "Rejected",
  new_follower:   "Follower",
  comment_reply:  "Reply",
  system:         "System",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)   return "Just now";
  if (mins < 60)  return `${mins} minutes ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs} hours ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7)   return `${days} days ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const LIMIT = 20;

  const fetchNotifications = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notifications?page=${p}&limit=${LIMIT}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.results ?? []);
        setTotal(data.total ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(page);
  }, [page, fetchNotifications]);

  const handleMarkRead = async (id: string) => {
    await fetch("/api/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId: id }),
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await fetch("/api/notifications/read-all", { method: "POST" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Notifications</h1>
          <p className="text-text-secondary text-sm mt-1">
            {total} total · {unreadCount} unread
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchNotifications(page)}
            className="p-2 text-text-secondary hover:text-primary hover:bg-primary-light rounded-full transition-all"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markingAll}
              className="flex items-center gap-2 text-sm font-bold text-primary bg-primary-light px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors disabled:opacity-60"
            >
              {markingAll ? <Loader2 size={14} className="animate-spin" /> : <CheckCheck size={14} />}
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Notification list */}
      <div className="rounded-2xl border border-border overflow-hidden bg-surface shadow-premium">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin w-6 h-6 text-primary" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Bell className="w-12 h-12 text-text-muted opacity-30 mb-4" />
            <p className="text-lg font-bold text-text-primary">You're all caught up!</p>
            <p className="text-sm text-text-secondary mt-1">No notifications yet. We'll let you know when something happens.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "flex items-start gap-4 px-6 py-4 hover:bg-background transition-colors",
                  !n.isRead && "bg-primary-light/20"
                )}
              >
                {/* Unread indicator */}
                <div className="flex-shrink-0 pt-1">
                  {!n.isRead ? (
                    <span className="w-2.5 h-2.5 bg-primary rounded-full block" />
                  ) : (
                    <span className="w-2.5 h-2.5 bg-transparent rounded-full block" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border",
                      TYPE_STYLES[n.type] ?? TYPE_STYLES.system
                    )}>
                      {TYPE_LABELS[n.type] ?? "System"}
                    </span>
                    <span className="text-[11px] text-text-muted">{timeAgo(n.createdAt)}</span>
                  </div>
                  <p className={cn(
                    "text-sm leading-relaxed",
                    n.isRead ? "text-text-secondary" : "text-text-primary font-medium"
                  )}>
                    {n.message}
                  </p>
                  {n.referenceId && (
                    <Link
                      href={`/papers/${n.referenceId}`}
                      className="inline-block mt-1.5 text-xs font-bold text-primary hover:underline"
                    >
                      View paper →
                    </Link>
                  )}
                </div>

                {/* Mark read button */}
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="flex-shrink-0 text-text-muted hover:text-primary transition-colors p-1 rounded-md hover:bg-primary-light"
                    title="Mark as read"
                  >
                    <CheckCheck size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-bold rounded-lg border border-border hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-text-secondary">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm font-bold rounded-lg border border-border hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
