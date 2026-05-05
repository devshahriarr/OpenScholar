import { Paper } from "@/types/paper";

export interface SearchResponse {
  total: number;
  page: number;
  limit: number;
  results: Paper[];
}

export async function searchPapers(searchParams: URLSearchParams): Promise<SearchResponse> {
  const queryStr = searchParams.toString();
  const res = await fetch(`/api/search?${queryStr}`, {
    cache: "no-store",
  });
  
  if (!res.ok) {
    throw new Error("Failed to fetch search results");
  }
  
  return res.json();
}
