import { Users, FileText, Calendar, TrendingUp } from "lucide-react";
import { PaperCard } from "@/components/paper-card";
import { SuggestedResearchers } from "@/components/suggested-researchers";

const MOCK_PAPERS = [
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

export default function FollowingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Feed */}
        <div className="lg:col-span-8">
          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card-premium p-6 flex justify-between items-center">
              <div>
                <p className="text-xs font-medium text-text-secondary uppercase mb-1">Total Following</p>
                <p className="text-3xl font-bold text-text-primary">3</p>
              </div>
              <div className="bg-primary-light p-3 rounded-xl text-primary">
                <Users size={24} />
              </div>
            </div>
            <div className="card-premium p-6 flex justify-between items-center">
              <div>
                <p className="text-xs font-medium text-text-secondary uppercase mb-1">New Thesis</p>
                <p className="text-3xl font-bold text-text-primary">2,988</p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl text-green-600">
                <TrendingUp size={24} />
              </div>
            </div>
            <div className="card-premium p-6 flex justify-between items-center">
              <div>
                <p className="text-xs font-medium text-text-secondary uppercase mb-1">This Week</p>
                <p className="text-3xl font-bold text-text-primary">3</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
                <Calendar size={24} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Double the mock papers for the grid view */}
            {[...MOCK_PAPERS, ...MOCK_PAPERS, ...MOCK_PAPERS].map((paper, idx) => (
              <PaperCard key={idx} paper={paper} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <SuggestedResearchers />
        </div>
      </div>
    </div>
  );
}
