"use client";

import { XCircle, FileText, Bookmark, CheckCircle2, Loader2 } from "lucide-react";

interface PaperReviewModalProps {
  paper: any;
  onClose: () => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  isProcessing?: boolean;
}

export function PaperReviewModal({ paper, onClose, onApprove, onReject, isProcessing }: PaperReviewModalProps) {
  if (!paper) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-8 relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-text-muted hover:bg-background rounded-full transition-all"
          >
            <XCircle size={24} />
          </button>

          <div className="mb-8">
            <span className="bg-blue-100 text-blue-600 text-[10px] font-extrabold px-3 py-1 rounded uppercase tracking-widest mb-3 inline-block">
              {paper.category}
            </span>
            <h3 className="text-2xl font-extrabold text-text-primary tracking-tight leading-snug">
              {paper.title}
            </h3>
          </div>

          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            <div>
              <h4 className="text-sm font-bold text-text-primary mb-2 uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} className="text-primary" />
                Abstract
              </h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                {paper.abstract || "No abstract provided for this submission."}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-text-primary mb-2 uppercase tracking-wider flex items-center gap-2">
                <Bookmark size={16} className="text-primary" />
                Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {(paper.keywords || []).map((k: string) => (
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
                  <span className="text-text-primary">{paper.author}</span>
                </p>
                <p className="flex items-center gap-2 text-text-secondary">
                  <span className="font-bold w-20 text-text-muted">Institution:</span> 
                  <span className="text-text-primary">{paper.institution || "N/A"}</span>
                </p>
                <p className="flex items-center gap-2 text-text-secondary">
                  <span className="font-bold w-12 text-text-muted">Submitted:</span> 
                  <span className="text-text-primary">{paper.submitted || "Recent"}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <button 
              disabled={isProcessing}
              onClick={() => onApprove?.(paper.id)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
              Approve Paper
            </button>
            <button 
              disabled={isProcessing}
              onClick={() => onReject?.(paper.id)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <XCircle size={20} />}
              Reject Paper
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
