import { Upload, BarChart3, Eye, Download, MessageSquare, TrendingUp, Calendar } from "lucide-react";
import Link from "next/link";

const MY_PAPERS = [
  { id: "1", title: "Deep Learning Applications in Natural Language Processing", date: "Jan 15, 2024", views: 1245, downloads: 342, comments: 2, dept: "Computer Science" },
  { id: "2", title: "Deep Learning Applications in Natural Language Processing", date: "Jan 15, 2024", views: 1245, downloads: 342, comments: 2, dept: "Computer Science" },
  { id: "3", title: "Deep Learning Applications in Natural Language Processing", date: "Jan 15, 2024", views: 1245, downloads: 342, comments: 2, dept: "Computer Science" },
  { id: "4", title: "Deep Learning Applications in Natural Language Processing", date: "Jan 15, 2024", views: 1245, downloads: 342, comments: 2, dept: "Computer Science" },
  { id: "5", title: "Deep Learning Applications in Natural Language Processing", date: "Jan 15, 2024", views: 1245, downloads: 342, comments: 2, dept: "Computer Science" },
  { id: "6", title: "Deep Learning Applications in Natural Language Processing", date: "Jan 15, 2024", views: 1245, downloads: 342, comments: 2, dept: "Computer Science" },
];

export default function MyUploadsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card-premium p-6 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Total Thesis</p>
            <p className="text-3xl font-bold text-text-primary">3</p>
          </div>
          <div className="bg-primary-light p-3 rounded-xl text-primary">
            <BarChart3 size={24} />
          </div>
        </div>
        <div className="card-premium p-6 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Total Views</p>
            <p className="text-3xl font-bold text-text-primary">2,988</p>
          </div>
          <div className="bg-green-50 p-3 rounded-xl text-green-600">
            <Eye size={24} />
          </div>
        </div>
        <div className="card-premium p-6 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Downloads</p>
            <p className="text-3xl font-bold text-text-primary">765</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
            <Download size={24} />
          </div>
        </div>
        <div className="card-premium p-6 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Comments</p>
            <p className="text-3xl font-bold text-text-primary">3</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MY_PAPERS.map((paper, idx) => (
          <div key={idx} className="card-premium p-6 group">
            <h3 className="text-lg font-bold text-text-primary mb-3 line-clamp-2 group-hover:text-primary transition-colors">
              {paper.title}
            </h3>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs text-text-muted flex items-center gap-1">
                <Calendar size={14} /> {paper.date}
              </span>
              <span className="bg-primary-light text-primary text-[10px] font-bold px-2 py-0.5 rounded">
                {paper.dept}
              </span>
            </div>

            <div className="bg-background rounded-lg p-4 flex items-center justify-around mb-6">
              <div className="text-center">
                <Eye size={16} className="mx-auto text-green-500 mb-1" />
                <span className="text-xs font-bold text-text-primary">{paper.views.toLocaleString()}</span>
              </div>
              <div className="text-center border-x border-border px-4">
                <Download size={16} className="mx-auto text-purple-500 mb-1" />
                <span className="text-xs font-bold text-text-primary">{paper.downloads}</span>
              </div>
              <div className="text-center">
                <MessageSquare size={16} className="mx-auto text-orange-500 mb-1" />
                <span className="text-xs font-bold text-text-primary">{paper.comments}</span>
              </div>
            </div>

            <Link href={`/papers/${paper.id}/comments`} className="text-xs font-bold text-primary hover:underline underline-offset-4">
              View Comments & Reviews ({paper.comments})
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
