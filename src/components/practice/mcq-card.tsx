"use client";

import type { MCQ } from '@/types';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { Separator } from '../ui/separator';
import { cn } from '@/lib/utils';

interface MCQCardProps {
  mcq: MCQ;
  onAnswered: (isCorrect: boolean) => void;
  questionNumber: number;
  totalQuestions: number;
}

export function MCQCard({ mcq, onAnswered, questionNumber, totalQuestions }: MCQCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Reset state when MCQ changes
    setSelectedOption(null);
    setIsAnswered(false);
    setShowExplanation(false);
  }, [mcq]);


  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
    const correct = selectedOption === mcq.correctAnswer;
    onAnswered(correct);
    if (correct) {
      setShowExplanation(false); // Optionally hide explanation if correct, or always show after answer
    } else {
      setShowExplanation(true); // Show explanation if incorrect
    }
  };

  if (!isClient) {
    // Render a placeholder or null on the server to avoid hydration mismatch
    // Or a loading state for the card
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-xl rounded-xl overflow-hidden animate-pulse">
        <CardHeader className="bg-primary/5 p-6">
          <div className="h-4 bg-muted-foreground/20 rounded w-1/4 mb-2"></div>
          <div className="h-8 bg-muted-foreground/30 rounded w-3/4"></div>
          {mcq.isAiGenerated && <div className="h-4 bg-muted-foreground/20 rounded w-1/3 mt-2"></div>}
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 border border-transparent rounded-lg">
              <div className="h-5 w-5 bg-muted-foreground/20 rounded-full"></div>
              <div className="h-5 bg-muted-foreground/20 rounded w-full"></div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="p-6 bg-secondary/30 flex justify-end">
           <div className="h-10 bg-muted-foreground/30 rounded w-24"></div>
        </CardFooter>
      </Card>
    );
  }


  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl rounded-xl overflow-hidden transition-all duration-500 ease-in-out transform hover:shadow-2xl">
      <CardHeader className="bg-primary/5 p-6">
        <CardDescription className="text-sm text-primary font-medium">
          Question {questionNumber} of {totalQuestions} {mcq.topic ? `- Topic: ${mcq.topic}` : ''}
        </CardDescription>
        <CardTitle className="text-xl font-semibold text-foreground leading-relaxed">
          {mcq.question}
        </CardTitle>
        {mcq.isAiGenerated && (
          <div className="mt-2 flex items-center text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
            <Lightbulb className="h-4 w-4 mr-1 text-yellow-500" />
            AI-Generated Question
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6">
        <RadioGroup
          value={selectedOption ?? undefined}
          onValueChange={setSelectedOption}
          disabled={isAnswered}
          className="space-y-3"
        >
          {mcq.options.map((option, index) => {
            const isCorrect = option === mcq.correctAnswer;
            const isSelected = selectedOption === option;
            return (
              <Label
                key={index}
                htmlFor={`${mcq.id}-option-${index}`}
                className={cn(
                  "flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-200 ease-in-out",
                  isAnswered && isCorrect ? "bg-green-100 border-green-500 text-green-700 ring-2 ring-green-500" : "",
                  isAnswered && isSelected && !isCorrect ? "bg-red-100 border-red-500 text-red-700 ring-2 ring-red-500" : "",
                  !isAnswered && isSelected ? "bg-accent/10 border-accent" : "border-input hover:border-primary/50",
                  isAnswered ? "cursor-not-allowed opacity-80" : "hover:bg-primary/5"
                )}
              >
                <RadioGroupItem value={option} id={`${mcq.id}-option-${index}`} className="border-muted-foreground data-[state=checked]:border-primary data-[state=checked]:text-primary" />
                <span className="text-base">{option}</span>
                {isAnswered && isCorrect && <CheckCircle2 className="ml-auto h-5 w-5 text-green-500" />}
                {isAnswered && isSelected && !isCorrect && <AlertCircle className="ml-auto h-5 w-5 text-red-500" />}
              </Label>
            );
          })}
        </RadioGroup>
      </CardContent>
      
      {isAnswered && (
        <div className="p-6 pt-0">
          <Separator className="my-4" />
          <Button
            variant="outline"
            onClick={() => setShowExplanation(!showExplanation)}
            className="w-full flex items-center justify-between text-primary hover:bg-primary/5 hover:text-primary border-primary/50"
          >
            <div className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              Explanation
            </div>
            {showExplanation ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
          {showExplanation && (
            <div className="mt-4 p-4 bg-secondary/50 rounded-lg border border-border animate-fade-in">
              <p className="text-sm text-foreground leading-relaxed">{mcq.explanation}</p>
            </div>
          )}
        </div>
      )}

      <CardFooter className="p-6 bg-secondary/30 flex justify-end">
        {!isAnswered && (
          <Button 
            onClick={handleSubmitAnswer} 
            disabled={!selectedOption}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
          >
            Submit Answer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
