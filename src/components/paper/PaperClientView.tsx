"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Download, Share2, BookmarkPlus, MessageSquare, ThumbsUp, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PaperDetails, Comment, AuthorProfile } from "@/modules/paper/service";
import { cn } from "@/lib/utils";

type ViewMode = "abstract" | "article" | "pdf";

export default function PaperClientView({ 
  paper, 
  relatedPapers,
  initialComments 
}: { 
  paper: PaperDetails;
  relatedPapers: PaperDetails[];
  initialComments: Comment[];
}) {
  const [viewMode, setViewMode] = useState<ViewMode>("abstract");
  const [comments, setComments] = useState(initialComments);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Banner (Only visible in Article or PDF view) */}
      {viewMode !== "abstract" && (
        <div className="bg-surface border-b border-border py-3 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <p className="text-sm font-medium text-error">
            The full paper is available for download. Click the &quot;Download PDF&quot; button above to access the complete manuscript.
          </p>
          <Button variant="primary" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* Left Column (Main Content) */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Navigation & Actions */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/search" className="text-text-secondary hover:text-text-primary transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            
            {viewMode === "abstract" && (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setViewMode("article")}
                  className="text-primary hover:text-primary-hover transition-colors"
                >
                  <BookOpen className="h-5 w-5" />
                </button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 font-medium"
                  onClick={() => setViewMode("article")}
                >
                  <BookOpen className="h-4 w-4" />
                  Read Post
                </Button>
              </div>
            )}
          </div>

          {/* Dynamic Content Based on View Mode */}
          {viewMode === "abstract" && <AbstractView paper={paper} />}
          {viewMode === "article" && <ArticleView paper={paper} />}
          {viewMode === "pdf" && <PDFView paper={paper} />}

          {/* Engagement Bar & Comments (Only in Abstract View) */}
          {viewMode === "abstract" && (
            <div className="mt-12 space-y-8">
              <EngagementBar metrics={paper.metrics} />
              <CommentSection comments={comments} />
            </div>
          )}
        </div>

        {/* Right Column (Sidebar) */}
        <div className="w-full lg:w-[320px] xl:w-[360px] flex-shrink-0 space-y-8">
          <AuthorCard author={paper.authors[0]} />
          <RelatedPapers papers={relatedPapers} />
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function AbstractView({ paper }: { paper: PaperDetails }) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-primary leading-tight">
        {paper.title}
      </h1>
      
      <p className="text-base text-text-secondary leading-relaxed">
        {paper.abstract}
      </p>
      
      <div className="flex flex-wrap gap-2 pt-2">
        {paper.tags.map(tag => (
          <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded-md bg-surface text-xs font-medium text-text-secondary">
            {tag}
          </span>
        ))}
      </div>

      <div className="pt-4">
        {/* Placeholder for the paper thumbnail image */}
        <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 border border-border shadow-sm flex items-center justify-center overflow-hidden">
          <div className="text-4xl font-bold text-white/50">M</div>
        </div>
      </div>
    </div>
  );
}

function ArticleView({ paper }: { paper: PaperDetails }) {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-text-primary leading-tight font-serif">
        {paper.title}
      </h1>
      
      <div className="flex items-center gap-6 text-sm text-text-secondary border-b border-border pb-6">
        <div className="flex items-center gap-2">
          <span className="font-medium text-text-primary">{paper.authors.map(a => a.name).join(", ")}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>February 15, 2026</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Views ({paper.metrics.views})</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Downloads ({paper.metrics.downloads})</span>
        </div>
      </div>

      <div className="prose prose-blue max-w-none prose-headings:font-serif prose-headings:text-text-primary prose-p:text-text-secondary prose-p:leading-relaxed">
        {paper.fullText?.split('\n\n').map((paragraph, i) => {
          if (paragraph.trim().split(' ').length === 1 || paragraph.trim().length < 20) {
             return <h2 key={i} className="text-2xl font-bold mt-8 mb-4">{paragraph}</h2>;
          }
          return <p key={i} className="mb-4">{paragraph}</p>;
        })}
      </div>
    </div>
  );
}

function PDFView({ paper }: { paper: PaperDetails }) {
  return (
    <div className="flex flex-col h-[800px] bg-[#1E293B] rounded-t-xl overflow-hidden shadow-2xl border border-border">
      {/* PDF Toolbar */}
      <div className="h-12 border-b border-white/10 flex items-center px-4 justify-between text-white/80 text-sm">
        <div className="flex items-center gap-4">
          <button className="hover:text-white">&lt;</button>
          <span>Page 1 of 45</span>
          <button className="hover:text-white">&gt;</button>
        </div>
      </div>
      {/* PDF Document Container */}
      <div className="flex-1 overflow-auto p-8 flex justify-center bg-[#0F172A]">
        <div className="w-full max-w-[800px] min-h-[1000px] bg-white shadow-lg p-12 lg:p-24">
          <h1 className="text-3xl font-bold text-text-primary mb-6">{paper.title}</h1>
          <p className="text-sm text-text-secondary mb-8">By {paper.authors.map(a => a.name).join(", ")}</p>
          <h3 className="text-lg font-bold text-text-primary mb-4">Abstract</h3>
          <p className="text-text-secondary leading-relaxed">{paper.abstract}</p>
        </div>
      </div>
    </div>
  );
}

function EngagementBar({ metrics }: { metrics: PaperDetails["metrics"] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 text-xs font-medium text-text-secondary px-1">
        <span>{metrics.likes} like</span>
        <span>{metrics.comments} Comment</span>
      </div>
      
      <div className="flex items-center justify-between py-2 px-4 rounded-xl border border-border bg-background shadow-sm">
        <button className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors py-2">
          <ThumbsUp className="h-4 w-4" />
          Like
        </button>
        <button className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors py-2">
          <MessageSquare className="h-4 w-4" />
          Comment
        </button>
        <button className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors py-2">
          <BookmarkPlus className="h-4 w-4" />
          Save
        </button>
        <button className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors py-2">
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>
    </div>
  );
}

function CommentSection({ comments }: { comments: Comment[] }) {
  return (
    <div className="space-y-6">
      {/* Comment Input */}
      <div className="bg-surface rounded-xl p-4 space-y-2">
        <label className="text-xs font-medium text-text-secondary block">Thought Your Comment</label>
        <div className="relative">
          <textarea 
            placeholder="Share your thoughts about this thesis..."
            className="w-full min-h-[80px] bg-background border border-border rounded-lg p-3 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary resize-none pr-12"
          />
          <button className="absolute right-3 bottom-3 text-text-primary hover:text-primary transition-colors">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Comment List */}
      <div className="space-y-6 pt-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4 border-b border-border pb-6 last:border-0">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {comment.user.name.charAt(0)}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-sm text-text-primary">{comment.user.name}</span>
                <span className="text-xs text-text-secondary">January 18, 2024</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed pt-1">
                {comment.content}
              </p>
              <div className="flex items-center gap-4 pt-2 text-xs font-medium text-text-secondary">
                <span>6d</span>
                <button className="hover:text-text-primary transition-colors">Reply</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuthorCard({ author }: { author: AuthorProfile }) {
  return (
    <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-blue-400 border-2 border-white shadow-md flex items-center justify-center text-white text-xl font-bold">
          {author.name.charAt(0)}
        </div>
        <Button variant="primary" size="sm" className="rounded-full px-5 bg-text-primary hover:bg-black text-white">
          Follow
        </Button>
      </div>
      
      <div className="space-y-1 mb-4">
        <h3 className="font-semibold text-text-primary text-base">{author.name}</h3>
        <p className="text-xs text-text-secondary">{author.institution}</p>
      </div>

      <p className="text-xs text-text-secondary leading-relaxed mb-6 line-clamp-3">
        {author.bio}
      </p>

      <div className="flex items-center gap-4 text-xs font-medium text-text-primary">
        <span>{author.followers} Follower</span>
        <span>4k+ Like</span>
      </div>
    </div>
  );
}

function RelatedPapers({ papers }: { papers: PaperDetails[] }) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-text-primary">Related Thesis :</h4>
      <div className="space-y-0">
        {papers.map((paper, i) => (
          <div key={paper.id} className={cn("py-4 border-b border-border last:border-0", i === 0 ? "pt-2" : "")}>
            <h5 className="text-sm font-semibold text-text-primary leading-snug mb-3">
              {paper.title}
            </h5>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-primary">{paper.authors[0].name}</span>
              <button className="text-xs font-medium text-primary hover:text-primary-hover transition-colors flex items-center gap-1">
                View PDF
                <span className="text-lg leading-none">&rsaquo;</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
