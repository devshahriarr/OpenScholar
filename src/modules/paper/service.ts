export interface AuthorProfile {
  id: string;
  name: string;
  institution: string;
  bio: string;
  followers: number;
  likes: number;
  avatarUrl?: string;
}

export interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  content: string;
  createdAt: string;
}

export interface PaperDetails {
  id: string;
  title: string;
  abstract: string;
  fullText?: string;
  authors: AuthorProfile[];
  publishedAt: string;
  tags: string[];
  metrics: {
    views: number;
    downloads: number;
    likes: number;
    comments: number;
  };
  pdfUrl: string;
}

export async function getPaperDetails(id: string): Promise<PaperDetails> {
  const res = await fetch(`/api/papers/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch paper");
  return res.json();
}

export async function getRelatedPapers(id: string): Promise<PaperDetails[]> {
  const res = await fetch(`/api/papers/${id}/related`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch related papers");
  return res.json();
}

export async function getComments(paperId: string): Promise<Comment[]> {
  const res = await fetch(`/api/comments?paperId=${paperId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch comments");
  const data = await res.json();
  return data.comments;
}
