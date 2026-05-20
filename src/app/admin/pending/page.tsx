"use client";

import { useState, useEffect } from "react";
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter,
  Eye,
  Slash,
  FileText,
  Bookmark,
  Loader2
} from "lucide-react";
import { AdminStatCard } from "@/components/admin/stat-card";
import { PaperReviewModal } from "@/components/admin/paper-review-modal";
import { clsx } from "clsx";

export default function PendingApprovalsPage() {
  const [papers, setPapers] = useState<any[]>([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPaper, setSelectedPaper] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/pending");
      if (res.ok) {
        const data = await res.json();
        setPapers(data.papers);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch pending papers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchData();
    });
  }, []);

  const handleModerate = async (paperId: string, action: "approved" | "rejected") => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/admin/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paperId, action }),
      });

      if (res.ok) {
        setSelectedPaper(null);
        await fetchData(); // Refresh list and stats
      } else {
        const data = await res.json();
        alert(data.message || "Failed to moderate paper");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Pending Approvals</h1>
        <p className="text-text-secondary mt-1 text-sm font-medium">Review and approve submitted papers</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminStatCard label="Pending Review" value={stats.pending.toString()} trend="+1" icon={Clock} color="warning" />
        <AdminStatCard label="Approved" value={stats.approved.toString()} trend="0" icon={CheckCircle2} color="success" />
        <AdminStatCard label="Rejected" value={stats.rejected.toString()} trend="0" icon={XCircle} color="warning" />
      </div>

      {/* Filter Bar */}
      <div className="bg-white shadow-sm rounded-2xl border border-gray-100 p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by title or author..." 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
            <Filter size={18} />
            All Categories
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
          <div className="grid grid-cols-6 w-full text-[11px] font-extrabold text-gray-500 uppercase tracking-widest px-4">
            <span>Author Name</span>
            <span>Category</span>
            <span>Title</span>
            <span>Keyword</span>
            <span>Status</span>
            <span className="text-right">Action</span>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {papers.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No pending papers found.
            </div>
          ) : papers.map((paper) => (
            <div key={paper.id} className="grid grid-cols-6 items-center p-6 px-10 hover:bg-gray-50/50 transition-colors">
              <span className="text-sm font-bold text-text-primary">{paper.author}</span>
              <div>
                <span className={clsx(
                  "text-[10px] font-bold px-3 py-1 rounded uppercase",
                  paper.category === "Computer Science" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                )}>
                  {paper.category}
                </span>
              </div>
              <span className="text-sm font-bold text-text-primary truncate pr-8">{paper.title}</span>
              <div className="flex gap-1">
                {paper.keywords.slice(0, 3).map((k: string) => (
                  <span key={k} className="text-[9px] font-bold text-gray-400 bg-white border border-gray-100 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                    {k}
                  </span>
                ))}
              </div>
              <span className={clsx(
                "text-[10px] font-bold px-3 py-1 rounded uppercase w-fit",
                paper.status === "pending" && "bg-yellow-100 text-yellow-600",
                paper.status === "approved" && "bg-green-100 text-green-600",
                paper.status === "rejected" && "bg-red-100 text-red-600",
                paper.status === "draft" && "bg-gray-100 text-gray-600"
              )}>
                {paper.status}
              </span>
              <div className="flex items-center justify-end gap-3">
                <button 
                  onClick={() => setSelectedPaper(paper)}
                  className="text-gray-400 hover:text-primary transition-colors p-1.5 hover:bg-primary/5 rounded-lg"
                >
                  <Eye size={18} />
                </button>
                <button 
                  onClick={() => handleModerate(paper.id, "approved")}
                  className="text-gray-400 hover:text-green-600 transition-colors p-1.5 hover:bg-green-50 rounded-lg"
                >
                  <CheckCircle2 size={18} />
                </button>
                <button 
                  onClick={() => handleModerate(paper.id, "rejected")}
                  className="text-gray-400 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 rounded-lg"
                >
                  <XCircle size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Paper Review Modal */}
      <PaperReviewModal 
        paper={selectedPaper} 
        onClose={() => setSelectedPaper(null)} 
        onApprove={(id) => handleModerate(id, "approved")}
        onReject={(id) => handleModerate(id, "rejected")}
        isProcessing={isProcessing}
      />
    </div>
  );
}
