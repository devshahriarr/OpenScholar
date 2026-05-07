import { Bookmark } from "lucide-react";
import { PaperCard } from "@/components/paper-card";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSavedPapers } from "@/modules/engagement/repository";

export default async function SavedPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/auth/login");
  }

  const savedPapers = await getSavedPapers(user.sub);

  const formattedPapers = savedPapers.map(paper => ({
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
      viewCount: paper.metrics?.views || 0, 
      downloadCount: paper.metrics?.downloads || 0 
    }
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary-light text-primary rounded-lg">
          <Bookmark size={24} fill="currentColor" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Saved Thesis</h1>
      </div>
      <p className="text-text-secondary text-sm mb-8">Your bookmarked research papers ({formattedPapers.length})</p>

      {formattedPapers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {formattedPapers.map((paper) => (
            <PaperCard key={paper.id} paper={paper as any} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <Bookmark size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">You haven&apos;t saved any papers yet.</p>
          <p className="text-gray-400 text-sm mt-1">Start exploring and save your favorite research!</p>
        </div>
      )}
    </div>
  );
}
