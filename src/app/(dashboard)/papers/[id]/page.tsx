import { getPaperById, getRelatedPapers } from "@/modules/paper/repository";
import PaperClientView from "@/components/paper/PaperClientView";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function PaperDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // Basic UUID validation to prevent Prisma errors
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  // if (!uuidRegex.test(id) && id !== "1") { // Allowing "1" for potential demo/legacy IDs
  //   // But if it's not a UUID and not 1, it's definitely not found
  //   // Actually, let's just let getPaperById handle it if it's a string, 
  //   // but Prisma will throw if it expects UUID format.
  // }
  if (!uuidRegex.test(id)) {
    notFound();
  }

  try {
    // 1. Fetch Paper Details from DB
    console.log(`[DEBUG] Fetching paper with ID: "${id}"`);
    const paperData = await getPaperById(id);
    console.log(`[DEBUG] Paper data found: ${!!paperData}`);

    if (!paperData) {
      return (
        <div className="p-10">
          <h1 className="text-2xl font-bold">Paper not found</h1>
        </div>
      );
    }

    // 2. Fetch Related Papers
    const relatedData = await getRelatedPapers(id, paperData.categoryId);

    // 3. Fetch real comments and interaction states
    const { getPaperComments, getUserInteractions, getIsFollowing } = await import("@/modules/engagement/repository");
    const { getSessionUser } = await import("@/lib/auth");
    
    const user = await getSessionUser();
    
    const [dbComments, interactions] = await Promise.all([
      getPaperComments(id),
      user ? getUserInteractions(user.sub, id) : { isLiked: false, isSaved: false }
    ]);

    const isFollowing = user ? await getIsFollowing(user.sub, paperData.createdBy) : false;

    // 4. Format comments for the client
    const initialComments = dbComments.map(c => ({
      id: c.id,
      user: {
        id: c.user?.id || "guest",
        name: c.user?.name || "Guest",
      },
      content: c.content,
      createdAt: c.createdAt.toISOString(),
    }));

    // 4. Format data for the client component
    const latestVersion = paperData.versions[0];
    const formattedPaper = {
      id: paperData.id,
      title: latestVersion?.title || "Untitled Paper",
      abstract: latestVersion?.abstract || "No abstract available.",
      authors: [
        {
          id: paperData.creator.id,
          name: paperData.creator.name,
          institution: "OpenScholar University", // Could be fetched from author profile if available
          bio: (paperData.creator as any).author?.bio || "Research professional at OpenScholar.",
          followers: 0,
          likes: 0,
        }
      ],
      publishedAt: paperData.createdAt.toISOString(),
      tags: latestVersion?.keywords || [],
      metrics: {
        views: paperData.metrics?.viewCount || 0,
        downloads: paperData.metrics?.downloadCount || 0,
        likes: paperData.reactionCount || 0,
        comments: paperData.commentCount || 0,
      },
      fullText: latestVersion?.abstract || undefined,
      pdfUrl: latestVersion?.pdfUrl || "#",
    };

    const formattedRelated = relatedData.map(rp => ({
      id: rp.id,
      title: rp.versions[0]?.title || "Untitled Paper",
      abstract: rp.versions[0]?.abstract || "No abstract available.",
      authors: [{ name: rp.creator.name }],
      publishedAt: rp.createdAt.toISOString(),
      tags: rp.versions[0]?.keywords || [],
      metrics: {
        views: rp.metrics?.viewCount || 0,
        downloads: rp.metrics?.downloadCount || 0,
        likes: rp.reactionCount || 0,
        comments: rp.commentCount || 0,
      },
      pdfUrl: rp.versions[0]?.pdfUrl || "#",
    }));

    return (
      <PaperClientView 
        paper={formattedPaper as any} 
        relatedPapers={formattedRelated as any} 
        initialComments={initialComments as any} 
        initialInteractions={interactions}
        initialIsFollowing={isFollowing}
      />
    );
  } catch (error) {
    console.error("Failed to load paper details:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Paper Not Found</h2>
        <p className="text-text-secondary max-w-md mb-8">
          We couldn't load the details for this paper. It might have been removed or the ID is incorrect.
        </p>
        <Link href="/search">
          <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-dark transition-all">
            Return to Discovery
          </button>
        </Link>
      </div>
    );
  }
}
