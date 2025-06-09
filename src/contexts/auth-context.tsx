
"use client";

import type { User, MCQ, Test, UserMode } from '@/types';
import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, name?: string, rolesToSet?: UserMode[]) => void; // rolesToSet is now optional, used for updates
  logout: () => void;
  toggleFollow: (creatorId: string) => void;
  updateUserStats?: (stats: Partial<Pick<User, 'points' | 'questionsAnsweredCount' | 'streak'>>) => void;
  addTest?: (testData: Omit<Test, 'id' | 'creatorId' | 'createdAt'>) => void;
  addMcq?: (mcqData: Omit<MCQ, 'id' | 'creatorId' | 'creatorName'>) => void;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample MCQs for a creator user
const sampleAuthoredMCQs: MCQ[] = [
  {
    id: 'creator-mcq-1', 
    question: 'What is the primary function of a CPU in a computer?',
    options: ['Store data long-term', 'Execute instructions', 'Display graphics', 'Connect to network'],
    correctAnswer: 'Execute instructions',
    explanation: 'The Central Processing Unit (CPU) is the brain of the computer, responsible for executing program instructions.',
    topic: 'Computer Science',
    difficulty: 'easy',
  },
  {
    id: 'creator-mcq-2', 
    question: 'Which of these is a version control system?',
    options: ['Photoshop', 'Git', 'Excel', 'WordPress'],
    correctAnswer: 'Git',
    explanation: 'Git is a widely-used distributed version control system for tracking changes in source code during software development.',
    topic: 'Software Development',
    difficulty: 'medium',
  }
];


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('testChampionUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('testChampionUser');
    }
    setLoading(false);
  }, []);


  const login = (email: string, name?: string, rolesToSet?: UserMode[]) => {
    setLoading(true);
    let userToPersist: User | null = null;
    const existingUser = user; // User from state, potentially loaded from localStorage

    if (name !== undefined) { // Indicates a signup or an update from onboarding profile page
      const userId = existingUser?.id || `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const currentRoles = rolesToSet !== undefined ? rolesToSet : (existingUser?.roles || []);
      const isNowCreator = currentRoles.includes('creator');
      let authoredMcqsForUser: MCQ[] = existingUser?.mcqsAuthored || [];

      if (isNowCreator && (!existingUser || !existingUser.isCreator)) { // If becoming a creator OR new creator
        authoredMcqsForUser = sampleAuthoredMCQs.map(mcq => ({
          ...mcq,
          creatorId: userId,
          creatorName: name,
          id: `${userId}-${mcq.id.replace(/creator-mcq-/g, '') || mcq.id}`
        }));
      }
      
      userToPersist = {
        ...(existingUser || {}), // Spread existing user data if available
        id: userId,
        email,
        name,
        roles: currentRoles,
        isCreator: isNowCreator,
        isNewUser: existingUser ? existingUser.isNewUser : true, // Retain isNewUser if updating, else true for new signup
        streak: existingUser?.streak || 0,
        following: existingUser?.following || [],
        points: existingUser?.points || 0,
        questionsAnsweredCount: existingUser?.questionsAnsweredCount || 0,
        mcqsAuthored: authoredMcqsForUser,
        testsAuthored: existingUser?.testsAuthored || [],
      };
       // If rolesToSet is undefined, it means it's an initial signup, so roles default to empty, isNewUser is true.
      if (rolesToSet === undefined) {
        userToPersist.roles = [];
        userToPersist.isCreator = false;
        userToPersist.isNewUser = true;
      }

    } else { // SIGN-IN attempt (name is undefined)
      if (existingUser && existingUser.email === email) {
        userToPersist = existingUser;
      } else {
        // Mock: if sign-in email doesn't match stored, treat as a new user for demo.
        // Real app: show error in AuthForm.
        const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        userToPersist = {
            id: userId, email, name: email.split('@')[0],
            roles: [], isCreator: false, isNewUser: true, // Default to no roles, needs onboarding
            streak: 0, following: [], points: 0, questionsAnsweredCount: 0, mcqsAuthored: [], testsAuthored: [],
        };
      }
    }

    if (userToPersist) {
      setUser(userToPersist);
      localStorage.setItem('testChampionUser', JSON.stringify(userToPersist));
    }
    
    // Clear selected mode only if it's an initial signup or explicit sign-in without pre-set roles.
    // If called from onboarding to set roles, don't clear mode yet.
    if (name === undefined || (name !== undefined && rolesToSet === undefined)) {
      localStorage.removeItem('testChampionUserMode');
    }
    setLoading(false);

    // If it's an initial signup (name provided, but rolesToSet were not), redirect to onboarding.
    // Otherwise, general redirection logic is in src/app/page.tsx.
    if (name !== undefined && rolesToSet === undefined) {
        router.push('/onboarding/terms');
    } else if (name === undefined) { // This is a sign-in attempt
        router.push('/'); 
    }
    // If called from onboarding profile page (name and rolesToSet are provided),
    // the redirection will be handled by completeOnboarding called subsequently.
  };
  
  const completeOnboarding = () => {
    setUser(currentUser => {
      if (!currentUser) return null;
      const updatedUser = { ...currentUser, isNewUser: false };
      localStorage.setItem('testChampionUser', JSON.stringify(updatedUser));
      
      // Redirection logic after onboarding is complete
      if (updatedUser.roles && updatedUser.roles.length > 1) {
        router.push('/select-role');
      } else if (updatedUser.roles && updatedUser.roles.length === 1) {
        localStorage.setItem('testChampionUserMode', updatedUser.roles[0]);
        router.push('/dashboard');
      } else {
        // This case (no roles after onboarding) should ideally not happen if profile page enforces role selection.
        // As a fallback, redirect to profile page again or dashboard.
        router.push('/dashboard'); 
      }
      return updatedUser;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('testChampionUser');
    localStorage.removeItem('testChampionUserMode');
    router.push('/auth/sign-in');
  };

  const toggleFollow = useCallback((creatorId: string) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      const isCurrentlyFollowing = currentUser.following?.includes(creatorId);
      const updatedFollowing = isCurrentlyFollowing
        ? currentUser.following?.filter(id => id !== creatorId)
        : [...(currentUser.following || []), creatorId];

      const updatedUser = { ...currentUser, following: updatedFollowing };
      localStorage.setItem('testChampionUser', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  const updateUserStats = useCallback((stats: Partial<Pick<User, 'points' | 'questionsAnsweredCount' | 'streak'>>) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      const updatedUser = { ...currentUser, ...stats };
      localStorage.setItem('testChampionUser', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  const addTest = useCallback((testData: Omit<Test, 'id' | 'creatorId' | 'createdAt'>) => {
    setUser(currentUser => {
      if (!currentUser || !currentUser.isCreator) return currentUser;
      const newTest: Test = {
        ...testData,
        id: `test-${Date.now().toString()}`,
        creatorId: currentUser.id,
        createdAt: new Date().toISOString(),
      };
      const updatedUser = {
        ...currentUser,
        testsAuthored: [...(currentUser.testsAuthored || []), newTest],
      };
      localStorage.setItem('testChampionUser', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  const addMcq = useCallback((mcqData: Omit<MCQ, 'id' | 'creatorId' | 'creatorName'>) => {
    setUser(currentUser => {
      if (!currentUser || !currentUser.isCreator) return currentUser;
      const newMcq: MCQ = {
        ...mcqData,
        id: `mcq-${Date.now().toString()}-${Math.random().toString(36).substring(7)}`,
        creatorId: currentUser.id,
        creatorName: currentUser.name,
      };
      const updatedUser = {
        ...currentUser,
        mcqsAuthored: [...(currentUser.mcqsAuthored || []), newMcq],
      };
      localStorage.setItem('testChampionUser', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);


  return (
    <AuthContext.Provider value={{ user, loading, login, logout, toggleFollow, updateUserStats, addTest, addMcq, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
