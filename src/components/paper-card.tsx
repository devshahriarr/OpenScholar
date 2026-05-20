"use client";

import { Eye, Download, MessageSquare, Heart, Bookmark, FileText, Calendar } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function PaperCard({ paper }: { paper: any }) {
  const version = paper.versions?.[0];
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname === "/saved") {
      setIsSaved(true);
    }
  }, []);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await fetch("/api/engagement/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paperId: paper.id }),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (res.ok) {
        setIsSaved(!isSaved);
      }
    } catch (error) {
      console.error("Failed to save paper:", error);
    }
  };

  return (
    <div className="card-premium overflow-hidden group">
      {/* Header Color Strip */}
      <div className="h-2 w-full bg-primary/80 group-hover:bg-primary transition-colors"></div>
      
      <div className="p-6">
        <div className="flex justify-between items-start gap-4 mb-4">
          <span className="bg-primary-light text-primary text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
            {paper.category?.name || "General"}
          </span>
          <button 
            onClick={handleSave}
            className={`transition-all hover:scale-110 active:scale-95 ${
              isSaved ? "text-yellow-400" : "text-text-muted hover:text-secondary"
            }`}
          >
            <Bookmark size={20} className={isSaved ? "fill-current" : ""} />
          </button>
        </div>

        <h3 className="text-xl font-bold text-text-primary mb-3 leading-tight group-hover:text-primary transition-colors">
          <Link href={`/papers/${paper.id}`}>{version?.title || "Untitled Paper"}</Link>
        </h3>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-secondary-light flex items-center justify-center text-[10px] font-bold text-secondary">
            {paper.creator?.name?.[0] || "U"}
          </div>
          <span className="text-sm font-medium text-text-secondary">
            {paper.creator?.name || "Unknown Author"}
          </span>
          <span className="text-text-muted text-sm">•</span>
          <span className="text-text-muted text-sm flex items-center gap-1">
            <Calendar size={14} />
            {new Date(paper.createdAt).toLocaleDateString()}
          </span>
        </div>

        <p className="text-text-secondary text-sm line-clamp-3 mb-6 leading-relaxed">
          {version?.abstract || "No abstract available for this research paper."}
        </p>

        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {(version?.keywords || []).slice(0, 3).map((tag: string) => (
            <span key={tag} className="bg-background border border-border text-text-secondary text-[11px] font-medium px-2 py-1 rounded hover:border-primary/30 transition-colors">
              {tag}
            </span>
          ))}
        </div>

        <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-y-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1 text-text-muted group/stat">
              <Eye size={14} className="group-hover/stat:text-primary" />
              <span className="text-[11px] font-bold">{paper.metrics?.viewCount || 0}</span>
            </div>
            <div className="flex items-center gap-1 text-text-muted group/stat">
              <Download size={14} className="group-hover/stat:text-primary" />
              <span className="text-[11px] font-bold">{paper.metrics?.downloadCount || 0}</span>
            </div>
            <div className="flex items-center gap-1 text-text-muted group/stat">
              <MessageSquare size={14} className="group-hover/stat:text-primary" />
              <span className="text-[11px] font-bold">{paper.commentCount || 0}</span>
            </div>
          </div>

          <Link 
            href={`/papers/${paper.id}`}
            className="text-primary text-[11px] font-extrabold flex items-center gap-1 hover:underline underline-offset-4 whitespace-nowrap"
          >
            View Thesis
          </Link>
        </div>
      </div>
    </div>
  );
}
