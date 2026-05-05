import { Paper } from "@/types/paper";

export async function getFeaturedPapers(): Promise<Paper[]> {
  const res = await fetch("/api/papers/featured", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch featured papers.");
  const data = await res.json();
  return data.data ?? [];
}
