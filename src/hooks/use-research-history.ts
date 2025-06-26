'use client';

import { useContext } from 'react';
import { ResearchHistoryContext } from '@/components/research-history-provider';

// This hook now consumes the ResearchHistoryContext.
// The state management is handled by ResearchHistoryProvider.

export function useResearchHistory() {
  const context = useContext(ResearchHistoryContext);
  if (context === undefined) {
    throw new Error('useResearchHistory must be used within a ResearchHistoryProvider');
  }
  return context;
}
