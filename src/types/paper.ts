export interface PaperAuthor {
  name: string;
  institution: string;
  avatarUrl?: string;
}

export interface Paper {
  id: string;
  title: string;
  category: string;
  author: PaperAuthor;
  abstract: string;
  tags: string[];
  views: number;
  downloads?: number;
  comments: number;
  publishedAt: string;
}

export interface GlobalStats {
  totalPapers: number;
  universities: number;
  researchers: number;
  downloads: number;
}
