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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const { verifyToken } = await import("@/lib/auth");
    const authHeader = request.headers.get("Authorization");
    let token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    if (!token) {
      const cookieHeader = request.headers.get("Cookie") || "";
      const match = cookieHeader.match(/auth_token=([^;]+)/);
      if (match) token = match[1];
    }

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const { title, abstract, keywords, categoryId } = body;

    const { updatePaperDraft } = await import("@/modules/paper/repository");
    
    await updatePaperDraft(id, user.sub, {
      title,
      abstract,
      keywords,
      categoryId: categoryId ? parseInt(categoryId, 10) : undefined
    });

    return NextResponse.json({ message: "Paper updated successfully" });
  } catch (error: any) {
    console.error("[UPDATE_PAPER_DRAFT_ERROR]", error);
    return NextResponse.json(
      { message: error?.message || "Internal server error" },
      { status: error?.message?.includes("Only draft") ? 400 : 500 }
    );
  }
}
