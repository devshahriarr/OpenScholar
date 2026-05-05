import { GlobalStats } from "@/types/paper";

export async function getGlobalStats(): Promise<GlobalStats> {
  const res = await fetch("/api/analytics/global-stats", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch global stats.");
  const data = await res.json();
  return data.data;
}
