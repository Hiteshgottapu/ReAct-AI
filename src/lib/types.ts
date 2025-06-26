export interface ResearchResult {
  researchId: string;
  userId: string;
  timestamp: Date;
  queryText: string;
  inputLinks: string[];
  aiResponse: {
    title: string;
    introduction: string;
    keyInsights: string[];
    conclusion: string;
    sources?: { url: string; title: string }[];
    tags: string[];
    disclaimer?: string;
  };
  isBookmarked: boolean;
  feedbackScore?: number;
}
