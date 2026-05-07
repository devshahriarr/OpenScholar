"use client";

import { useEffect, useState } from "react";
import { Upload, BarChart3, Eye, Download, MessageSquare, Calendar, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Paper {
  id: string;
  title: string;
  date: string;
  views: number;
  downloads: number;
  comments: number;
  dept: string;
  status: string;
}

export default function MyUploadsPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMyPapers() {
      try {
        const res = await fetch("/api/papers/mine");
        if (!res.ok) {
          throw new Error("Failed to fetch your papers.");
        }
        const data = await res.json();
        setPapers(data);
      } catch (err: any) {
        setError(err.message || "An error occurred while loading your papers.");
      } finally {
        setLoading(false);
      }
    }

    fetchMyPapers();
  }, []);

  // Calculate Stats
  const totalViews = papers.reduce((acc, p) => acc + p.views, 0);
  const totalDownloads = papers.reduce((acc, p) => acc + p.downloads, 0);
  const totalComments = papers.reduce((acc, p) => acc + p.comments, 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-text-muted font-medium">Loading your research library...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
        <div className="bg-red-50 p-4 rounded-full text-red-500 mb-2">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-xl font-bold text-text-primary">Oops! Something went wrong</h2>
        <p className="text-text-muted max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card-premium p-6 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Total Thesis</p>
            <p className="text-3xl font-bold text-text-primary">{papers.length}</p>
          </div>
          <div className="bg-primary-light p-3 rounded-xl text-primary">
            <BarChart3 size={24} />
          </div>
        </div>
        <div className="card-premium p-6 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Total Views</p>
            <p className="text-3xl font-bold text-text-primary">{totalViews.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-xl text-green-600">
            <Eye size={24} />
          </div>
        </div>
        <div className="card-premium p-6 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Downloads</p>
            <p className="text-3xl font-bold text-text-primary">{totalDownloads.toLocaleString()}</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
            <Download size={24} />
          </div>
        </div>
        <div className="card-premium p-6 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Comments</p>
            <p className="text-3xl font-bold text-text-primary">{totalComments.toLocaleString()}</p>
          </div>
          <div className="bg-orange-50 p-3 rounded-xl text-orange-500">
            <MessageSquare size={24} />
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-primary rounded-2xl p-8 mb-12 flex flex-col md:flex-row justify-between items-center gap-6 shadow-lg shadow-primary/20">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Share Your Research with the World</h2>
          <p className="text-primary-light/80 text-sm">Upload your thesis and make it accessible to researchers globally</p>
        </div>
        <Link href="/papers/upload">
          <button className="bg-white text-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-light transition-all shadow-md active:scale-95 whitespace-nowrap">
            <Upload size={20} />
            Upload Thesis
          </button>
        </Link>
      </div>

      {/* Papers List */}
      {papers.length === 0 ? (
        <div className="card-premium p-12 text-center flex flex-col items-center gap-4">
          <div className="bg-background p-6 rounded-full text-text-muted">
            <Upload size={48} />
          </div>
          <h3 className="text-xl font-bold text-text-primary">No research uploaded yet</h3>
          <p className="text-text-muted max-w-sm">Start your journey by uploading your first research paper or thesis.</p>
          <Link href="/papers/upload">
            <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all mt-2">
              Upload Now
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {papers.map((paper) => (
            <div key={paper.id} className="card-premium p-6 group flex flex-col h-full">
              <div className="flex justify-between items-start mb-3 gap-2">
                <h3 className="text-lg font-bold text-text-primary line-clamp-2 group-hover:text-primary transition-colors flex-1">
                  {paper.title}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter ${
                  paper.status === 'approved' ? 'bg-green-100 text-green-700' : 
                  paper.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                  'bg-red-100 text-red-700'
                }`}>
                  {paper.status}
                </span>
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <Calendar size={14} /> {paper.date}
                </span>
                <span className="bg-primary-light text-primary text-[10px] font-bold px-2 py-0.5 rounded">
                  {paper.dept}
                </span>
              </div>

              <div className="bg-background rounded-lg p-4 flex items-center justify-around mb-6 mt-auto">
                <div className="text-center">
                  <Eye size={16} className="mx-auto text-green-500 mb-1" />
                  <span className="text-xs font-bold text-text-primary">{paper.views.toLocaleString()}</span>
                </div>
                <div className="text-center border-x border-border px-4">
                  <Download size={16} className="mx-auto text-purple-500 mb-1" />
                  <span className="text-xs font-bold text-text-primary">{paper.downloads.toLocaleString()}</span>
                </div>
                <div className="text-center">
                  <MessageSquare size={16} className="mx-auto text-orange-500 mb-1" />
                  <span className="text-xs font-bold text-text-primary">{paper.comments.toLocaleString()}</span>
                </div>
              </div>

              <Link href={`/papers/${paper.id}`} className="text-xs font-bold text-primary hover:underline underline-offset-4">
                View Paper Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
