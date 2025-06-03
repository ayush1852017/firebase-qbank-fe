// src/ai/flows/generate-mcq-fallback.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate MCQs using AI as a fallback
 * when there are insufficient creator-generated questions available.
 *
 * - generateMCQFallback - A function that generates MCQs using AI.
 * - GenerateMCQFallbackInput - The input type for the generateMCQFallback function.
 * - GenerateMCQFallbackOutput - The return type for the generateMCQFallback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMCQFallbackInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate MCQs.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('The difficulty level of the MCQs.'),
  quantity: z.number().int().min(1).max(10).default(5).describe('The number of MCQs to generate.'),
});
export type GenerateMCQFallbackInput = z.infer<typeof GenerateMCQFallbackInputSchema>;

const GenerateMCQFallbackOutputSchema = z.object({
  mcqs: z.array(
    z.object({
      question: z.string().describe('The MCQ question.'),
      options: z.array(z.string()).describe('The MCQ options.'),
      correctAnswer: z.string().describe('The correct answer for the MCQ.'),
      explanation: z.string().describe('The explanation for the correct answer.'),
    })
  ).describe('The generated MCQs.'),
});
export type GenerateMCQFallbackOutput = z.infer<typeof GenerateMCQFallbackOutputSchema>;

export async function generateMCQFallback(input: GenerateMCQFallbackInput): Promise<GenerateMCQFallbackOutput> {
  return generateMCQFallbackFlow(input);
}

const generateMCQPrompt = ai.definePrompt({
  name: 'generateMCQPrompt',
  input: {schema: GenerateMCQFallbackInputSchema},
  output: {schema: GenerateMCQFallbackOutputSchema},
  prompt: `You are an expert in generating high-quality MCQs for various topics and difficulty levels.

  Generate {{quantity}} MCQs for the topic: {{topic}} with difficulty level: {{difficulty}}.

  Each MCQ should have a question, a set of options, the correct answer, and an explanation for the correct answer.

  Ensure that the generated MCQs are accurate, relevant, and challenging.

  Output in JSON format.

  Example format:
  {
    "mcqs": [
      {
        "question": "Question 1",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "Option A",
        "explanation": "Explanation for Option A"
      }
    ]
  }`,
});

const generateMCQFallbackFlow = ai.defineFlow(
  {
    name: 'generateMCQFallbackFlow',
    inputSchema: GenerateMCQFallbackInputSchema,
    outputSchema: GenerateMCQFallbackOutputSchema,
  },
  async input => {
    const {output} = await generateMCQPrompt(input);
    return output!;
  }
);
