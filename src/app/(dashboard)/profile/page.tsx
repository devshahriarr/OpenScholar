"use client";

import { useState } from "react";
import { Mail, MapPin, GraduationCap, Info, Save, X, Eye, Download, Users, FileText, Award, BookCopy } from "lucide-react";
import { ProfileHeader, StatCard, PasswordSection } from "@/modules/user/components/profile-ui";

const MOCK_USER = {
  name: "John Doe",
  email: "mdrifathossan656@gmail.com",
  department: { name: "Computer Science" },
  university: { name: "Tech University" },
  bio: "Dr. Jane Smith is a leading researcher in the application of machine learning to climate science. Her work focuses on developing novel AI algorithms for climate prediction and environmental monitoring. She has published over 40 papers in top-tier journals and conferences.",
  interests: ["Machine Learning", "Climate Science", "Environmental AI", "Data Science", "Neural Networks"],
  stats: {
    thesis: 0,
    views: 0,
    downloads: 0,
    followers: 488,
    following: 196
  }
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(MOCK_USER);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <ProfileHeader user={user} isEditing={isEditing} onEdit={() => setIsEditing(true)} />

      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard icon={BookCopy} label="Thesis" value={user.stats.thesis} iconColor="text-blue-500" bgColor="bg-blue-50/50" />
          <StatCard icon={Award} label="Total Views" value={user.stats.views} iconColor="text-amber-500" bgColor="bg-amber-50/50" />
          <StatCard icon={Download} label="Downloads" value={user.stats.downloads} iconColor="text-purple-500" bgColor="bg-purple-50/50" />
          <StatCard icon={Users} label="Followers" value={user.stats.followers} iconColor="text-green-500" bgColor="bg-green-50/50" />
          <StatCard icon={Users} label="Following" value={user.stats.following} iconColor="text-indigo-500" bgColor="bg-indigo-50/50" />
        </div>

        {/* Content Card */}
        <div className="card-premium p-8">
          <div className="space-y-8">
            {/* Info Fields */}
            <div className="flex items-center gap-5 pb-2 border-b border-border/50">
              <Mail className="text-text-muted" size={20} />
              <input 
                type="email" 
                value={user.email} 
                readOnly={!isEditing}
                className="bg-transparent w-full text-text-primary focus:outline-none font-medium placeholder:text-text-muted"
                placeholder="Email Address"
              />
            </div>

            <div className="flex items-center gap-5 pb-2 border-b border-border/50">
              <MapPin className="text-text-muted" size={20} />
              <input 
                type="text" 
                value={user.university.name} 
                readOnly={!isEditing}
                className="bg-transparent w-full text-text-primary focus:outline-none font-medium placeholder:text-text-muted"
                placeholder="University"
              />
            </div>

            {/* Research Interests */}
            <div>
              <div className="flex items-center gap-5 mb-4">
                <GraduationCap className="text-text-muted" size={20} />
                <span className="text-sm font-bold text-text-secondary uppercase tracking-tight">Research Interests</span>
              </div>
              
              <div className="flex flex-wrap gap-2 pl-10">
                {user.interests.map((interest) => (
                  <span 
                    key={interest} 
                    className="bg-primary-light text-primary px-4 py-1.5 rounded-full text-xs font-bold border border-primary/10 hover:bg-primary hover:text-white transition-all cursor-default"
                  >
                    {interest}
                  </span>
                ))}
                {isEditing && (
                  <button className="px-4 py-1.5 rounded-full text-xs font-bold border border-dashed border-primary text-primary hover:bg-primary-light transition-all">
                    + Add More
                  </button>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="flex items-start gap-5">
              <Info className="text-text-muted mt-1" size={20} />
              <div className="w-full">
                <textarea 
                  value={user.bio} 
                  readOnly={!isEditing}
                  rows={4}
                  className="bg-transparent w-full text-text-primary focus:outline-none font-medium resize-none leading-relaxed text-sm"
                  placeholder="Tell us about your research..."
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-12 flex items-center gap-4">
              <button 
                onClick={() => setIsEditing(false)}
                className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                <Save size={18} />
                Save Changes
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="bg-gray-100 text-text-secondary px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-all active:scale-95"
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
