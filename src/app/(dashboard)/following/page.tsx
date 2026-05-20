import { Users, Calendar, TrendingUp, Search } from "lucide-react";
import { PaperCard } from "@/components/paper-card";
import { SuggestedResearchers } from "@/components/suggested-researchers";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getFollowingFeed, getFollowingStats, getSuggestedResearchers } from "@/modules/engagement/repository";
import Link from "next/link";

export default async function FollowingPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const [feedPapers, stats, suggestions] = await Promise.all([
    getFollowingFeed(user.sub),
    getFollowingStats(user.sub),
    getSuggestedResearchers(user.sub)
  ]);

  const formattedFeed = feedPapers.map(paper => ({
    id: paper.id,
    commentCount: paper.commentCount,
    reactionCount: paper.reactionCount,
    createdAt: paper.createdAt.toISOString(),
    category: paper.category,
    creator: { name: paper.creator.name },
    versions: paper.versions.map(v => ({
      title: v.title,
      abstract: v.abstract,
      keywords: v.keywords
    })),
    metrics: { 
      viewCount: paper.metrics?.viewCount || 0, 
      downloadCount: paper.metrics?.downloadCount || 0 
    }
  }));

  // Map suggestions to the format expected by SuggestedResearchers
  const formattedSuggestions = suggestions.map(s => ({
    id: s.id,
    name: s.name,
    avatarUrl: s.profileImageUrl || undefined,
    institution: s.university?.name || "Research Institution",
    thesisCount: s._count.papers,
    viewCount: s.viewCount || 0,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Feed */}
        <div className="lg:col-span-8">
          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card-premium p-6 flex justify-between items-center bg-white shadow-sm rounded-2xl border border-gray-100">
              <div>
                <p className="text-xs font-medium text-text-secondary uppercase mb-1">Total Following</p>
                <p className="text-3xl font-bold text-text-primary">{stats.totalFollowing}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                <Users size={24} />
              </div>
            </div>
            <div className="card-premium p-6 flex justify-between items-center bg-white shadow-sm rounded-2xl border border-gray-100">
              <div>
                <p className="text-xs font-medium text-text-secondary uppercase mb-1">Network Papers</p>
                <p className="text-3xl font-bold text-text-primary">{stats.newThesis.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl text-green-600">
                <TrendingUp size={24} />
              </div>
            </div>
            <div className="card-premium p-6 flex justify-between items-center bg-white shadow-sm rounded-2xl border border-gray-100">
              <div>
                <p className="text-xs font-medium text-text-secondary uppercase mb-1">New This Week</p>
                <p className="text-3xl font-bold text-text-primary">{stats.thisWeek}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
                <Calendar size={24} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-primary">Research from Following</h2>
            <Link href="/search" className="text-sm font-semibold text-primary hover:underline">See All</Link>
          </div>

          {formattedFeed.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formattedFeed.map((paper) => (
                <PaperCard key={paper.id} paper={paper as any} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm text-center px-6">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Search className="text-gray-300" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Your feed is empty</h3>
              <p className="text-gray-500 max-w-sm mt-2">
                Follow researchers in your field to see their latest work here.
              </p>
              <Link 
                href="/search" 
                className="mt-6 inline-flex items-center justify-center px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
              >
                Discover Researchers
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <SuggestedResearchers researchers={formattedSuggestions} />
        </div>
      </div>
    </div>
  );
}
