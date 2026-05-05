"use client";

import { useEffect, useState } from "react";
import { GlobalStats } from "@/types/paper";
import { Skeleton } from "@/components/ui/Loader";

const FALLBACK_STATS: GlobalStats = {
  totalPapers: 45000,
  universities: 320,
  researchers: 12000,
  downloads: 2300000,
};

function formatStat(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M+`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K+`;
  return `${value}+`;
}

const STAT_LABELS: { key: keyof GlobalStats; label: string }[] = [
  { key: "totalPapers", label: "Research Papers" },
  { key: "universities", label: "University" },
  { key: "researchers", label: "Global Researchers" },
  { key: "downloads", label: "Downloads" },
];

export default function StatsBar() {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/global-stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setStats(data?.data ?? FALLBACK_STATS))
      .catch(() => setStats(FALLBACK_STATS))
      .finally(() => setIsLoading(false));
  }, []);

  const displayStats = stats ?? FALLBACK_STATS;

  return (
    <section id="stats" className="bg-primary py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STAT_LABELS.map(({ key, label }) => (
            <div key={key} className="text-center space-y-1">
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-24 mx-auto bg-white/20" />
                  <Skeleton className="h-3 w-20 mx-auto bg-white/15" />
                </>
              ) : (
                <>
                  <p className="text-3xl font-semibold text-white">
                    {formatStat(displayStats[key])}
                  </p>
                  <p className="text-xs text-white/70">{label}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
