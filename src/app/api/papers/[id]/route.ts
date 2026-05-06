import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Mock data matching the design reference "Deep Learning Applications in NLP"
  const mockPaper = {
    id: params.id,
    title: "Deep Learning Applications in Natural Language Processing",
    abstract: "This thesis explores the recent advancements in deep learning techniques applied to natural language processing tasks. We investigate transformer architectures and their impact on various NLP applications including sentiment analysis, machine translation, and text generation.",
    fullText: "Introduction\n\nClimate change represents one of the most pressing challenges of our time. Traditional climate models, while powerful, often struggle with the complexity and scale of global climate systems. Machine learning offers new possibilities for understanding and predicting climate patterns with unprecedented accuracy.\n\nMethodology\n\nWe conducted a systematic review of machine learning applications in climate science, focusing on deep neural networks, ensemble methods, and hybrid approaches. Our dataset includes climate simulations from 1950 to 2025, encompassing temperature, precipitation, and atmospheric composition data.\n\nResults\n\nOur findings demonstrate that ensemble approaches combining LSTM networks with traditional climate models achieve the highest prediction accuracy, with a 23% improvement over baseline methods. The integration of satellite imagery through convolutional neural networks further enhances model performance.\n\nDiscussion\n\nThe results indicate that machine learning techniques, particularly deep learning architectures, show significant promise in climate prediction tasks. However, challenges remain in model interpretability and long-term stability. Future research should focus on developing explainable AI methods that can provide insights into climate dynamics.",
    authors: [
      {
        id: "author-1",
        name: "Sarah Johnson",
        institution: "Tech University",
        bio: "This thesis explores the recent advancements in deep learning techniques applied to natural language...",
        followers: 390,
        likes: 4000,
        avatarUrl: undefined,
      }
    ],
    publishedAt: "2024-01-18T00:00:00Z",
    tags: ["AI", "Deep Learning", "NLP"],
    metrics: {
      views: 1245,
      downloads: 342,
      likes: 600,
      comments: 150
    },
    pdfUrl: "#",
  };

  // Artificial delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json(mockPaper);
}
