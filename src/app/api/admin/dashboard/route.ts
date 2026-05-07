import { NextResponse } from "next/server";
import { getAdminDashboardStats, getPapersByStatus } from "@/modules/moderation/repository";
import { getSessionUser } from "@/lib/auth";
import { PaperStatus } from "@prisma/client";

export async function GET() {
  try {
    const user = await getSessionUser();
    
    // Flexible role check: allow 'admin' or 'super_admin'
    const role = user?.role?.toLowerCase();
    if (!user || (role !== "admin" && role !== "super_admin")) {
      console.log(`[ADMIN_DASHBOARD] Unauthorized access attempt by ${user?.email} with role: ${user?.role}`);
      return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 401 });
    }

    const [stats, recentPapers] = await Promise.all([
      getAdminDashboardStats(),
      getPapersByStatus(undefined, 5) // Get 5 most recent papers regardless of status
    ]);

    // Format recent papers safely
    const formattedPapers = recentPapers.map(p => {
      const latest = p?.versions?.[0];
      return {
        id: p.id,
        author: p.creator?.name || "Unknown Author",
        category: p.category?.name || "Uncategorized",
        title: latest?.title || "Untitled",
        abstract: latest?.abstract || "No abstract available",
        keywords: latest?.keywords || [],
        status: p.status
      };
    });

    return NextResponse.json({
      stats,
      recentPapers: formattedPapers
    });
  } catch (error: any) {
    console.error("[ADMIN_DASHBOARD_ERROR]", error);
    return NextResponse.json({ 
      message: error.message || "Internal server error",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    }, { status: 500 });
  }
}
