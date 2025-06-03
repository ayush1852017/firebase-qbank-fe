"use client";

import type { MCQ } from '@/types';
import { useState, useEffect, useCallback } from 'react';
import { MCQCard } from './mcq-card';
import { Button } from '@/components/ui/button';
import { generateMCQFallback, type GenerateMCQFallbackInput } from '@/ai/flows/generate-mcq-fallback';
import { Loader2, RefreshCw, AlertTriangle, Lightbulb as LightbulbIcon, BookOpenCheck as BookOpenCheckIcon, Trophy as TrophyIcon } from 'lucide-react'; // Renamed icons
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


const initialMCQs: MCQ[] = [
  {
    id: '1',
    question: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    correctAnswer: 'Paris',
    explanation: 'Paris is the capital and most populous city of France.',
    topic: 'Geography',
    difficulty: 'easy',
    creatorId: 'creator1',
    creatorName: 'Dr. KnowItAll'
  },
  {
    id: '2',
    question: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 'Mars',
    explanation: 'Mars is often called the Red Planet because of its reddish appearance.',
    topic: 'Astronomy',
    difficulty: 'easy',
    creatorId: 'creator2',
    creatorName: 'QuizMaster Flex'
  },
];


export function PracticeFeed() {
  const [mcqs, setMcqs] = useState<MCQ[]>(initialMCQs);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answeredStats, setAnsweredStats] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const loadAiQuestions = useCallback(async (quantity = 3) => {
    setIsLoading(true);
    setError(null);
    try {
      const aiInput: GenerateMCQFallbackInput = {
        topic: 'General Knowledge', // Could be dynamic based on user preferences
        difficulty: 'medium',
        quantity: quantity,
      };
      const result = await generateMCQFallback(aiInput);
      const newAiMcqs: MCQ[] = result.mcqs.map((q, index) => ({
        ...q,
        id: `ai-${Date.now()}-${index}`,
        isAiGenerated: true,
        topic: aiInput.topic, // Ensure topic and difficulty are passed from input
        difficulty: aiInput.difficulty,
      }));
      
      // Add new questions, avoid duplicates by ID, and shuffle if desired
      setMcqs(prevMcqs => {
        const combined = [...prevMcqs, ...newAiMcqs];
        const unique = Array.from(new Map(combined.map(mcq => [mcq.id, mcq])).values());
        // Simple shuffle:
        // return unique.sort(() => Math.random() - 0.5); 
        return unique; // Or no shuffle if order matters / new questions at end
      });

    } catch (err) {
      console.error('Failed to load AI questions:', err);
      setError('Failed to load additional questions. Please try again later.');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Load initial AI questions if the static list is empty or too short
    if (mcqs.length < 5 && !isLoading) { 
      loadAiQuestions(5 - mcqs.length);
    }
  }, [mcqs.length, loadAiQuestions, isLoading]);

  const handleAnswered = (isCorrect: boolean) => {
    setAnsweredStats(prev => ({ correct: prev.correct + (isCorrect ? 1 : 0), total: prev.total + 1 }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mcqs.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setShowResults(true);
    }
  };
  
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnsweredStats({ correct: 0, total: 0 });
    setShowResults(false);
    // Reset to initial set and load more if needed.
    // This could be more sophisticated (e.g. fetch all new, shuffle)
    const shuffledInitial = [...initialMCQs].sort(() => Math.random() - 0.5);
    setMcqs(shuffledInitial); 
    if(shuffledInitial.length < 5) loadAiQuestions(5 - shuffledInitial.length);
  };


  if (isLoading && mcqs.length === 0 && !error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-card rounded-xl shadow-lg">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-semibold text-foreground">Loading questions...</p>
        <p className="text-sm text-muted-foreground">Please wait while we prepare your practice session.</p>
      </div>
    );
  }

  if (error && mcqs.length === 0) {
    return (
       <Card className="w-full max-w-2xl mx-auto text-center p-8 shadow-xl rounded-xl bg-destructive/10 border-destructive">
        <CardHeader>
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle className="text-xl font-semibold text-destructive mb-2">Oops! Something went wrong.</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive/80 mb-6">{error}</p>
          <Button onClick={() => loadAiQuestions()} variant="destructive" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (mcqs.length === 0 && !isLoading) { // Check !isLoading to avoid flash of this state
     return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-card rounded-xl shadow-lg">
        <BookOpenCheckIcon className="h-12 w-12 text-primary mb-4" />
        <p className="text-lg font-semibold text-foreground">No questions available right now.</p>
        <p className="text-sm text-muted-foreground mb-4">Please check back later or try generating some.</p>
        <Button onClick={() => loadAiQuestions()} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LightbulbIcon className="mr-2 h-4 w-4" />}
          Generate AI Questions
        </Button>
      </div>
    );
  }
  
  const currentMCQ = mcqs[currentQuestionIndex];

   if (!currentMCQ && !isLoading) { // Handles edge case where mcqs array might be briefly empty after filtering/sorting
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-card rounded-xl shadow-lg">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-semibold text-foreground">Preparing next question...</p>
      </div>
    );
  }
  if (!currentMCQ && isLoading) return null; // Avoid rendering if loading and no current MCQ

  if (showResults) {
    return (
      <Card className="w-full max-w-2xl mx-auto text-center p-8 shadow-xl rounded-xl bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <CardHeader>
            <TrophyIcon className="h-16 w-16 text-accent mx-auto mb-6" />
            <CardTitle className="text-3xl font-headline text-primary mb-3">Session Complete!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl text-foreground mb-2">
            You scored: <span className="font-bold text-accent">{answeredStats.correct}</span> out of <span className="font-bold">{answeredStats.total}</span>
          </p>
          <p className="text-muted-foreground mb-8">
            Accuracy: {answeredStats.total > 0 ? ((answeredStats.correct / answeredStats.total) * 100).toFixed(0) : 0}%
          </p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 justify-center">
            <Button onClick={handleRestart} variant="outline" className="border-primary text-primary hover:bg-primary/10">
              <RefreshCw className="mr-2 h-4 w-4" />
              Practice Again
            </Button>
            <Button onClick={() => router.push('/dashboard')} className="bg-accent hover:bg-accent/90">
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <MCQCard 
        mcq={currentMCQ} 
        onAnswered={handleAnswered} 
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={mcqs.length}
      />
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
        <Button 
          onClick={() => loadAiQuestions()} 
          variant="outline" 
          disabled={isLoading}
          className="border-accent text-accent hover:bg-accent/10 w-full sm:w-auto"
        >
          {isLoading && mcqs.length > 0 ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LightbulbIcon className="mr-2 h-4 w-4" />}
          {mcqs.length > 0 && isLoading ? 'Loading More...' : 'Load More AI Questions'}
        </Button>
        <Button 
          onClick={handleNextQuestion} 
          disabled={answeredStats.total !== currentQuestionIndex + 1 && currentQuestionIndex < mcqs.length -1 && mcqs.length > 1 } 
          className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[150px] w-full sm:w-auto"
        >
          {currentQuestionIndex === mcqs.length - 1 ? 'Finish Session' : 'Next Question'}
        </Button>
      </div>
      {error && mcqs.length > 0 && ( // Show non-blocking error if questions are already loaded
         <Card className="mt-4 w-full max-w-2xl mx-auto text-sm shadow-md rounded-xl bg-destructive/10 border-destructive">
            <CardContent className="p-3 flex items-center">
              <AlertTriangle className="h-5 w-5 text-destructive mr-2 flex-shrink-0" />
              <p className="text-destructive/90">{error}</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
