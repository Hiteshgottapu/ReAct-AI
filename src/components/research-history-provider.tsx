'use client';

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';
import { auth, db } from '@/lib/firebase';
import type { ResearchResult } from '@/lib/types';

// --- E2EE Simulation ---
const encrypt = (text: string): string => {
  if (typeof text !== 'string' || !text) return text;
  return text.split('').reverse().join('');
};

const decrypt = (text: string): string => {
  if (typeof text !== 'string' || !text) return text;
  return text.split('').reverse().join('');
};

const encryptAiResponse = (response: ResearchResult['aiResponse']) => {
  return {
    ...response,
    title: encrypt(response.title),
    introduction: encrypt(response.introduction),
    keyInsights: response.keyInsights.map(encrypt),
    conclusion: encrypt(response.conclusion),
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
  addResearchResult: (
    resultData: Omit<ResearchResult, 'researchId' | 'timestamp' | 'userId'>
  ) => Promise<string | null>;
  toggleBookmark: (researchId: string) => Promise<void>;
  getResearchById: (id: string) => ResearchResult | undefined;
  updateFeedbackScore: (
    researchId: string,
    feedbackScore: number
  ) => Promise<void>;
  loading: boolean;
}

export const ResearchHistoryContext = createContext<
  ResearchHistoryContextType | undefined
>(undefined);

export function ResearchHistoryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [researchHistory, setResearchHistory] = useState<ResearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setResearchHistory([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'users', user.uid, 'researchHistory'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const history = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            researchId: doc.id,
            // Convert Firestore Timestamp to JS Date
            timestamp: (data.timestamp as Timestamp)?.toDate() || new Date(),
          } as ResearchResult;
        });
        setResearchHistory(history);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching research history:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addResearchResult = useCallback(
    async (
      resultData: Omit<ResearchResult, 'researchId' | 'timestamp' | 'userId'>
    ): Promise<string | null> => {
      if (!user) return null;

      const encryptedAiResponse = encryptAiResponse(resultData.aiResponse);

      try {
        const docRef = await addDoc(
          collection(db, 'users', user.uid, 'researchHistory'),
          {
            ...resultData,
            aiResponse: encryptedAiResponse,
            userId: user.uid,
            timestamp: serverTimestamp(),
          }
        );
        return docRef.id;
      } catch (error) {
        console.error('Error adding document: ', error);
        return null;
      }
    },
    [user]
  );

  const toggleBookmark = useCallback(
    async (researchId: string) => {
      if (!user) return;
      const docRef = doc(
        db,
        'users',
        user.uid,
        'researchHistory',
        researchId
      );
      const currentDoc = researchHistory.find(
        (item) => item.researchId === researchId
      );
      if (currentDoc) {
        await updateDoc(docRef, { isBookmarked: !currentDoc.isBookmarked });
      }
    },
    [user, researchHistory]
  );

  const updateFeedbackScore = useCallback(
    async (researchId: string, feedbackScore: number) => {
      if (!user) return;
      const docRef = doc(
        db,
        'users',
        user.uid,
        'researchHistory',
        researchId
      );
      await updateDoc(docRef, { feedbackScore });
    },
    [user]
  );

  const getResearchById = useCallback(
    (id: string) => {
      const encryptedResult = researchHistory.find((r) => r.researchId === id);
      if (!encryptedResult) {
        return undefined;
      }
      return {
        ...encryptedResult,
        aiResponse: decryptAiResponse(encryptedResult.aiResponse),
      };
    },
    [researchHistory]
  );

  const decryptedResearchHistory = researchHistory.map((item) => ({
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
