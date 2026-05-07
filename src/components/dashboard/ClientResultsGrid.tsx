"use client";

import { useEffect, useState } from "react";
import { SearchResponse } from "@/modules/search/repository";
import PaperCard from "@/components/landing/PaperCard";
import PaperCardSkeleton from "@/components/landing/PaperCardSkeleton";
import { Button } from "@/components/ui/Button";

function ResultsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <PaperCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function ClientResultsGrid({ searchParamsStr }: { searchParamsStr: string }) {
  const [data, setData] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    fetch(`/api/search?${searchParamsStr}`)
      .then(async res => {
        if (!res.ok) {
          try {
            const errData = await res.json();
            throw new Error(errData.message || "Failed to fetch research papers.");
          } catch (e) {
            throw new Error(`Server error: ${res.status} ${res.statusText}`);
          }
        }
        return res.json();
      })
      .then(setData)
      .catch((err) => {
        console.error("[SEARCH_FETCH_ERROR]", err.message);
        setError(err.message || "An unexpected error occurred. Please try again.");
      })
      .finally(() => setIsLoading(false));
  }, [searchParamsStr]);

  if (isLoading) return <ResultsGridSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center rounded-xl border border-red-200 bg-red-50/50">
        <h3 className="text-lg font-semibold text-red-700 mb-2">Search Error</h3>
        <p className="text-sm text-red-600 max-w-sm">{error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!data || data.results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center rounded-xl border border-dashed border-border bg-background">
        <h3 className="text-lg font-semibold text-text-primary mb-2">No results found</h3>
        <p className="text-sm text-text-secondary max-w-sm">
          We couldn&apos;t find any papers matching your search criteria. Try adjusting your filters or keywords.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.results.map((paper) => (
          <PaperCard key={paper.id} paper={paper} />
        ))}
      </div>
      
      {/* Pagination controls (simplified) */}
      {data.total > data.limit && (
        <div className="flex justify-center pt-8 border-t border-border">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={data.page === 1}>Previous</Button>
            <div className="flex items-center px-4 text-sm font-medium text-text-secondary">
              Page {data.page} of {Math.ceil(data.total / data.limit)}
            </div>
            <Button variant="outline" size="sm" disabled={data.page >= Math.ceil(data.total / data.limit)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
