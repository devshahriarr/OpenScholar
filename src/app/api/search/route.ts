import { NextResponse } from "next/server";
import { searchPapers } from "@/modules/search/repository";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    const q = searchParams.get("q") || undefined;
    const categoryId = searchParams.get("categoryId") ? parseInt(searchParams.get("categoryId")!, 10) : undefined;
    const year = searchParams.get("year") ? parseInt(searchParams.get("year")!, 10) : undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const sort = (searchParams.get("sort") as "relevance" | "newest") || "newest";

    const data = await searchPapers({
      q,
      categoryId: isNaN(categoryId!) ? undefined : categoryId,
      year: isNaN(year!) ? undefined : year,
      page: isNaN(page) || page < 1 ? 1 : page,
      limit: isNaN(limit) || limit < 1 ? 10 : limit,
      sort,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("[SEARCH_API_ERROR]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
