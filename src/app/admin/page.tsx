"use client";

import { 
  Users, 
  FileText, 
  Clock, 
  Activity, 
  Eye, 
  CheckCircle2, 
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { AdminStatCard } from "@/components/admin/stat-card";
import { PaperReviewModal } from "@/components/admin/paper-review-modal";
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

const CATEGORY_DATA = [
  { name: 'Computer Science', value: 27, color: '#3B82F6' },
  { name: 'Environmental Science', value: 22, color: '#10B981' },
  { name: 'Biology', value: 17, color: '#F59E0B' },
  { name: 'Chemistry', value: 14, color: '#8B5CF6' },
  { name: 'Mathematics', value: 13, color: '#EC4899' },
  { name: 'Others', value: 10, color: '#6B7280' },
];

const PENDING_PAPERS = [
  { id: "1", author: "Robert Chan", category: "Computer Science", title: "Machine learning for finance", keywords: ["AI", "Deep Learning", "NLP"], status: "pending", abstract: "This paper explores the application of quantum computing principles to enhance machine learning models for financial market prediction." },
  { id: "2", author: "Robert Chan", category: "Environmental Science", title: "Deep learning applications", keywords: ["AI", "Deep Learning", "NLP"], status: "pending", abstract: "Recent advancements in deep learning have opened new avenues for natural disaster prediction and mitigation." },
  { id: "3", author: "Robert Chan", category: "Computer Science", title: "Machine learning for finance", keywords: ["AI", "Deep Learning", "NLP"], status: "pending", abstract: "The financial sector is undergoing a massive transformation driven by machine learning algorithms." },
  { id: "4", author: "Robert Chan", category: "Environmental Science", title: "Deep learning applications", keywords: ["AI", "Deep Learning", "NLP"], status: "pending", abstract: "This study evaluates the efficacy of convolutional neural networks in processing satellite imagery." },
];

export default function AdminDashboard() {
  const [selectedPaper, setSelectedPaper] = useState<any>(null);
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
        <AdminStatCard label="Total Users" value="12,450" trend="+12%" icon={Users} color="primary" />
        <AdminStatCard label="Total Papers" value="45,280" trend="+8%" icon={FileText} color="success" />
        <AdminStatCard label="Pending Reviews" value="127" trend="-5%" icon={Clock} color="warning" />
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
          <div className="flex justify-center gap-6 mt-6">
             <div className="flex items-center gap-2 text-xs font-bold text-text-secondary">
               <div className="w-3 h-3 rounded-full bg-primary"></div> Total Users
             </div>
             <div className="flex items-center gap-2 text-xs font-bold text-text-secondary">
               <div className="w-3 h-3 rounded-full bg-green-500"></div> New Users
             </div>
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
                  data={CATEGORY_DATA}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
            {CATEGORY_DATA.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-[10px] font-bold">
                <div className="flex items-center gap-2 text-text-secondary">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                  {cat.name}
                </div>
                <span className="text-text-primary">{cat.value}%</span>
              </div>
            ))}
          </div>
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
              <span className="text-[10px] font-bold text-primary bg-primary-light px-2 py-1 rounded w-fit uppercase">
                {paper.category}
              </span>
              <span className="text-sm font-bold text-text-primary truncate pr-8">{paper.title}</span>
              <div className="flex gap-1">
                {paper.keywords.slice(0, 2).map((k) => (
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
      <PaperReviewModal 
        paper={selectedPaper} 
        onClose={() => setSelectedPaper(null)} 
        onApprove={(id) => console.log("Approve", id)}
        onReject={(id) => console.log("Reject", id)}
      />
    </div>
  );
}
