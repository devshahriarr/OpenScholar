"use client";

import { useState } from "react";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Search, 
  Filter,
  Eye,
  Slash,
  MoreVertical,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Building2,
  Calendar,
  FileText
} from "lucide-react";
import { AdminStatCard } from "@/components/admin/stat-card";
import { clsx } from "clsx";

const MOCK_USERS = [
  { id: "1", name: "Dr. Sarah Johnson", email: "sarah.j@stanford.edu", role: "Professor", university: "Stanford University", status: "Active", joined: "2023-01-15", papers: 24 },
  { id: "2", name: "Prof. Michael Lee", email: "m.lee@harvard.edu", role: "Researcher", university: "Oxford University", status: "Suspended", joined: "2023-03-22", papers: 18 },
  { id: "3", name: "Dr. Sarah Johnson", email: "sarah.j@stanford.edu", role: "Professor", university: "Stanford University", status: "Active", joined: "2023-01-15", papers: 24 },
  { id: "4", name: "Prof. Michael Lee", email: "m.lee@harvard.edu", role: "Student", university: "Oxford University", status: "Suspended", joined: "2023-03-22", papers: 12 },
];

export default function UserManagementPage() {
  const [selectedUser, setSelectedUser] = useState<any>(null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">User Management</h1>
        <p className="text-text-secondary mt-1 text-sm font-medium">Manage platform users and permissions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminStatCard label="Total User" value="5" trend="+2" icon={Users} color="primary" />
        <AdminStatCard label="Active User" value="7" trend="+5" icon={UserCheck} color="success" />
        <AdminStatCard label="Suspended User" value="1" trend="+1" icon={UserX} color="warning" />
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

      {/* Users Table */}
      <div className="card-premium overflow-hidden">
        <div className="p-6 bg-primary-light/30 border-b border-border">
          <div className="grid grid-cols-5 w-full text-[11px] font-extrabold text-text-secondary uppercase tracking-widest px-4">
            <span>User Name</span>
            <span>Role</span>
            <span>University</span>
            <span>Status</span>
            <span className="text-right">Action</span>
          </div>
        </div>
        <div className="divide-y divide-border">
          {MOCK_USERS.map((user) => (
            <div key={user.id} className="grid grid-cols-5 items-center p-6 px-10 hover:bg-background transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">{user.name}</p>
                  <p className="text-[11px] text-text-muted font-medium">{user.email}</p>
                </div>
              </div>
              <div>
                <span className={clsx(
                  "text-[10px] font-bold px-3 py-1 rounded-full uppercase",
                  user.role === "Professor" ? "bg-blue-100 text-blue-600" :
                  user.role === "Researcher" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                )}>
                  {user.role}
                </span>
              </div>
              <span className="text-sm font-bold text-text-secondary">{user.university}</span>
              <div>
                <span className={clsx(
                  "text-[10px] font-bold px-3 py-1 rounded-full",
                  user.status === "Active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                )}>
                  {user.status}
                </span>
              </div>
              <div className="flex items-center justify-end gap-3">
                <button 
                  onClick={() => setSelectedUser(user)}
                  className="text-text-muted hover:text-primary transition-colors p-1.5 hover:bg-primary-light rounded-lg"
                >
                  <Eye size={18} />
                </button>
                <button className={clsx(
                  "text-text-muted transition-colors p-1.5 rounded-lg",
                  user.status === "Active" ? "hover:text-red-600 hover:bg-red-50" : "hover:text-green-600 hover:bg-green-50"
                )}>
                  {user.status === "Active" ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 relative">
              <button 
                onClick={() => setSelectedUser(null)}
                className="absolute top-6 right-6 p-2 text-text-muted hover:bg-background rounded-full transition-all"
              >
                <XCircle size={24} />
              </button>

              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg">
                  {selectedUser.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-text-primary tracking-tight">{selectedUser.name}</h3>
                  <p className="text-text-secondary font-medium">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 py-8 border-y border-border">
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Role</p>
                    <span className="bg-blue-100 text-blue-600 text-[11px] font-extrabold px-4 py-1.5 rounded-full uppercase">
                      {selectedUser.role}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">University</p>
                    <p className="text-sm font-bold text-text-primary flex items-center gap-2">
                      <Building2 size={16} className="text-text-muted" />
                      {selectedUser.university}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Joined</p>
                    <p className="text-sm font-bold text-text-primary flex items-center gap-2">
                      <Calendar size={16} className="text-text-muted" />
                      {selectedUser.joined}
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Status</p>
                    <span className="bg-green-100 text-green-600 text-[11px] font-extrabold px-4 py-1.5 rounded-full uppercase">
                      {selectedUser.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Papers Published</p>
                    <p className="text-sm font-bold text-text-primary flex items-center gap-2">
                      <FileText size={16} className="text-text-muted" />
                      {selectedUser.papers}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-95">
                  Update Permissions
                </button>
                <button className="px-6 bg-red-50 text-red-600 rounded-xl font-bold border border-red-100 hover:bg-red-100 transition-all">
                  Block User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
