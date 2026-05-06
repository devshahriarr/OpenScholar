import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const pendingPapers = await prisma.paper.findMany({
      where: { status: "pending" },
      include: {
        category: true,
        category: true,
        tags: {
          include: { tag: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(pendingPapers);
  } catch (error) {
    console.error("[ADMIN_PENDING_PAPERS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
