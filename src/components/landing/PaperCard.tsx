import Link from "next/link";
import { Eye, MessageSquare, BookmarkPlus } from "lucide-react";
import { Paper } from "@/types/paper";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface PaperCardProps {
  paper: Paper;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function PaperCard({ paper }: PaperCardProps) {
  return (
    <article className="flex flex-col rounded-lg border border-border bg-background shadow-card overflow-hidden hover:shadow-md transition-shadow">
      {/* Card header — indigo */}
      <div className="bg-primary px-4 py-4 relative min-h-[90px] flex items-start">
        <h3 className="text-sm font-semibold text-white leading-snug line-clamp-3 pr-6">
          {paper.title}
        </h3>
        <button
          aria-label="Save paper"
          className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
        >
          <BookmarkPlus className="h-4 w-4" />
        </button>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4 space-y-3">
        {/* Category badge */}
        <div>
          <Badge variant="secondary" className="text-xs">
            {paper.category}
          </Badge>
        </div>

        {/* Author */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white text-xs font-semibold flex-shrink-0">
            {paper.author.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-text-primary truncate">{paper.author.name}</p>
            <p className="text-[10px] text-text-secondary truncate">{paper.author.institution}</p>
          </div>
        </div>

        {/* Abstract */}
        <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
          {paper.abstract}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {paper.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded px-2 py-0.5 text-[10px] font-medium bg-surface border border-border text-text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-[10px] text-text-secondary">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {paper.views.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {paper.comments}
          </span>
          <span className="ml-auto">{formatDate(paper.publishedAt)}</span>
        </div>

        {/* View button */}
        <Link 
            href={`/papers/${paper.id}`}
            className="text-primary text-[11px] font-extrabold flex items-center gap-1 hover:underline underline-offset-4 whitespace-nowrap"
          >
            View Thesis
          </Link>

        {/* <Link href={`/papers/${paper.id}`} className="mt-auto">
          <Button variant="primary" size="sm" className="w-full" aria-label={`View thesis: ${paper.title}`}>
            View Thesis
          </Button>
        </Link> */}
      </div>
    </article>
  );
}
