"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Paper } from "@/types/paper";
import PaperCard from "./PaperCard";
import PaperCardSkeleton from "./PaperCardSkeleton";

export default function FeaturedPapers() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/papers/featured")
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((json) => setPapers(json?.data ?? []))
      .catch(() => setPapers([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section id="featured" className="bg-surface py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-text-primary">Featured Research</h2>
            <p className="text-sm text-text-secondary">
              Discover groundbreaking studies from leading researchers
            </p>
          </div>
          <Link
            href="/search"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Papers grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <PaperCardSkeleton key={i} />)
          ) : papers.length > 0 ? (
            papers.slice(0, 3).map((paper) => (
              <PaperCard key={paper.id} paper={paper} />
            ))
          ) : (
            <div className="col-span-3 flex flex-col items-center justify-center py-16 text-center">
              <BookOpen className="w-12 h-12 text-text-muted opacity-30 mb-4" />
              <p className="text-base font-semibold text-text-primary">No featured papers yet</p>
              <p className="text-sm text-text-secondary mt-1 mb-4">
                Be the first to publish on OpenScholar.
              </p>
              <Link
                href="/search"
                className="text-sm font-bold text-primary hover:underline underline-offset-4"
              >
                Browse all research →
              </Link>
            </div>
          )}
        </div>

        {/* Mobile view all */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/search"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover"
          >
            View all papers <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
