import type { ResearchResult } from "./types";

export const mockUser = {
  uid: 'mock-user-123',
  email: 'user@example.com',
  displayName: 'Alex Doe',
};

export const mockResearchHistory: ResearchResult[] = [
  {
    researchId: 'res-1',
    userId: 'mock-user-123',
    timestamp: new Date('2023-10-26T10:00:00Z'),
    queryText: 'What are the latest advancements in quantum computing?',
    inputLinks: ['https://en.wikipedia.org/wiki/Quantum_computing'],
    aiResponse: {
      title: 'Advancements in Quantum Computing',
      introduction: 'Quantum computing has seen significant progress in hardware development and algorithmic applications. Recent breakthroughs focus on increasing qubit stability and error correction, paving the way for more practical quantum computers.',
      keyInsights: [
        'Development of more stable qubits using new materials and techniques.',
        'Improved quantum error correction codes to reduce decoherence.',
        'Creation of new quantum algorithms for optimization and simulation problems.',
        'Increased investment from both public and private sectors driving innovation.'
      ],
      conclusion: 'The field is rapidly advancing, moving from theoretical concepts to tangible, problem-solving machines, although widespread practical use is still some years away.',
      sources: [
        { title: 'Quantum Computing - Wikipedia', url: 'https://en.wikipedia.org/wiki/Quantum_computing' },
        { title: 'Google AI Quantum', url: 'https://ai.google/research/teams/quantum-ai/' },
      ],
      disclaimer: 'This summary is AI-generated and may not be fully comprehensive or accurate.'
    },
    isBookmarked: true,
    feedbackScore: 5,
  },
  {
    researchId: 'res-2',
    userId: 'mock-user-123',
    timestamp: new Date('2023-10-25T14:30:00Z'),
    queryText: 'Impact of AI on the job market.',
    inputLinks: [],
    aiResponse: {
      title: 'The Impact of Artificial Intelligence on the Job Market',
      introduction: 'Artificial intelligence is poised to be a major disruptive force in the job market, with the potential to both displace existing jobs and create new ones. The net effect is a subject of ongoing debate among economists.',
      keyInsights: [
        'Routine and manual tasks are most susceptible to automation.',
        'New job categories are emerging in areas like AI development, ethics, and data science.',
        'A growing skills gap is evident, requiring a focus on reskilling and upskilling the workforce.',
        'The "gig economy" may expand as AI platforms facilitate freelance and remote work.'
      ],
      conclusion: 'Adapting to the changes brought by AI through education, policy, and individual learning will be crucial for navigating the future of work.',
    },
    isBookmarked: false,
  },
];
