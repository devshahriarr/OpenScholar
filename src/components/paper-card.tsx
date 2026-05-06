import { Eye, Download, MessageSquare, Heart, Bookmark, FileText, Calendar } from "lucide-react";
import Link from "next/link";

export function PaperCard({ paper }: { paper: any }) {
  const version = paper.versions?.[0];

  return (
    <div className="card-premium overflow-hidden group">
      {/* Header Color Strip */}
      <div className="h-2 w-full bg-primary/80 group-hover:bg-primary transition-colors"></div>
      
      <div className="p-6">
        <div className="flex justify-between items-start gap-4 mb-4">
          <span className="bg-primary-light text-primary text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
            {paper.category?.name || "General"}
          </span>
          <button className="text-text-muted hover:text-secondary transition-colors">
            <Bookmark size={20} />
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
