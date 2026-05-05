import { NextResponse } from "next/server";
import { Paper } from "@/types/paper";

// Generate mock data
const MOCK_RESULTS: Paper[] = Array.from({ length: 24 }).map((_, i) => ({
  id: `paper-${i + 1}`,
  title: i % 2 === 0 
    ? "Deep Learning Applications in Natural Language Processing"
    : "Machine Learning for Climate Change Prediction",
  category: i % 2 === 0 ? "Computer Science" : "Environmental Science",
  author: {
    name: "Sarah Johnson",
    institution: "Tech University",
  },
  abstract: i % 2 === 0 
    ? "This thesis explores the recent advancements in deep learning techniques applied to natural language processing tasks including sentiment analysis, machine translation, and text generation."
    : "An investigation into how machine learning algorithms can be applied to predict climate change patterns and assess environmental impact on a global scale.",
  tags: i % 2 === 0 ? ["AI", "Deep Learning", "NLP"] : ["Machine learning", "Climate", "Data Analysis"],
  views: 1245 + (i * 10),
  comments: 342 + i,
  publishedAt: "2024-01-15T00:00:00Z",
}));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const q = searchParams.get("q")?.toLowerCase();
  const categoryId = searchParams.get("categoryId");
  const year = searchParams.get("year");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "9", 10);

  // Filter logic
  let filtered = MOCK_RESULTS.filter(paper => {
    let match = true;

    if (q) {
      const text = `${paper.title} ${paper.abstract} ${paper.author.name} ${paper.tags.join(" ")}`.toLowerCase();
      match = match && text.includes(q);
    }

    if (categoryId) {
      const categoryName = 
        categoryId === "1" ? "Science & Technology" :
        categoryId === "2" ? "Arts & Humanities" :
        categoryId === "3" ? "Business & Economics" :
        categoryId === "4" ? "Health & Medicine" : "";
      
      // Since mock data only has two categories, we just fake the matching for the demo
      // In real life, paper.categoryId === categoryId
      if (categoryId === "1") {
        match = match && paper.category === "Computer Science";
      } else {
        // Just return false for others to show filtering works
        match = match && false;
      }
    }

    if (year) {
      match = match && paper.publishedAt.startsWith(year);
    }

    return match;
  });

  // Pagination logic
  const total = filtered.length;
  const offset = (page - 1) * limit;
  const paginated = filtered.slice(offset, offset + limit);

  // Add artificial delay to simulate network
  await new Promise((resolve) => setTimeout(resolve, 800));

  return NextResponse.json({
    total,
    page,
    limit,
    results: paginated
  });
}
