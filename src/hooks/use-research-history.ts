'use client';

import { useState, useEffect, useCallback } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import type { ResearchResult } from '@/lib/types';
import { useToast } from './use-toast';

export function useResearchHistory() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [researchHistory, setResearchHistory] = useState<ResearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setResearchHistory([]);
      setLoading(false);
      return;
    };

    setLoading(true);
    const researchCollection = collection(db, 'users', user.uid, 'research');
    const q = query(researchCollection, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const history: ResearchResult[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          researchId: doc.id,
          timestamp: data.timestamp?.toDate(),
        } as ResearchResult;
      });
      setResearchHistory(history);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching research history: ", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch research history.',
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, toast]);

  const addResearchResult = useCallback(async (resultData: Omit<ResearchResult, 'researchId' | 'timestamp' | 'userId'>) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not Authenticated',
        description: 'You must be logged in to save research.',
      });
      return null;
    }
    const researchCollection = collection(db, 'users', user.uid, 'research');
    const docRef = await addDoc(researchCollection, {
      ...resultData,
      userId: user.uid,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  }, [user, toast]);

  const toggleBookmark = useCallback(async (researchId: string) => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid, 'research', researchId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const currentBookmarkState = docSnap.data().isBookmarked;
        await updateDoc(docRef, { isBookmarked: !currentBookmarkState });
    }
  }, [user]);

  const updateFeedbackScore = useCallback(async (researchId: string, feedbackScore: number) => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid, 'research', researchId);
    await updateDoc(docRef, { feedbackScore });
  }, [user]);

  const getResearchById = useCallback((id: string) => {
    return researchHistory.find(r => r.researchId === id);
  }, [researchHistory]);

  return { researchHistory, addResearchResult, toggleBookmark, getResearchById, loading, updateFeedbackScore };
}
