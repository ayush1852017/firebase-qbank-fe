
import type { LucideIcon } from 'lucide-react';

export interface User {
  id: string;
  email: string;
  name?: string;
  roles: UserMode[]; // student, creator, or both
  isCreator?: boolean; // Derived from roles, true if 'creator' is in roles
  isNewUser?: boolean; // True if user just signed up and needs onboarding
  streak?: number;
  following?: string[]; // Array of creator IDs the user is following
  points?: number; // For leaderboard
  questionsAnsweredCount?: number; // For leaderboard
  mcqsAuthored?: MCQ[]; // MCQs created by this user
  testsAuthored?: Test[]; // Tests created by this user
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

export interface Test {
  id: string;
  title: string;
  description?: string;
  mcqIds: string[];
  creatorId: string;
  topic?: string;
  createdAt: string; // ISO date string
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
  earnings: number;
  creatorProfileViews?: number;
}
