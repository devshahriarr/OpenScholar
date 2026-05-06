import { Bookmark } from "lucide-react";
import { PaperCard } from "@/components/paper-card";

const MOCK_SAVED = [
  {
    id: "1",
    commentCount: 24,
    reactionCount: 156,
    createdAt: new Date().toISOString(),
    category: { name: "Computer Science" },
    creator: { name: "Sarah Johnson" },
    versions: [{
      title: "Deep Learning Applications in Natural Language Processing",
      abstract: "This thesis explores the recent advancements in deep learning techniques applied to natural language processing tasks, including transformer models and attention mechanisms.",
      keywords: ["AI", "Deep Learning", "NLP"]
    }],
    metrics: { viewCount: 1245, downloadCount: 342 }
  },
  {
    id: "2",
    commentCount: 12,
    reactionCount: 89,
    createdAt: new Date().toISOString(),
    category: { name: "Environmental Science" },
    creator: { name: "Mark Wilson" },
    versions: [{
      title: "Machine Learning for Climate Change Prediction",
      abstract: "An investigation into how machine learning algorithms can be applied to predict climate patterns and assess environmental impacts globally.",
      keywords: ["Machine Learning", "Climate", "Data Analysis"]
    }],
    metrics: { viewCount: 2134, downloadCount: 567 }
  }
];

export default function SavedPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary-light text-primary rounded-lg">
          <Bookmark size={24} fill="currentColor" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Saved Thesis</h1>
      </div>
      <p className="text-text-secondary text-sm mb-8">Your bookmarked research papers ({MOCK_SAVED.length * 4})</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...MOCK_SAVED, ...MOCK_SAVED, ...MOCK_SAVED, ...MOCK_SAVED].map((paper, idx) => (
          <PaperCard key={idx} paper={paper} />
        ))}
      </div>
    </div>
  );
}
