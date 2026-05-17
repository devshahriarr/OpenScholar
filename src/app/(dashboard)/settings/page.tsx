"use client";

import { useState, useEffect } from "react";
import { Mail, MapPin, GraduationCap, Info, Save, X, Eye, Download, Users, FileText, Award, BookCopy } from "lucide-react";
import { ProfileHeader, StatCard, PasswordSection } from "@/modules/user/components/profile-ui";
import { Spinner } from "@/components/ui/Loader";

export default function SettingsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          setUser({
            ...data,
            interests: ["Research", "Academic Publishing"]
          });
          setFormData({
            name: data.name || "",
            bio: data.bio || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch user settings", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/users/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to update settings");
      }

      setUser((prev: any) => ({ ...prev, ...formData }));
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-text-primary">User not found</h2>
        <p className="text-text-secondary mt-2">Failed to load user settings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <ProfileHeader user={user} isEditing={isEditing} onEdit={() => setIsEditing(true)} />

      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard icon={BookCopy} label="Thesis" value={user.stats?.papers || 0} iconColor="text-blue-500" bgColor="bg-blue-50/50" />
          <StatCard icon={Award} label="Total Views" value={user.stats?.views || 0} iconColor="text-amber-500" bgColor="bg-amber-50/50" />
          <StatCard icon={Download} label="Downloads" value={user.stats?.downloads || 0} iconColor="text-purple-500" bgColor="bg-purple-50/50" />
          <StatCard icon={Users} label="Followers" value={user.stats?.followers || 0} iconColor="text-green-500" bgColor="bg-green-50/50" />
          <StatCard icon={Users} label="Following" value={user.stats?.following || 0} iconColor="text-indigo-500" bgColor="bg-indigo-50/50" />
        </div>

        {/* Content Card */}
        <div className="card-premium p-8">
          <div className="space-y-8">
            
            {error && (
              <div className="text-red-500 bg-red-50 p-3 rounded-md text-sm mb-4 border border-red-200">
                {error}
              </div>
            )}

            {/* Editable Name Field */}
            <div className="flex items-center gap-5 pb-2 border-b border-border/50">
              <FileText className="text-text-muted" size={20} />
              <input 
                type="text" 
                value={isEditing ? formData.name : user.name} 
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                readOnly={!isEditing}
                className="bg-transparent w-full text-text-primary focus:outline-none font-medium placeholder:text-text-muted"
                placeholder="Full Name"
              />
            </div>

            {/* Read-Only Info Fields */}
            <div className="flex items-center gap-5 pb-2 border-b border-border/50">
              <MapPin className="text-text-muted" size={20} />
              <div className="w-full text-text-primary font-medium">
                {user.university || "University not specified"}
              </div>
            </div>

            {/* Bio */}
            <div className="flex items-start gap-5">
              <Info className="text-text-muted mt-1" size={20} />
              <div className="w-full">
                <textarea 
                  value={isEditing ? formData.bio : user.bio || ""} 
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  readOnly={!isEditing}
                  rows={4}
                  className={`bg-transparent w-full text-text-primary focus:outline-none font-medium resize-none leading-relaxed text-sm ${isEditing ? 'border border-primary/20 rounded-md p-2' : ''}`}
                  placeholder="Tell us about your research..."
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-12 flex items-center gap-4">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50"
              >
                {isSaving ? <Spinner size="sm" className="text-white" /> : <Save size={18} />}
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ name: user.name, bio: user.bio || "" }); // Reset to original
                }}
                disabled={isSaving}
                className="bg-gray-100 text-text-secondary px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Password Section */}
        {!isEditing && <PasswordSection />}
      </div>
    </div>
  );
}
