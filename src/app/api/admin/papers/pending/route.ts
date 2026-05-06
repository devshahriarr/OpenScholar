import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pendingPapers = await prisma.paper.findMany({
      where: { status: "PENDING" },
      include: {
        category: true,
        author: {
          include: {
            user: true
          }
        },
        tags: {
          include: {
            tag: true
          }
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
