import { getPapersByStatus, getModerationStats } from "@/modules/moderation/repository";
import { getSessionUser } from "@/lib/auth";
import { PaperStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getSessionUser();
    
    // Flexible role check: allow 'admin' or 'super_admin'
    const role = user?.role?.toLowerCase();
    if (!user || (role !== "admin" && role !== "super_admin")) {
      console.log(`[ADMIN_PENDING] Unauthorized access attempt by ${user?.email} with role: ${user?.role}`);
      return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 401 });
    }

    console.log(`[ADMIN_PENDING] User: ${user.email}, Role: ${user.role}`);
    console.log(`[ADMIN_PENDING] Checking for PaperStatus: "pending"`);

    const [papers, stats] = await Promise.all([
      getPapersByStatus(PaperStatus.pending),
      getModerationStats()
    ]);

    console.log(`[ADMIN_PENDING] Found ${papers.length} pending papers`);
    console.log(`[ADMIN_PENDING] Stats:`, stats);

    // Format papers for the frontend safely
    const formattedPapers = papers.map(p => {
      const latest = p?.versions?.[0];
      return {
        id: p.id,
        author: p.creator?.name || "Unknown Author",
        institution: p.creator?.university?.name || "Unknown",
        category: p.category?.name || "Uncategorized",
        title: latest?.title || "Untitled",
        abstract: latest?.abstract || "No abstract available",
        keywords: latest?.keywords || [],
        submitted: p.createdAt.toISOString(),
        status: p.status
      };
    });

    return NextResponse.json({
      papers: formattedPapers,
      stats
    });
  } catch (error: any) {
    console.error("[ADMIN_PENDING_ERROR]", error);
    return NextResponse.json({ 
      message: error.message || "Internal server error",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    }, { status: 500 });
  }
}
