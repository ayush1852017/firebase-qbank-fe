import type { LucideIcon } from 'lucide-react';

export interface User {
  id: string;
  email: string;
  name?: string;
  streak?: number;
  // Add other user-specific fields
}

export type UserMode = 'student' | 'creator';

export interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  isAiGenerated?: boolean;
  tags?: string[];
}

export interface BadgeType {
  id: string;
  name: string;
  description: string;
  Icon: LucideIcon; 
  achieved: boolean;
  category: string;
}

export interface CreatorStats {
  mcqsCreated: number;
  mcqsPublished: number;
  followers: number;
  earnings: number; // Or a more complex earnings object
}
