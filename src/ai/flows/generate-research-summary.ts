
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
import { extractContent } from '@/lib/linkProcessor';
import type { LinkType } from '@/lib/linkProcessor';

const ExtractedContentSchema = z.object({
  url: z.string().url(),
  type: z.string(), // LinkType
  content: z.string(),
});

const GenerateResearchSummaryInputSchema = z.object({
  queryText: z.string().describe('The research query or topic.'),
  inputLinks: z.array(z.string().url()).optional().describe('Optional URLs to include in the research.'),
});
export type GenerateResearchSummaryInput = z.infer<typeof GenerateResearchSummaryInputSchema>;

// Internal schema for the prompt, which includes extracted content
const PromptInputSchema = GenerateResearchSummaryInputSchema.extend({
  extractedContent: z.array(ExtractedContentSchema).optional().describe('Extracted content from the provided URLs.'),
});

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
  input: {schema: PromptInputSchema},
  output: {schema: GenerateResearchSummaryOutputSchema},
  prompt: `You are an expert research assistant. Your job is to generate a structured research summary based on a user's query and the provided content from various sources.

  User's Research Topic: {{{queryText}}}

  {{#if extractedContent}}
  Here is the content extracted from the links provided by the user. Use this as the primary basis for your summary.
  {{#each extractedContent}}
  ---
  Source Type: {{this.type}}
  URL: {{this.url}}
  Content:
  {{{this.content}}}
  ---
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
    "disclaimer": "This summary is AI-generated and may contain inaccuracies. Always verify from original sources."
  }

  - Base your summary on the provided content.
  - If the content is a transcript, summarize the key points of the discussion.
  - If the content is from a webpage or article, synthesize the main arguments and findings.
  - If the content is from a GitHub repository, describe the project's purpose and key features based on the README.
  - If you encounter a source with a 'Failed to extract content' message, acknowledge that the source could not be processed in your summary and move on.
  - Ensure the keyInsights array contains between 3 and 7 bullet points.
  - The 'tags' field should contain 3-5 relevant keywords.
  - Always include the disclaimer.
  - In the 'sources' array, list the original URLs you were given. You can try to infer a title from the content if possible.
  `,
});

const generateResearchSummaryFlow = ai.defineFlow(
  {
    name: 'generateResearchSummaryFlow',
    inputSchema: GenerateResearchSummaryInputSchema,
    outputSchema: GenerateResearchSummaryOutputSchema,
  },
  async (input) => {
    const extractedContent = [];
    if (input.inputLinks) {
      for (const url of input.inputLinks) {
        try {
          const { content, type } = await extractContent(url);
          extractedContent.push({ url, type, content });
        } catch (error) {
          console.warn(`Could not process URL ${url}:`, error);
          // Pass the error to the prompt instead of halting the process
          extractedContent.push({
            url,
            type: 'error',
            content: `Failed to extract content. ${error instanceof Error ? error.message : 'An unknown error occurred.'}`,
          });
        }
      }
    }

    const promptInput = {
      ...input,
      extractedContent: extractedContent.length > 0 ? extractedContent : undefined,
    };

    const {output} = await generateResearchSummaryPrompt(promptInput);
    return output!;
  }
);
