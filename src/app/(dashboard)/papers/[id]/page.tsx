import { Suspense } from "react";
import PaperClientView from "@/components/paper/PaperClientView";
import { getPaperDetails, getRelatedPapers, getComments } from "@/modules/paper/service";
import { notFound } from "next/navigation";

export default async function PaperDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    // In Next.js App router, we can fetch in parallel
    const [paper, relatedPapers, initialComments] = await Promise.all([
      getPaperDetails(id),
      getRelatedPapers(id),
      getComments(id)
    ]);

    if (!paper) {
      notFound();
    }

    return (
      <PaperClientView 
        paper={paper} 
        relatedPapers={relatedPapers} 
        initialComments={initialComments} 
      />
    );
  } catch (error) {
    console.error("Failed to load paper details:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Paper Not Found</h2>
        <p className="text-text-secondary max-w-md">
          We couldn't load the details for this paper. It might have been removed or the ID is incorrect.
        </p>
      </div>
    );
  }
}
