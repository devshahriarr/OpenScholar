import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const mockRelated = Array.from({ length: 3 }).map((_, i) => ({
    id: `related-${i}`,
    title: "Deep Learning Applications in Natural Language Processing",
    authors: [{ name: "Sarah Johnson", id: "author-1", institution: "", bio: "", followers: 0, likes: 0 }],
  }));

  await new Promise((resolve) => setTimeout(resolve, 300));
  return NextResponse.json(mockRelated);
}
