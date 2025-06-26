'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ResearchResult } from '@/lib/types';
import { mockResearchHistory as initialMockResearchHistory } from '@/lib/mock-data';

const RESEARCH_HISTORY_KEY = 'researchHistory';

const getHistoryFromStorage = (): ResearchResult[] => {
  try {
    const item = window.sessionStorage.getItem(RESEARCH_HISTORY_KEY);
    if (item) {
      return JSON.parse(item).map((d: any) => ({
        ...d,
        timestamp: new Date(d.timestamp),
      }));
    } else {
      // Initialize storage if it's empty
      window.sessionStorage.setItem(RESEARCH_HISTORY_KEY, JSON.stringify(initialMockResearchHistory));
      return initialMockResearchHistory;
    }
  } catch (error) {
    console.error("Failed to parse research history from sessionStorage", error);
    return initialMockResearchHistory;
  }
};

const setHistoryToStorage = (history: ResearchResult[]) => {
  try {
    window.sessionStorage.setItem(RESEARCH_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save research history to sessionStorage", error);
  }
};

export function useResearchHistory() {
  const [researchHistory, setResearchHistory] = useState<ResearchResult[]>([]);

  useEffect(() => {
    setResearchHistory(getHistoryFromStorage());
  }, []);

  const updateHistoryStateAndStorage = useCallback((newHistory: ResearchResult[]) => {
    setHistoryToStorage(newHistory);
    setResearchHistory(newHistory);
  }, []);

  const addResearchResult = useCallback((result: ResearchResult) => {
    const currentHistory = getHistoryFromStorage();
    const newHistory = [result, ...currentHistory];
    updateHistoryStateAndStorage(newHistory);
  }, [updateHistoryStateAndStorage]);

  const toggleBookmark = useCallback((researchId: string) => {
    const currentHistory = getHistoryFromStorage();
    const newHistory = currentHistory.map(item =>
      item.researchId === researchId
        ? { ...item, isBookmarked: !item.isBookmarked }
        : item
    );
    updateHistoryStateAndStorage(newHistory);
  }, [updateHistoryStateAndStorage]);

  const getResearchById = useCallback((id: string) => {
    return researchHistory.find(r => r.researchId === id);
  }, [researchHistory]);

  return { researchHistory, addResearchResult, toggleBookmark, getResearchById };
}
