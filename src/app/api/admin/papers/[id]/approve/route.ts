import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const paper = await prisma.paper.update({
      where: { id: params.id },
      data: { status: "approved" }
    });

    return NextResponse.json(paper);
  } catch (error) {
    console.error("[ADMIN_APPROVE_PAPER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
