import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        author: {
          include: {
            department: true,
            university: true,
            papers: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("[ADMIN_USERS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
