"use client";

import { UserPlus, Loader2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface Researcher {
  id: string;
  name: string;
  avatarUrl?: string;
  institution: string;
  thesisCount: number;
  viewCount: number;
}

export function SuggestedResearchers({ researchers = [] }: { researchers?: Researcher[] }) {
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleFollow = async (id: string) => {
    setLoadingId(id);
    try {
      const res = await fetch("/api/engagement/follow", {
        method: "POST",
        body: JSON.stringify({ targetUserId: id }),
      });
      if (res.ok) {
        setFollowingIds(prev => [...prev, id]);
      } else {
        const error = await res.json();
        alert(error.message || "Failed to follow");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-2xl border border-gray-100 p-6 min-h-[300px]">
      <div className="flex items-center gap-2 mb-6">
        <UserPlus className="text-primary" size={20} />
        <h2 className="text-lg font-bold text-text-primary">Suggested Researchers</h2>
      </div>
      
      <p className="text-xs text-text-secondary mb-6">Discover researchers in your field</p>

      {!researchers || researchers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-xs text-gray-400">No new suggestions at the moment.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {researchers.map((person) => {
            const isFollowing = followingIds.includes(person.id);
            const isLoading = loadingId === person.id;

            return (
              <div key={person.id} className="group">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <Link href={`/users/${person.id}`} className="flex items-center gap-3">
                    {person.avatarUrl ? (
                      <img src={person.avatarUrl} alt={person.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                        {person.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors cursor-pointer">
                        {person.name}
                      </h3>
                      <p className="text-[10px] text-text-secondary leading-none mt-1">{person.institution}</p>
                    </div>
                  </Link>
                </div>
                
                <div className="flex items-center justify-between text-[10px] font-medium text-text-secondary px-1">
                  <span>{person.thesisCount} thesis</span>
                  <span>{person.viewCount.toLocaleString()} views</span>
                </div>

                <button 
                  onClick={() => !isFollowing && handleFollow(person.id)}
                  disabled={isLoading || isFollowing}
                  className={`w-full mt-3 text-xs font-bold py-2 rounded-lg transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 ${
                    isFollowing 
                      ? "bg-gray-100 text-gray-500 cursor-default" 
                      : "bg-primary text-white hover:bg-primary-dark"
                  }`}
                >
                  {isLoading && <Loader2 size={14} className="animate-spin" />}
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <Link href="/search" className="block w-full">
        <button className="w-full mt-8 py-2.5 border border-gray-100 rounded-xl text-xs font-bold text-text-secondary hover:bg-gray-50 transition-colors">
          View More
        </button>
      </Link>
    </div>
  );
}
