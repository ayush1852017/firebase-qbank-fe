import type { LucideIcon } from 'lucide-react';

export interface User {
  id: string;
  email: string;
  name?: string;
  streak?: number;
  following?: string[]; // Array of creator IDs the user is following
  isCreator?: boolean; // To identify if a user can be in creator mode
  points?: number; // For leaderboard
  questionsAnsweredCount?: number; // For leaderboard
  mcqsAuthored?: MCQ[]; // MCQs created by this user
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
  creatorId?: string; // ID of the MCQ creator
  creatorName?: string; // Name of the MCQ creator
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
  followers: number; // Or a more complex earnings object
  earnings: number; 
  creatorProfileViews?: number;
}
