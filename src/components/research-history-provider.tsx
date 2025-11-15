
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
  limit,
  startAfter,
  getDocs,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import type { ResearchResult } from '@/lib/types';
import { errorEmitter } from '@/lib/error-emitter';
import { FirestorePermissionError } from '@/lib/errors';

// --- E2EE Simulation ---
const encrypt = (text: string): string => {
  if (typeof text !== 'string' || !text) return text;
  const key = 'secret-key';
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result);
};

const decrypt = (text: string): string => {
  if (typeof text !== 'string' || !text) return text;
  try {
    const decodedText = atob(text);
    const key = 'secret-key';
    let result = '';
    for (let i = 0; i < decodedText.length; i++) {
      result += String.fromCharCode(decodedText.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  } catch (e) {
    return text;
  }
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
  hasMore: boolean;
  loadMore: () => void;
}

export const ResearchHistoryContext = createContext<
  ResearchHistoryContextType | undefined
>(undefined);

const PAGE_SIZE = 10;

export function ResearchHistoryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [researchHistory, setResearchHistory] = useState<ResearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const researchHistoryRef = user ? collection(db, 'users', user.uid, 'researchHistory') : null;

  useEffect(() => {
    if (!user || !researchHistoryRef) {
      setResearchHistory([]);
      setLoading(false);
      setHasMore(false);
      return;
    }

    setLoading(true);
    const q = query(
      researchHistoryRef,
      orderBy('timestamp', 'desc'),
      limit(PAGE_SIZE)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const history = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            researchId: doc.id,
            timestamp: (data.timestamp as Timestamp)?.toDate() || new Date(),
          } as ResearchResult;
        });
        setResearchHistory(history);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === PAGE_SIZE);
        setLoading(false);
      },
      (error) => {
        const permissionError = new FirestorePermissionError({
          path: researchHistoryRef.path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const loadMore = useCallback(async () => {
    if (!user || !researchHistoryRef || !lastDoc || !hasMore) return;

    setLoading(true);
    const q = query(
        researchHistoryRef,
        orderBy('timestamp', 'desc'),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
    );

    try {
        const snapshot = await getDocs(q);
        const newHistory = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                ...data,
                researchId: doc.id,
                timestamp: (data.timestamp as Timestamp)?.toDate() || new Date(),
            } as ResearchResult;
        });
        setResearchHistory((prev) => [...prev, ...newHistory]);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (error) {
         const permissionError = new FirestorePermissionError({
          path: researchHistoryRef.path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
    } finally {
        setLoading(false);
    }
}, [user, lastDoc, hasMore, researchHistoryRef]);


  const addResearchResult = useCallback(
    async (
      resultData: Omit<ResearchResult, 'researchId' | 'timestamp' | 'userId'>
    ): Promise<string | null> => {
      if (!user || !researchHistoryRef) return null;

      const encryptedAiResponse = encryptAiResponse(resultData.aiResponse);
      const dataToSave = {
        ...resultData,
        aiResponse: encryptedAiResponse,
        userId: user.uid,
        timestamp: serverTimestamp(),
      };

      try {
        const docRef = await addDoc(researchHistoryRef, dataToSave)
          .catch(serverError => {
            const permissionError = new FirestorePermissionError({
              path: researchHistoryRef.path,
              operation: 'create',
              requestResourceData: dataToSave,
            });
            errorEmitter.emit('permission-error', permissionError);
            throw serverError;
          });
        return docRef.id;
      } catch (error) {
        console.error('Error adding document: ', error);
        return null;
      }
    },
    [user, researchHistoryRef]
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
        const updatedData = { isBookmarked: !currentDoc.isBookmarked };
        updateDoc(docRef, updatedData)
          .catch(serverError => {
            const permissionError = new FirestorePermissionError({
              path: docRef.path,
              operation: 'update',
              requestResourceData: updatedData,
            });
            errorEmitter.emit('permission-error', permissionError);
          });
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
      const updatedData = { feedbackScore };
      updateDoc(docRef, updatedData)
        .catch(serverError => {
          const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'update',
            requestResourceData: updatedData,
          });
          errorEmitter.emit('permission-error', permissionError);
        });
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
    hasMore,
    loadMore,
  };

  return (
    <ResearchHistoryContext.Provider value={value}>
      {children}
    </ResearchHistoryContext.Provider>
  );
}
