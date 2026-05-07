"use client";

import { 
  Users, 
  FileText, 
  Clock, 
  Activity, 
  Eye, 
  CheckCircle2, 
  XCircle,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { AdminStatCard } from "@/components/admin/stat-card";
import { PaperReviewModal } from "@/components/admin/paper-review-modal";
import { clsx } from "clsx";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell
} from 'recharts';

const GROWTH_DATA = [
  { name: 'Jan', total: 4000, new: 2400 },
  { name: 'Feb', total: 5200, new: 1398 },
  { name: 'Mar', total: 6800, new: 3800 },
  { name: 'Apr', total: 8900, new: 3908 },
  { name: 'May', total: 11000, new: 4800 },
  { name: 'Jun', total: 12450, new: 3542 },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280'];

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaper, setSelectedPaper] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/dashboard");
      if (res.ok) {
        const data = await res.json();
        setData(data);
      }
    } catch (error) {
      console.error("[DASHBOARD_FETCH_ERROR]", error);
      setError("Failed to fetch dashboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
        await fetchData(); // Refresh data
      } else {
        const errData = await res.json();
        alert(errData.message || "Failed to moderate paper");
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-red-50 border border-red-100 rounded-3xl mx-auto max-w-2xl mt-12">
        <XCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-red-700 mb-2">Dashboard Error</h2>
        <p className="text-red-600 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { stats, recentPapers } = data;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Dashboard Overview</h1>
          <p className="text-text-secondary mt-1 text-sm font-medium">Platform status and performance metrics</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminStatCard label="Total Users" value={stats.totalUsers.toLocaleString()} trend="+12%" icon={Users} color="primary" />
        <AdminStatCard label="Total Papers" value={stats.totalPapers.toLocaleString()} trend="+8%" icon={FileText} color="success" />
        <AdminStatCard label="Pending Reviews" value={stats.pendingPapers.toLocaleString()} trend="-5%" icon={Clock} color="warning" />
        <AdminStatCard label="Active Today" value="3,542" trend="+18%" icon={Activity} color="purple" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 card-premium p-8">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-text-primary">User Growth Trend</h3>
            <p className="text-xs font-bold text-text-muted mt-1 uppercase tracking-widest">Total and new users over time</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={GROWTH_DATA}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                <Line type="monotone" dataKey="new" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 card-premium p-8">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-text-primary">Papers by Category</h3>
            <p className="text-xs font-bold text-text-muted mt-1 uppercase tracking-widest">Distribution across research fields</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryDistribution}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.categoryDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
            {stats.categoryDistribution.map((cat: any, index: number) => (
              <div key={cat.name} className="flex items-center justify-between text-[10px] font-bold">
                <div className="flex items-center gap-2 text-text-secondary">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  {cat.name}
                </div>
                <span className="text-text-primary">{cat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="card-premium overflow-hidden">
        <div className="p-6 bg-primary-light/30 border-b border-border flex justify-between items-center">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-text-primary">Recent Submissions</h3>
            <p className="text-xs font-bold text-text-muted mt-1 uppercase tracking-widest">Latest research activities</p>
          </div>
        </div>
        <div className="p-6 bg-gray-50/50 border-b border-border">
          <div className="grid grid-cols-6 w-full text-[11px] font-extrabold text-text-secondary uppercase tracking-widest px-4">
            <span>Author Name</span>
            <span>Category</span>
            <span>Title</span>
            <span>Keyword</span>
            <span>Status</span>
            <span className="text-right">Action</span>
          </div>
        </div>
        <div className="divide-y divide-border">
          {recentPapers.map((paper: any) => (
            <div key={paper.id} className="grid grid-cols-6 items-center p-6 px-10 hover:bg-background transition-colors">
              <span className="text-sm font-bold text-text-primary">{paper.author}</span>
              <span className="text-[10px] font-bold text-primary bg-primary-light px-2 py-1 rounded w-fit uppercase">
                {paper.category}
              </span>
              <span className="text-sm font-bold text-text-primary truncate pr-8">{paper.title}</span>
              <div className="flex gap-1">
                {paper.keywords.slice(0, 2).map((k: string) => (
                  <span key={k} className="text-[9px] font-bold text-text-muted bg-background border border-border px-1.5 py-0.5 rounded uppercase tracking-tighter">
                    {k}
                  </span>
                ))}
              </div>
              <span className={clsx(
                "text-[10px] font-bold px-2 py-1 rounded w-fit uppercase",
                paper.status === "pending" && "bg-yellow-100 text-yellow-700",
                paper.status === "approved" && "bg-green-100 text-green-700",
                paper.status === "rejected" && "bg-red-100 text-red-700",
                paper.status === "draft" && "bg-gray-100 text-gray-700"
              )}>
                {paper.status}
              </span>
              <div className="flex items-center justify-end gap-3">
                <button 
                  onClick={() => setSelectedPaper(paper)}
                  className="text-text-muted hover:text-primary transition-colors p-1.5 hover:bg-primary-light rounded-lg"
                >
                  <Eye size={18} />
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
