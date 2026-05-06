"use client";

import { useState } from "react";
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter,
  Eye,
  Slash,
  User,
  Building2,
  Calendar,
  FileText,
  Bookmark
} from "lucide-react";
import { AdminStatCard } from "@/components/admin/stat-card";
import { clsx } from "clsx";

const PENDING_PAPERS = [
  { 
    id: "1", 
    author: "Robert Chan", 
    institution: "MIT",
    category: "Computer Science", 
    title: "Quantum Machine Learning for Financial Prediction", 
    abstract: "This paper explores the application of quantum computing principles to enhance machine learning models for financial market prediction. We propose a hybrid quantum-classical architecture that significantly reduces training time while maintaining high accuracy...",
    keywords: ["AI", "Deep Learning", "NLP", "Quantum"], 
    submitted: "2 hours ago",
    status: "pending" 
  },
  { 
    id: "2", 
    author: "Robert Chan", 
    institution: "Stanford",
    category: "Environmental Science", 
    title: "Deep learning applications in natural disaster mitigation", 
    abstract: "Recent advancements in deep learning have opened new avenues for natural disaster prediction and mitigation. This study evaluates the efficacy of convolutional neural networks in processing satellite imagery for real-time flood monitoring...",
    keywords: ["AI", "Deep Learning", "NLP"], 
    submitted: "5 hours ago",
    status: "pending" 
  },
  { 
    id: "3", 
    author: "Robert Chan", 
    institution: "Harvard",
    category: "Computer Science", 
    title: "Machine learning for finance: A comprehensive survey", 
    abstract: "The financial sector is undergoing a massive transformation driven by machine learning algorithms. This survey provides a systematic overview of the current state-of-the-art techniques in algorithmic trading, risk management, and fraud detection...",
    keywords: ["AI", "Deep Learning", "NLP"], 
    submitted: "1 day ago",
    status: "pending" 
  },
];

export default function PendingApprovalsPage() {
  const [selectedPaper, setSelectedPaper] = useState<any>(null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Pending Approvals</h1>
        <p className="text-text-secondary mt-1 text-sm font-medium">Review and approve submitted papers</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminStatCard label="Pending Review" value="5" trend="+1" icon={Clock} color="warning" />
        <AdminStatCard label="Approved" value="0" trend="0" icon={CheckCircle2} color="success" />
        <AdminStatCard label="Rejected" value="0" trend="0" icon={XCircle} color="warning" />
      </div>

      {/* Filter Bar */}
      <div className="card-premium p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search by title or author..." 
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-border text-sm font-bold text-text-secondary hover:bg-background transition-all">
            <Filter size={18} />
            All Categories
            <Slash size={14} className="rotate-[110deg] opacity-20" />
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="card-premium overflow-hidden">
        <div className="p-6 bg-primary-light/30 border-b border-border flex justify-between items-center">
          <div className="grid grid-cols-5 w-full text-[11px] font-extrabold text-text-secondary uppercase tracking-widest px-4">
            <span>Author Name</span>
            <span>Category</span>
            <span>Title</span>
            <span>Keyword</span>
            <span className="text-right">Action</span>
          </div>
        </div>
        <div className="divide-y divide-border">
          {PENDING_PAPERS.map((paper) => (
            <div key={paper.id} className="grid grid-cols-5 items-center p-6 px-10 hover:bg-background transition-colors">
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
                {paper.keywords.slice(0, 3).map((k) => (
                  <span key={k} className="text-[9px] font-bold text-text-muted bg-background border border-border px-1.5 py-0.5 rounded uppercase tracking-tighter">
                    {k}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-end gap-3">
                <button 
                  onClick={() => setSelectedPaper(paper)}
                  className="text-text-muted hover:text-primary transition-colors p-1.5 hover:bg-primary-light rounded-lg"
                >
                  <Eye size={18} />
                </button>
                <button className="text-text-muted hover:text-green-600 transition-colors p-1.5 hover:bg-green-50 rounded-lg">
                  <CheckCircle2 size={18} />
                </button>
                <button className="text-text-muted hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 rounded-lg">
                  <XCircle size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Paper Review Modal */}
      {selectedPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 relative">
              <button 
                onClick={() => setSelectedPaper(null)}
                className="absolute top-6 right-6 p-2 text-text-muted hover:bg-background rounded-full transition-all"
              >
                <XCircle size={24} />
              </button>

              <div className="mb-8">
                <span className="bg-blue-100 text-blue-600 text-[10px] font-extrabold px-3 py-1 rounded uppercase tracking-widest mb-3 inline-block">
                  {selectedPaper.category}
                </span>
                <h3 className="text-2xl font-extrabold text-text-primary tracking-tight leading-snug">
                  {selectedPaper.title}
                </h3>
              </div>

              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <div>
                  <h4 className="text-sm font-bold text-text-primary mb-2 uppercase tracking-wider flex items-center gap-2">
                    <FileText size={16} className="text-primary" />
                    Abstract
                  </h4>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {selectedPaper.abstract}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-text-primary mb-2 uppercase tracking-wider flex items-center gap-2">
                    <Bookmark size={16} className="text-primary" />
                    Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPaper.keywords.map((k: string) => (
                      <span key={k} className="text-[10px] font-bold text-text-muted bg-background border border-border px-3 py-1 rounded uppercase">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <h4 className="text-sm font-bold text-text-primary mb-4 uppercase tracking-wider">Author Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                    <p className="flex items-center gap-2 text-text-secondary">
                      <span className="font-bold w-12 text-text-muted">Name:</span> 
                      <span className="text-text-primary">{selectedPaper.author}</span>
                    </p>
                    <p className="flex items-center gap-2 text-text-secondary">
                      <span className="font-bold w-20 text-text-muted">Institution:</span> 
                      <span className="text-text-primary">{selectedPaper.institution}</span>
                    </p>
                    <p className="flex items-center gap-2 text-text-secondary">
                      <span className="font-bold w-12 text-text-muted">Submitted:</span> 
                      <span className="text-text-primary">{selectedPaper.submitted}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                  <CheckCircle2 size={20} />
                  Approve Paper
                </button>
                <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-600/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                  <XCircle size={20} />
                  Reject Paper
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
