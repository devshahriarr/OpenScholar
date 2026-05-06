import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const paper = await prisma.paper.update({
      where: { id: params.id },
      data: { status: "REJECTED" }
    });

    return NextResponse.json(paper);
  } catch (error) {
    console.error("[ADMIN_REJECT_PAPER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
