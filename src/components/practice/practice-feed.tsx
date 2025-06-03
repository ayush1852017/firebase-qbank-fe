"use client";

import type { MCQ } from '@/types';
import { useState, useEffect, useCallback } from 'react';
import { MCQCard } from './mcq-card';
import { Button } from '@/components/ui/button';
import { generateMCQFallback, type GenerateMCQFallbackInput } from '@/ai/flows/generate-mcq-fallback';
import { Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const initialMCQs: MCQ[] = [
  // Placeholder MCQs, will be replaced or supplemented by AI
  {
    id: '1',
    question: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    correctAnswer: 'Paris',
    explanation: 'Paris is the capital and most populous city of France.',
    topic: 'Geography',
    difficulty: 'easy'
  },
  {
    id: '2',
    question: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 'Mars',
    explanation: 'Mars is often called the Red Planet because of its reddish appearance.',
    topic: 'Astronomy',
    difficulty: 'easy'
  },
];


export function PracticeFeed() {
  const [mcqs, setMcqs] = useState<MCQ[]>(initialMCQs);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answeredStats, setAnsweredStats] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [showResults, setShowResults] = useState(false);

  const loadAiQuestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const aiInput: GenerateMCQFallbackInput = {
        topic: 'General Knowledge',
        difficulty: 'medium',
        quantity: 3,
      };
      const result = await generateMCQFallback(aiInput);
      const newAiMcqs: MCQ[] = result.mcqs.map((q, index) => ({
        ...q,
        id: `ai-${Date.now()}-${index}`,
        isAiGenerated: true,
        topic: aiInput.topic,
        difficulty: aiInput.difficulty,
      }));
      setMcqs(prevMcqs => [...prevMcqs, ...newAiMcqs].filter((mcq, index, self) => index === self.findIndex(m => m.id === mcq.id))); // Add and remove duplicates
    } catch (err) {
      console.error('Failed to load AI questions:', err);
      setError('Failed to load additional questions. Please try again.');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (mcqs.length === 0) { // Or some other condition like user exhausted current MCQs
      loadAiQuestions();
    }
  }, [mcqs.length, loadAiQuestions]);

  const handleAnswered = (isCorrect: boolean) => {
    setAnsweredStats(prev => ({ correct: prev.correct + (isCorrect ? 1 : 0), total: prev.total + 1 }));
    // Auto-advance or wait for user
    // For now, let's not auto-advance to allow reviewing explanation
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mcqs.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      // End of quiz or load more
      setShowResults(true);
    }
  };
  
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnsweredStats({ correct: 0, total: 0 });
    setShowResults(false);
    // Optionally re-fetch/shuffle questions
    setMcqs(initialMCQs); // Reset to initial set for simplicity
    if(initialMCQs.length === 0) loadAiQuestions();
  };


  if (isLoading && mcqs.length === 0) {
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
        <CardContent>
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-destructive mb-2">Oops! Something went wrong.</h3>
          <p className="text-destructive/80 mb-6">{error}</p>
          <Button onClick={loadAiQuestions} variant="destructive" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (mcqs.length === 0) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-card rounded-xl shadow-lg">
        <BookOpenCheck className="h-12 w-12 text-primary mb-4" />
        <p className="text-lg font-semibold text-foreground">No questions available right now.</p>
        <p className="text-sm text-muted-foreground mb-4">Please check back later or try generating some.</p>
        <Button onClick={loadAiQuestions} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
          Generate AI Questions
        </Button>
      </div>
    );
  }
  
  const currentMCQ = mcqs[currentQuestionIndex];

  if (showResults) {
    return (
      <Card className="w-full max-w-2xl mx-auto text-center p-8 shadow-xl rounded-xl bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <CardContent>
          <Trophy className="h-16 w-16 text-accent mx-auto mb-6" />
          <h2 className="text-3xl font-headline text-primary mb-3">Session Complete!</h2>
          <p className="text-xl text-foreground mb-2">
            You scored: <span className="font-bold text-accent">{answeredStats.correct}</span> out of <span className="font-bold">{answeredStats.total}</span>
          </p>
          <p className="text-muted-foreground mb-8">
            Accuracy: {answeredStats.total > 0 ? ((answeredStats.correct / answeredStats.total) * 100).toFixed(0) : 0}%
          </p>
          <div className="flex space-x-4 justify-center">
            <Button onClick={handleRestart} variant="outline" className="border-primary text-primary hover:bg-primary/10">
              <RefreshCw className="mr-2 h-4 w-4" />
              Practice Again
            </Button>
            <Button onClick={() => { /* Navigate to dashboard or other page */ }} className="bg-accent hover:bg-accent/90">
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
      <div className="flex justify-between items-center mt-6">
        <Button 
          onClick={loadAiQuestions} 
          variant="outline" 
          disabled={isLoading}
          className="border-accent text-accent hover:bg-accent/10"
        >
          {isLoading && mcqs.length > 0 ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
          Load More AI Questions
        </Button>
        <Button 
          onClick={handleNextQuestion} 
          disabled={answeredStats.total !== currentQuestionIndex + 1 && currentQuestionIndex < mcqs.length -1 } // Enable only after answering current Q
          className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px]"
        >
          {currentQuestionIndex === mcqs.length - 1 ? 'Finish Session' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
}


// Placeholder icons if not already imported elsewhere
const BookOpenCheck = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 6.523c-1.632-1.285-3.578-2.023-5.5-2.023C4.078 4.5 2 6.578 2 9c0 1.98.79 3.735 2.003 5.002L12 21.5l7.997-7.498A6.476 6.476 0 0 0 22 9c0-2.422-2.078-4.5-4.5-4.5-1.922 0-3.868.738-5.5 2.023zM17 9.5l-3.5 3.5-1.5-1.5"/></svg>
);

const Lightbulb = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2.5c-4.286 0-6.5 2.214-6.5 6.5 0 2.451.934 4.597 2.5 5.74V18.5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3.76c1.566-1.143 2.5-3.289 2.5-5.74 0-4.286-2.214-6.5-6.5-6.5zM9.5 21.5h5"/></svg>
);

const Trophy = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2.5c3.59 0 6.5 2.91 6.5 6.5s-2.91 6.5-6.5 6.5S5.5 12.59 5.5 9 8.41 2.5 12 2.5zM5.5 16H4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1m14.5 0h1a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-1.5M12 16v5.5m-3-2h6"/></svg>
);


