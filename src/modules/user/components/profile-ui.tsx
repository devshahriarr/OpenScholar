"use client";

import { Eye, Download, Users, FileText, Camera, ChevronDown, ChevronUp, Lock } from "lucide-react";
import { useState } from "react";
import { Spinner } from "@/components/ui/Loader";

export function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  iconColor = "text-primary",
  bgColor = "bg-primary-light"
}: { 
  icon: any, 
  label: string, 
  value: string | number,
  iconColor?: string,
  bgColor?: string
}) {
  return (
    <div className={`card-premium p-4 flex flex-col items-center justify-center text-center gap-1 group ${bgColor}`}>
      <div className={`${iconColor} transition-transform group-hover:scale-110`}>
        <Icon size={22} />
      </div>
      <span className="text-2xl font-bold text-text-primary mt-1">{value}</span>
      <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest">{label}</span>
    </div>
  );
}

export function ProfileHeader({ user, isEditing, onEdit }: { user: any, isEditing: boolean, onEdit?: () => void }) {
  return (
    <div className="bg-surface rounded-2xl shadow-premium overflow-hidden mb-8 border border-border">
      {/* Banner */}
      <div className="h-48 md:h-56 w-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
      
      <div className="px-8 pb-8">
        <div className="relative flex flex-col md:flex-row md:items-end justify-between -mt-16 gap-6">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            {/* Avatar */}
            <div className="relative group">
              {user.avatarUrl || user.profileImageUrl ? (
                <img
                  src={user.avatarUrl || user.profileImageUrl}
                  alt={user.name}
                  className="w-36 h-36 rounded-full object-cover bg-surface border-[6px] border-surface shadow-lg"
                />
              ) : (
                <div className="w-36 h-36 rounded-full bg-surface border-[6px] border-surface shadow-lg flex items-center justify-center text-5xl font-bold text-primary uppercase">
                  {user.name?.[0] || "?"}
                </div>
              )}
              {onEdit && (
                <button 
                  onClick={async () => {
                    const url = window.prompt("Enter new avatar image URL:", user.avatarUrl || user.profileImageUrl || "");
                    if (url === null) return; // Cancelled
                    
                    try {
                      const res = await fetch("/api/users/settings", {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ profileImageUrl: url }),
                      });
                      if (res.ok) {
                        window.location.reload();
                      } else {
                        alert("Failed to update avatar.");
                      }
                    } catch (err) {
                      console.error(err);
                      alert("An error occurred while updating avatar.");
                    }
                  }}
                  className="absolute bottom-2 right-2 p-2.5 bg-primary text-white rounded-full shadow-md border-2 border-surface hover:bg-primary-hover transition-all hover:scale-110 active:scale-95"
                  title="Update profile picture"
                >
                  <Camera size={18} />
                </button>
              )}
            </div>
            
            {/* Name and Info */}
            <div className="mb-2">
              <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">{user.name}</h1>
              <div className="w-full h-1 bg-primary/20 mt-1 mb-2 rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-primary"></div>
              </div>
              <p className="text-text-secondary font-semibold text-sm">{user.department?.name || user.department || "No Department"}</p>
            </div>
          </div>

          {!isEditing && onEdit && (
            <button 
              onClick={onEdit}
              className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md mb-2 active:scale-95"
            >
              <FileText size={18} />
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function PasswordSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/users/settings/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setIsOpen(false), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-premium mt-8 overflow-hidden transition-all duration-300">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-6 flex items-center justify-between cursor-pointer hover:bg-background/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Lock className="text-text-muted" size={20} />
          <h3 className="text-lg font-bold text-text-primary">Change Password</h3>
        </div>
        {isOpen ? <ChevronUp size={20} className="text-text-secondary" /> : <ChevronDown size={20} className="text-text-secondary" />}
      </div>

      {isOpen && (
        <div className="p-6 pt-0 border-t border-border/50 bg-background/30">
          <form onSubmit={handleSubmit} className="space-y-4 mt-6 max-w-md">
            
            {error && (
              <div className="text-sm text-error bg-error/10 p-3 rounded-md border border-error/20">
                {error}
              </div>
            )}
            
            {success && (
              <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md border border-green-200">
                Password updated successfully!
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="mt-4 bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary-hover transition-all active:scale-95 disabled:opacity-50 w-full"
            >
              {isLoading ? <Spinner size="sm" className="text-white" /> : null}
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
