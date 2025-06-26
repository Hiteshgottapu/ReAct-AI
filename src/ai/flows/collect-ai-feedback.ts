'use server';

/**
 * @fileOverview This flow collects user feedback on AI-generated research summaries.
 *
 * - collectAiFeedback - A function that handles the collection of AI feedback.
 * - CollectAiFeedbackInput - The input type for the collectAiFeedback function.
 * - CollectAiFeedbackOutput - The return type for the collectAiFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CollectAiFeedbackInputSchema = z.object({
  researchId: z.string().describe('The ID of the research summary.'),
  userId: z.string().describe('The ID of the user providing feedback.'),
  feedbackScore: z.number().min(1).max(5).describe('The feedback score (1-5).'),
});
export type CollectAiFeedbackInput = z.infer<typeof CollectAiFeedbackInputSchema>;

const CollectAiFeedbackOutputSchema = z.object({
  success: z.boolean().describe('Whether the feedback was successfully recorded.'),
});
export type CollectAiFeedbackOutput = z.infer<typeof CollectAiFeedbackOutputSchema>;

export async function collectAiFeedback(input: CollectAiFeedbackInput): Promise<CollectAiFeedbackOutput> {
  return collectAiFeedbackFlow(input);
}

const collectAiFeedbackFlow = ai.defineFlow(
  {
    name: 'collectAiFeedbackFlow',
    inputSchema: CollectAiFeedbackInputSchema,
    outputSchema: CollectAiFeedbackOutputSchema,
  },
  async input => {
    // This flow is now a no-op as feedback is handled on the client-side directly with Firestore.
    // This file is kept to avoid breaking genkit deployments that might still reference it.
    console.log(
      `Received AI feedback for researchId: ${input.researchId}, userId: ${input.userId}, feedbackScore: ${input.feedbackScore}. This is a no-op.`
    );
    return {success: true};
  }
);
