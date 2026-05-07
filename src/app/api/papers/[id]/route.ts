import { NextResponse } from "next/server";
import { getPaperById } from "@/modules/paper/repository";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const paper = await getPaperById(id);

    if (!paper) {
      return NextResponse.json({ message: "Paper not found" }, { status: 404 });
    }

    const latestVersion = paper.versions[0];
    
    // Format to match PaperDetails interface
    const formattedPaper = {
      id: paper.id,
      title: latestVersion?.title || "Untitled",
      abstract: latestVersion?.abstract || "",
      authors: [
        {
          id: paper.creator.id,
          name: paper.creator.name,
          institution: "OpenScholar University",
          bio: (paper.creator as any).author?.bio || "",
          followers: 0,
          likes: 0,
          avatarUrl: undefined,
        }
      ],
      publishedAt: paper.createdAt.toISOString(),
      tags: latestVersion?.keywords || [],
      metrics: {
        views: paper.metrics?.views || 0,
        downloads: paper.metrics?.downloads || 0,
        likes: paper.reactionCount || 0,
        comments: paper.commentCount || 0
      },
      pdfUrl: latestVersion?.pdfUrl || "#",
    };

    return NextResponse.json(formattedPaper);
  } catch (error) {
    console.error("[GET_PAPER_BY_ID]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
