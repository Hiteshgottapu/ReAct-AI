'use client';

import { useState, useCallback } from 'react';
import type { ResearchResult } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';

// This hook now manages research history in-memory for the current session.
// Data will be lost on page refresh.

export function useResearchHistory() {
  const { user } = useAuth();
  const [researchHistory, setResearchHistory] = useState<ResearchResult[]>([]);
  const [loading, setLoading] = useState(false); // No initial loading from a DB

  const addResearchResult = useCallback(async (resultData: Omit<ResearchResult, 'researchId' | 'timestamp' | 'userId'>): Promise<string | null> => {
    if (!user) {
      // The form itself handles showing an error toast.
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

  return { researchHistory, addResearchResult, toggleBookmark, getResearchById, loading, updateFeedbackScore };
}
