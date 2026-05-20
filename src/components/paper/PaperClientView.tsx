"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Download, Share2, BookmarkPlus, MessageSquare, ThumbsUp, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PaperDetails, Comment, AuthorProfile } from "@/modules/paper/service";
import { cn } from "@/lib/utils";

type ViewMode = "abstract" | "article" | "pdf";

export default function PaperClientView({ 
  paper, 
  relatedPapers,
  initialComments,
  initialInteractions,
  initialIsFollowing
}: { 
  paper: PaperDetails;
  relatedPapers: PaperDetails[];
  initialComments: Comment[];
  initialInteractions: { isLiked: boolean; isSaved: boolean };
  initialIsFollowing: boolean;
}) {
  const [viewMode, setViewMode] = useState<ViewMode>("abstract");
  const [comments, setComments] = useState(initialComments);
  const [likes, setLikes] = useState(paper.metrics.likes);
  const [isLiked, setIsLiked] = useState(initialInteractions.isLiked);
  const [isSaved, setIsSaved] = useState(initialInteractions.isSaved);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const viewTrackedRef = React.useRef(false);

  React.useEffect(() => {
    if (!viewTrackedRef.current) {
      viewTrackedRef.current = true;
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paperId: paper.id, eventType: "view" }),
      }).catch(console.error);
    }
  }, [paper.id]);

  const handleDownload = async () => {
    try {
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paperId: paper.id, eventType: "download" }),
      });
    } catch (error) {
      console.error("Failed to track download", error);
    }
    window.open(paper.pdfUrl, "_blank");
  };

  const handleLike = async () => {
    // Optimistic update
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikes(prev => newLikedState ? prev + 1 : prev - 1);

    try {
      await fetch("/api/engagement/react", {
        method: "POST",
        body: JSON.stringify({ paperId: paper.id, type: "like" }),
      });
    } catch (error) {
      // Revert on error
      setIsLiked(!newLikedState);
      setLikes(prev => !newLikedState ? prev + 1 : prev - 1);
    }
  };

  const handleSave = async () => {
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);

    try {
      await fetch("/api/engagement/save", {
        method: "POST",
        body: JSON.stringify({ paperId: paper.id }),
      });
    } catch (error) {
      setIsSaved(!newSavedState);
    }
  };

  const handleFollow = async () => {
    const newFollowState = !isFollowing;
    setIsFollowing(newFollowState);

    try {
      const res = await fetch("/api/engagement/follow", {
        method: "POST",
        body: JSON.stringify({ targetUserId: paper.authors[0].id }),
      });
      if (!res.ok) throw new Error("Failed to follow");
    } catch (error: any) {
      console.error("Follow error:", error);
      alert(error.message || "Failed to follow researcher");
      setIsFollowing(!newFollowState);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: paper.title,
        text: paper.abstract,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/engagement/comment", {
        method: "POST",
        body: JSON.stringify({ paperId: paper.id, content: newComment }),
      });

      if (res.ok) {
        const comment = await res.json();
        setComments([comment, ...comments]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Failed to add comment", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white w-full">
      {/* Top Banner (Only visible in Article view) */}
      {viewMode === "article" && (
        <div className="w-full bg-[#F8F9FA] border-b border-border">
          <div className="max-w-[1200px] mx-auto py-2.5 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <p className="text-[13px] font-medium text-[#FF4D4D]">
              The full paper is available for download. Click the &quot;Download PDF&quot; button above to access the complete manuscript.
            </p>
            <Button onClick={handleDownload} variant="primary" size="sm" className="gap-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-lg h-9">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <header className="w-full border-b border-transparent">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <button 
            onClick={() => {
              if (viewMode !== "abstract") {
                setViewMode("abstract");
              } else {
                window.location.href = "/search";
              }
            }}
            className="p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          
          <div className="flex items-center gap-4">
          {/* New Book Icon from Image 2 to trigger PDF view */}
          <button 
            onClick={() => setViewMode("pdf")}
            className={cn(
              "p-2 rounded-full transition-colors",
              viewMode === "pdf" ? "bg-primary/10 text-primary" : "text-primary hover:bg-primary/5"
            )}
            title="View PDF"
          >
            <BookOpen className="h-7 w-7" />
          </button>
          
          <button 
            onClick={handleSave}
            className={cn(
              "p-2 rounded-full transition-colors",
              isSaved ? "bg-primary/10 text-primary" : "text-primary hover:bg-primary/5"
            )}
            title="Save paper"
          >
            <BookmarkPlus className={cn("h-7 w-7", isSaved && "fill-current")} />
          </button>

          {viewMode === "abstract" && (
            <Button 
              variant="outline" 
              size="md" 
              className="gap-2 font-semibold border-[#1A73E8] text-[#1A73E8] hover:bg-[#1A73E8]/5 rounded-lg h-11 px-6 shadow-sm"
              onClick={() => setViewMode("article")}
            >
              <BookOpen className="h-5 w-5" />
              Read Post
            </Button>
          )}
        </div>
      </div>
    </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 pb-24">
          
          {/* Left Column (Main Content) */}
          <div className="flex-1 min-w-0">
            {viewMode === "abstract" && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <AbstractView paper={paper} />
                <EngagementBar 
                  metrics={{...paper.metrics, likes}} 
                  isLiked={isLiked} 
                  isSaved={isSaved}
                  onLike={handleLike} 
                  onSave={handleSave}
                  onShare={handleShare}
                  onComment={() => {
                    const commentBox = document.getElementById("comment-box");
                    if (commentBox) {
                      commentBox.scrollIntoView({ behavior: "smooth" });
                      const textarea = commentBox.querySelector("textarea");
                      if (textarea) textarea.focus();
                    }
                  }}
                />
                <CommentSection 
                  comments={comments} 
                  newComment={newComment}
                  setNewComment={setNewComment}
                  onAddComment={handleAddComment}
                />
              </div>
            )}
            {viewMode === "article" && <ArticleView paper={paper} setViewMode={setViewMode} />}
            {viewMode === "pdf" && <PDFView paper={paper} setViewMode={setViewMode} />}
          </div>

          {/* Right Column (Sidebar) */}
          <aside className="w-full lg:w-[350px] flex-shrink-0 space-y-12">
            <AuthorCard 
              author={paper.authors[0]} 
              isFollowing={isFollowing}
              onFollow={handleFollow}
            />
            <RelatedPapers papers={relatedPapers} />
          </aside>
        </div>
      </main>
    </div>
  );
}

// --- Sub-components ---

function PDFView({ paper, setViewMode }: { paper: PaperDetails, setViewMode: (mode: ViewMode) => void }) {
  return (
    <div className="flex flex-col h-[850px] bg-[#1E293B] rounded-[20px] overflow-hidden shadow-2xl border border-[#334155] animate-in zoom-in-95 duration-300">
      {/* PDF Viewer Header (Matching Image 3) */}
      <div className="h-14 bg-[#111827] border-b border-[#374151] flex items-center px-6 justify-between text-white/70 text-[13px] font-medium">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setViewMode("abstract")}
            className="hover:text-white p-1 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-4 select-none">
            <span>Page 1 of 45</span>
            <div className="flex gap-1">
              <button className="hover:text-white p-1 opacity-50">&rsaquo;</button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
           {/* Zoom or other tools could go here */}
        </div>
      </div>

      {/* Document Preview Area */}
      <div className="flex-1 overflow-auto p-12 flex justify-center bg-[#0F172A] custom-scrollbar">
        <div className="w-full max-w-[760px] min-h-[1000px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-16 lg:p-24 transform origin-top transition-transform">
          <div className="space-y-10">
            <h1 className="text-[32px] font-bold text-text-primary leading-[1.3] text-center border-b border-gray-100 pb-10">
              {paper.title}
            </h1>
            
            <div className="text-center space-y-1">
              <p className="text-[14px] font-semibold text-text-secondary">By {paper.authors.map(a => a.name).join(", ")}</p>
              <p className="text-[12px] text-gray-400 italic">OpenScholar University Research Library</p>
            </div>

            <div className="pt-10">
              <h3 className="text-[18px] font-bold text-text-primary mb-5 uppercase tracking-wider">Abstract</h3>
              <p className="text-[15px] text-[#333] leading-[1.8] text-justify">
                {paper.abstract}
              </p>
            </div>

            <div className="space-y-6 pt-10">
              <div className="h-4 w-full bg-gray-50 rounded animate-pulse"></div>
              <div className="h-4 w-[90%] bg-gray-50 rounded animate-pulse"></div>
              <div className="h-4 w-[95%] bg-gray-50 rounded animate-pulse"></div>
              <div className="h-4 w-[85%] bg-gray-50 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AbstractView({ paper }: { paper: PaperDetails }) {
  return (
    <div className="space-y-6">
      <h1 className="text-[32px] font-bold text-text-primary leading-tight tracking-tight">
        {paper.title}
      </h1>
      
      <p className="text-[15px] text-[#4A4A4A] leading-[1.6] max-w-3xl">
        {paper.abstract}
      </p>
      
      <div className="flex flex-wrap gap-2 pt-2">
        {paper.tags.map(tag => (
          <span key={tag} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#F1F3F5] text-[12px] font-medium text-[#5F6368]">
            {tag}
          </span>
        ))}
      </div>

      <div className="pt-4">
        {/* Paper Thumbnail */}
        <div className="w-[120px] h-[120px] rounded-2xl bg-gradient-to-br from-[#E8EAED] to-[#D2D4D7] border border-[#E0E2E4] shadow-sm flex items-center justify-center overflow-hidden">
          <div className="text-3xl font-bold text-white/60 select-none">M</div>
        </div>
      </div>
    </div>
  );
}

function ArticleView({ paper, setViewMode }: { paper: PaperDetails; setViewMode: (mode: ViewMode) => void }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="text-[36px] font-bold text-text-primary leading-[1.2] font-serif">
        {paper.title}
      </h1>
      
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-text-secondary border-b border-[#E0E2E4] pb-6">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text-primary">{paper.authors.map(a => a.name).join(", ")}</span>
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

      <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-text-primary prose-p:text-[#4A4A4A] prose-p:leading-[1.7] prose-p:text-[16px]">
        {/* Dynamic section rendering */}
        <section className="mb-8">
          <h2 className="text-[24px] mb-4">Abstract</h2>
          <p>{paper.abstract}</p>
        </section>

        {paper.fullText?.split('\n\n').map((paragraph, i) => {
          const isHeading = paragraph.trim().split(' ').length < 4 && paragraph.length < 40;
          if (isHeading) {
             return <h2 key={i} className="text-[24px] mt-10 mb-5">{paragraph}</h2>;
          }
          return <p key={i} className="mb-5">{paragraph}</p>;
        }) || (
          <>
            <section className="mb-8">
              <h2 className="text-[24px] mb-4 mt-8">Introduction</h2>
              <p>Climate change represents one of the most pressing challenges of our time. Traditional climate models, while powerful, often struggle with the complexity and scale of global climate systems.</p>
            </section>
            <section className="mb-8">
              <h2 className="text-[24px] mb-4 mt-8">Methodology</h2>
              <p>We conducted a systematic review of machine learning applications in climate science, focusing on deep neural networks, ensemble methods, and hybrid approaches.</p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function EngagementBar({ 
  metrics, 
  isLiked, 
  isSaved,
  onLike, 
  onSave,
  onShare,
  onComment
}: { 
  metrics: PaperDetails["metrics"]; 
  isLiked: boolean;
  isSaved: boolean;
  onLike: () => void;
  onSave: () => void;
  onShare: () => void;
  onComment: () => void;
}) {
  return (
    <div className="space-y-3 pt-4">
      <div className="flex items-center gap-4 text-[13px] font-medium text-text-secondary px-1">
        <span>{metrics.likes} like</span>
        <span>{metrics.comments} Comment</span>
      </div>
      
      <div className="flex items-center justify-between py-1.5 px-4 rounded-[14px] border border-[#E0E2E4] bg-white shadow-sm">
        <button 
          onClick={onLike}
          className={cn(
            "flex items-center gap-2.5 text-[14px] font-semibold transition-colors py-2 px-3 rounded-lg hover:bg-primary/5",
            isLiked ? "text-primary" : "text-[#5F6368]"
          )}
        >
          <ThumbsUp className={cn("h-[18px] w-[18px]", isLiked && "fill-current")} />
          Like
        </button>
        <button 
          onClick={onComment}
          className="flex items-center gap-2.5 text-[14px] font-semibold text-[#5F6368] hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-primary/5"
        >
          <MessageSquare className="h-[18px] w-[18px]" />
          Comment
        </button>
        <button 
          onClick={onSave}
          className={cn(
            "flex items-center gap-2.5 text-[14px] font-semibold transition-colors py-2 px-3 rounded-lg hover:bg-primary/5",
            isSaved ? "text-primary" : "text-[#5F6368]"
          )}
        >
          <BookmarkPlus className={cn("h-[18px] w-[18px]", isSaved && "fill-current")} />
          Save
        </button>
        <button 
          onClick={onShare}
          className="flex items-center gap-2.5 text-[14px] font-semibold text-[#5F6368] hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-primary/5"
        >
          <Share2 className="h-[18px] w-[18px]" />
          Share
        </button>
      </div>
    </div>
  );
}

function CommentSection({ 
  comments, 
  newComment, 
  setNewComment, 
  onAddComment 
}: { 
  comments: Comment[];
  newComment: string;
  setNewComment: (val: string) => void;
  onAddComment: () => void;
}) {
  return (
    <div id="comment-box" className="space-y-8">
      {/* Comment Input Box */}
      <div className="bg-[#F8F9FA] rounded-[18px] p-6 border border-[#F1F3F5] space-y-4 shadow-sm">
        <label className="text-[13px] font-bold text-[#5F6368] tracking-wide uppercase">Thought Your Comment</label>
        <div className="relative group">
          <textarea 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts about this thesis..."
            className="w-full min-h-[100px] bg-white border border-[#E0E2E4] rounded-2xl p-4 text-[15px] text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none pr-14"
          />
          <button 
            onClick={onAddComment}
            disabled={!newComment.trim()}
            className="absolute right-4 bottom-4 p-2 bg-transparent text-text-primary hover:text-primary hover:scale-110 transition-all disabled:opacity-30 disabled:hover:scale-100"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Comment List */}
      <div className="space-y-8 pt-2">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            {comment.user.avatarUrl ? (
              <img 
                src={comment.user.avatarUrl} 
                alt={comment.user.name} 
                className="w-[42px] h-[42px] rounded-full object-cover flex-shrink-0 shadow-sm" 
              />
            ) : (
              <div className="w-[42px] h-[42px] rounded-full bg-[#1A73E8] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm animate-in zoom-in-50 duration-200">
                {comment.user.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 space-y-2">
              <div className="flex items-baseline gap-2.5">
                <span className="font-bold text-[15px] text-text-primary">{comment.user.name}</span>
                <span className="text-[12px] text-text-secondary font-medium tracking-tight">
                  {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <p className="text-[14px] text-[#4A4A4A] leading-[1.6] pt-0.5">
                {comment.content}
              </p>
              <div className="flex items-center gap-5 pt-1.5 text-[12px] font-bold text-[#5F6368]">
                <span className="opacity-70">Just now</span>
                <button className="hover:text-primary transition-colors tracking-tight">Reply</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuthorCard({ 
  author, 
  isFollowing, 
  onFollow 
}: { 
  author: AuthorProfile;
  isFollowing: boolean;
  onFollow: () => void;
}) {
  return (
    <div className="rounded-[20px] border border-[#E0E2E4] bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-5">
        {/* Avatar with image or initial */}
        {author.avatarUrl ? (
          <img src={author.avatarUrl} alt={author.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#1A73E8] to-[#64B5F6] border-2 border-white shadow-md flex items-center justify-center text-white text-[24px] font-bold">
            {author.name.charAt(0)}
          </div>
        )}
        <Button 
          variant={isFollowing ? "outline" : "primary"}
          size="sm" 
          onClick={onFollow}
          className={cn(
            "rounded-lg px-6 font-bold text-[13px] h-8 transition-all",
            isFollowing ? "border-gray-300 text-gray-600 hover:bg-gray-50" : "bg-black hover:bg-gray-800 text-white"
          )}
        >
          {isFollowing ? "Following" : "Follow"}
        </Button>
      </div>
      
      <div className="space-y-1 mb-4">
        <h3 className="font-bold text-text-primary text-[17px] tracking-tight">{author.name}</h3>
        <p className="text-[12px] text-[#5F6368] font-medium">{author.institution}</p>
      </div>

      <p className="text-[13px] text-[#4A4A4A] leading-[1.6] mb-6 line-clamp-3">
        {author.bio}
      </p>

      <div className="flex items-center gap-6 text-[13px] font-bold text-text-primary border-t border-[#F1F3F5] pt-5">
        <div className="flex flex-col">
          <span className="text-text-primary">{author.followers}</span>
          <span className="text-[#5F6368] text-[11px] uppercase tracking-wider">Follower</span>
        </div>
        <div className="flex flex-col">
          <span className="text-text-primary">{author.likes || 0}</span>
          <span className="text-[#5F6368] text-[11px] uppercase tracking-wider">Like</span>
        </div>
      </div>
    </div>
  );
}

function RelatedPapers({ papers }: { papers: PaperDetails[] }) {
  return (
    <div className="space-y-5">
      <h4 className="text-[14px] font-bold text-text-primary tracking-tight">Related Thesis :</h4>
      <div className="space-y-0">
        {papers.map((paper, i) => (
          <div key={paper.id} className={cn("py-5 border-b border-[#F1F3F5] last:border-0", i === 0 ? "pt-0" : "")}>
            <Link href={`/papers/${paper.id}`} className="group block">
              <h5 className="text-[14px] font-bold text-text-primary leading-[1.4] mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                {paper.title}
              </h5>
            </Link>
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-[#5F6368]">{paper.authors[0].name}</span>
              <Link 
                href={`/papers/${paper.id}`}
                className="text-[12px] font-bold text-[#1A73E8] hover:text-[#1557B0] transition-colors flex items-center gap-1.5 group"
              >
                View Thesis
                <span className="text-[16px] leading-none transition-transform group-hover:translate-x-1">&rsaquo;</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

