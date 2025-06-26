'use server';

/**
 * @fileOverview AI flow for generating research summaries from user queries and URLs.
 *
 * - generateResearchSummary - Function to generate research summaries.
 * - GenerateResearchSummaryInput - Input type for the function.
 * - GenerateResearchSummaryOutput - Output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResearchSummaryInputSchema = z.object({
  queryText: z.string().describe('The research query or topic.'),
  inputLinks: z.array(z.string().url()).optional().describe('Optional URLs to include in the research.'),
});
export type GenerateResearchSummaryInput = z.infer<typeof GenerateResearchSummaryInputSchema>;

const GenerateResearchSummaryOutputSchema = z.object({
  title: z.string().describe('Concise title for the research summary.'),
  introduction: z.string().describe('Brief overview of the research topic.'),
  keyInsights: z.array(z.string()).describe('Bulleted key takeaways/findings (min 3, max 7).'),
  conclusion: z.string().describe('Summarizing statement.'),
  sources: z
    .array(
      z.object({
        url: z.string().describe('URL of the source.'),
        title: z.string().describe('Title of the source.'),
      })
    )
    .optional()
    .describe('URLs and their titles that contributed significantly to the summary.'),
  tags: z.array(z.string()).describe('A list of 3-5 relevant tags or keywords for the research topic.'),
  disclaimer: z.string().optional().describe('A small note about AI-generated content.'),
});
export type GenerateResearchSummaryOutput = z.infer<typeof GenerateResearchSummaryOutputSchema>;

export async function generateResearchSummary(input: GenerateResearchSummaryInput): Promise<GenerateResearchSummaryOutput> {
  return generateResearchSummaryFlow(input);
}

const generateResearchSummaryPrompt = ai.definePrompt({
  name: 'generateResearchSummaryPrompt',
  input: {schema: GenerateResearchSummaryInputSchema},
  output: {schema: GenerateResearchSummaryOutputSchema},
  prompt: `You are an expert research assistant. Your job is to generate a structured research summary based on a user's query and provided URLs.

  Query: {{{queryText}}}

  {{#if inputLinks}}
  The following URLs are provided as context. If you use any of them as a source, please include them in the 'sources' part of your output.
  {{#each inputLinks}}
  - {{{this}}}
  {{/each}}
  {{/if}}

  Generate a research summary in the following JSON format:
  {
    "title": "Concise title for the research summary",
    "introduction": "Brief overview of the research topic",
    "keyInsights": ["Bulleted key takeaway 1", "Bulleted key takeaway 2", "Bulleted key takeaway 3"],
    "conclusion": "Summarizing statement",
    "sources": [{"url": "URL of the source", "title": "Title of the source"}],
    "tags": ["keyword1", "keyword2", "keyword3"],
    "disclaimer": "Optional disclaimer about AI-generated content"
  }

  Ensure the keyInsights array contains between 3 and 7 bullet points.
  The 'tags' field should contain 3-5 relevant keywords.
  `,
});

const generateResearchSummaryFlow = ai.defineFlow(
  {
    name: 'generateResearchSummaryFlow',
    inputSchema: GenerateResearchSummaryInputSchema,
    outputSchema: GenerateResearchSummaryOutputSchema,
  },
  async input => {
    const {output} = await generateResearchSummaryPrompt(input);
    return output!;
  }
);
