import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getPapersByUserId } from "@/modules/paper/repository";

export async function GET(req: Request) {
  try {
    // 1. Authenticate User
    const cookieHeader = req.headers.get("Cookie") || "";
    const match = cookieHeader.match(/auth_token=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // 2. Fetch User's Papers
    const papers = await getPapersByUserId(payload.sub);

    // 3. Format Response
    const formattedPapers = papers.map((paper) => {
      const latestVersion = paper.versions[0];
      return {
        id: paper.id,
        title: latestVersion?.title || "Untitled",
        date: paper.createdAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        views: paper.metrics?.views || 0,
        downloads: paper.metrics?.downloads || 0,
        comments: paper.commentCount || 0,
        dept: paper.category?.name || "General",
        status: paper.status,
      };
    });

    return NextResponse.json(formattedPapers);
  } catch (error) {
    console.error("[GET_MY_PAPERS]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
