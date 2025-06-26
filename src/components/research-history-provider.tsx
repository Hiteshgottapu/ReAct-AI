"use client";

import { createContext, useState, useCallback, ReactNode } from 'react';
import type { ResearchResult } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';

interface ResearchHistoryContextType {
  researchHistory: ResearchResult[];
  addResearchResult: (resultData: Omit<ResearchResult, 'researchId' | 'timestamp' | 'userId'>) => Promise<string | null>;
  toggleBookmark: (researchId: string) => Promise<void>;
  getResearchById: (id: string) => ResearchResult | undefined;
  updateFeedbackScore: (researchId: string, feedbackScore: number) => Promise<void>;
  loading: boolean;
}

export const ResearchHistoryContext = createContext<ResearchHistoryContextType | undefined>(undefined);

export function ResearchHistoryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [researchHistory, setResearchHistory] = useState<ResearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const addResearchResult = useCallback(async (resultData: Omit<ResearchResult, 'researchId' | 'timestamp' | 'userId'>): Promise<string | null> => {
    if (!user) {
      return null;
    }
    const newId = Date.now().toString();
    const newResult: ResearchResult = {
      ...resultData,
      researchId: newId,
      userId: user.uid,
      timestamp: new Date(),
    };

    setResearchHistory(prevHistory => [newResult, ...prevHistory]);
    return newId;
  }, [user]);

  const toggleBookmark = useCallback(async (researchId: string) => {
    setResearchHistory(prevHistory =>
      prevHistory.map(item =>
        item.researchId === researchId
          ? { ...item, isBookmarked: !item.isBookmarked }
          : item
      )
    );
  }, []);

  const updateFeedbackScore = useCallback(async (researchId: string, feedbackScore: number) => {
    setResearchHistory(prevHistory =>
      prevHistory.map(item =>
        item.researchId === researchId
          ? { ...item, feedbackScore }
          : item
      )
    );
  }, []);

  const getResearchById = useCallback((id: string) => {
    return researchHistory.find(r => r.researchId === id);
  }, [researchHistory]);

  const value = {
    researchHistory,
    addResearchResult,
    toggleBookmark,
    getResearchById,
    updateFeedbackScore,
    loading,
  };

  return (
    <ResearchHistoryContext.Provider value={value}>
      {children}
    </ResearchHistoryContext.Provider>
  );
}
