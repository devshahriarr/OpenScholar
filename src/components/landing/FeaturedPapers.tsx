"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Paper } from "@/types/paper";
import PaperCard from "./PaperCard";
import PaperCardSkeleton from "./PaperCardSkeleton";

// Fallback data so the page is never empty
const FALLBACK_PAPERS: Paper[] = [
  {
    id: "1",
    title: "Deep Learning Applications in Natural Language Processing",
    category: "Computer Science",
    author: { name: "Sarah Johnson", institution: "MIT" },
    abstract:
      "This thesis explores the recent advancements in deep learning techniques applied to natural language processing tasks including sentiment analysis, machine translation, and text generation.",
    tags: ["AI", "Deep Learning", "NLP"],
    views: 1245,
    comments: 342,
    publishedAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Deep Learning Applications in Natural Language Processing",
    category: "Computer Science",
    author: { name: "Sarah Johnson", institution: "Stanford" },
    abstract:
      "This thesis explores the recent advancements in deep learning techniques applied to natural language processing tasks including sentiment analysis, machine translation, and text generation.",
    tags: ["AI", "Deep Learning", "NLP"],
    views: 1245,
    comments: 342,
    publishedAt: "2024-01-15",
  },
  {
    id: "3",
    title: "Deep Learning Applications in Natural Language Processing",
    category: "Computer Science",
    author: { name: "Sarah Johnson", institution: "Harvard" },
    abstract:
      "This thesis explores the recent advancements in deep learning techniques applied to natural language processing tasks including sentiment analysis, machine translation, and text generation.",
    tags: ["AI", "Deep Learning", "NLP"],
    views: 1245,
    comments: 342,
    publishedAt: "2024-01-15",
  },
];

export default function FeaturedPapers() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/papers/featured")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setPapers(data?.data ?? FALLBACK_PAPERS))
      .catch(() => setPapers(FALLBACK_PAPERS))
      .finally(() => setIsLoading(false));
  }, []);

  const displayPapers = papers.length > 0 ? papers : FALLBACK_PAPERS;

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
            href="/papers"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Papers grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <PaperCardSkeleton key={i} />)
            : displayPapers.slice(0, 3).map((paper) => (
                <PaperCard key={paper.id} paper={paper} />
              ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/papers"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover"
          >
            View all papers <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
