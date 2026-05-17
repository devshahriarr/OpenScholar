"use client";

import { useEffect, useState, use } from "react";
import { Mail, MapPin, GraduationCap, Info, BookCopy, Award, Download, Users } from "lucide-react";
import { ProfileHeader, StatCard } from "@/modules/user/components/profile-ui";
import { Spinner } from "@/components/ui/Loader";

export default function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/users/${id}`);
        if (res.ok) {
          const data = await res.json();
          setUser({
            ...data,
            interests: ["Research", "Academic Publishing"] // Placeholder until tag system supports user interests
          });
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, [id]);

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
        <p className="text-text-secondary mt-2">The profile you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <ProfileHeader user={user} isEditing={false} />

      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard icon={BookCopy} label="Thesis/Papers" value={user.stats?.papers || 0} iconColor="text-blue-500" bgColor="bg-blue-50/50" />
          <StatCard icon={Award} label="Total Views" value={user.stats?.views || 0} iconColor="text-amber-500" bgColor="bg-amber-50/50" />
          <StatCard icon={Download} label="Downloads" value={user.stats?.downloads || 0} iconColor="text-purple-500" bgColor="bg-purple-50/50" />
          <StatCard icon={Users} label="Followers" value={user.stats?.followers || 0} iconColor="text-green-500" bgColor="bg-green-50/50" />
          <StatCard icon={Users} label="Following" value={user.stats?.following || 0} iconColor="text-indigo-500" bgColor="bg-indigo-50/50" />
        </div>

        <div className="card-premium p-8">
          <div className="space-y-8">
            <div className="flex items-center gap-5 pb-2 border-b border-border/50">
              <MapPin className="text-text-muted" size={20} />
              <div className="w-full text-text-primary font-medium">
                {user.university || "No university specified"}
              </div>
            </div>

            <div className="flex items-center gap-5 pb-2 border-b border-border/50">
              <GraduationCap className="text-text-muted" size={20} />
              <div className="w-full text-text-primary font-medium">
                {user.department || "No department specified"}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-5 mb-4">
                <Info className="text-text-muted mt-1" size={20} />
                <span className="text-sm font-bold text-text-secondary uppercase tracking-tight">Biography</span>
              </div>
              <div className="pl-10 text-text-primary text-sm leading-relaxed">
                {user.bio || "This user hasn't written a biography yet."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
