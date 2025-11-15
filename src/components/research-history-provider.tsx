"use client";

import { createContext, useState, useCallback, ReactNode } from 'react';
import type { ResearchResult } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';

// --- E2EE Simulation ---
// In a real E2EE implementation, you would use the Web Crypto API
// to generate, store, and use cryptographic keys to encrypt/decrypt data.

// This is a placeholder to demonstrate the concept.
const encrypt = (text: string): string => {
  if (!text) return text;
  return text.split('').reverse().join('');
};

const decrypt = (text: string): string => {
  if (!text) return text;
  return text.split('').reverse().join('');
};

const encryptAiResponse = (response: ResearchResult['aiResponse']) => {
  return {
    ...response,
    title: encrypt(response.title),
    introduction: encrypt(response.introduction),
    keyInsights: response.keyInsights.map(encrypt),
    conclusion: encrypt(response.conclusion),
    // sources and tags are less sensitive and might not be encrypted
  };
};

const decryptAiResponse = (response: ResearchResult['aiResponse']) => {
  return {
    ...response,
    title: decrypt(response.title),
    introduction: decrypt(response.introduction),
    keyInsights: response.keyInsights.map(decrypt),
    conclusion: decrypt(response.conclusion),
  };
};
// --- End of E2EE Simulation ---

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
  // The state now stores encrypted data
  const [researchHistory, setResearchHistory] = useState<ResearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const addResearchResult = useCallback(async (resultData: Omit<ResearchResult, 'researchId' | 'timestamp' | 'userId'>): Promise<string | null> => {
    if (!user) {
      return null;
    }
    const newId = Date.now().toString();
    
    // Encrypt the data before storing it
    const encryptedAiResponse = encryptAiResponse(resultData.aiResponse);
    
    const newResult: ResearchResult = {
      ...resultData,
      aiResponse: encryptedAiResponse,
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
    const encryptedResult = researchHistory.find(r => r.researchId === id);
    if (!encryptedResult) {
      return undefined;
    }
    // Decrypt the data on-the-fly before returning it
    return {
      ...encryptedResult,
      aiResponse: decryptAiResponse(encryptedResult.aiResponse),
    };
  }, [researchHistory]);
  
  // We need a separate property for the history list that is decrypted
  const decryptedResearchHistory = researchHistory.map(item => ({
    ...item,
    aiResponse: decryptAiResponse(item.aiResponse),
  }));

  const value = {
    researchHistory: decryptedResearchHistory,
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
