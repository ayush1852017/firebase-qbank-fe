
"use client";

import type { User, MCQ, Test, UserMode } from '@/types';
import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, name?: string, roles?: UserMode[]) => void;
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
    id: 'creator-mcq-1', // Base ID, will be prefixed
    question: 'What is the primary function of a CPU in a computer?',
    options: ['Store data long-term', 'Execute instructions', 'Display graphics', 'Connect to network'],
    correctAnswer: 'Execute instructions',
    explanation: 'The Central Processing Unit (CPU) is the brain of the computer, responsible for executing program instructions.',
    topic: 'Computer Science',
    difficulty: 'easy',
  },
  {
    id: 'creator-mcq-2', // Base ID, will be prefixed
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


  const login = (email: string, name?: string, newSignupRoles?: UserMode[]) => {
    setLoading(true);
    let userToPersist: User | null = null;

    if (name && newSignupRoles && newSignupRoles.length > 0) { // SIGN-UP
      const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const isCreator = newSignupRoles.includes('creator');
      let authoredMcqsForUser: MCQ[] = [];

      if (isCreator) {
        authoredMcqsForUser = sampleAuthoredMCQs.map(mcq => ({
          ...mcq,
          creatorId: userId,
          creatorName: name,
          // Create a more unique ID for the MCQ instance for this user
          id: `${userId}-${mcq.id.replace(/creator-mcq-/g, '') || mcq.id}`
        }));
      }

      userToPersist = {
        id: userId,
        email,
        name,
        roles: newSignupRoles,
        isCreator,
        isNewUser: true, // Critical for triggering onboarding
        streak: 0,
        following: [],
        points: 0,
        questionsAnsweredCount: 0,
        mcqsAuthored: authoredMcqsForUser,
        testsAuthored: [],
      };
    } else { // SIGN-IN attempt
      // The AuthProvider's useEffect has already attempted to load a user into the `user` state.
      // If this `login` call is for sign-in, we use that loaded `user` if the email matches.
      if (user && user.email === email) {
        userToPersist = user; // Use the already loaded user from localStorage
                               // Their `isNewUser` and `roles` will be preserved.
      } else {
        // This case means:
        // 1. No user was in localStorage (user is null).
        // 2. A user was in localStorage, but the email from AuthForm doesn't match (mock "wrong email").
        // For this mock, if it's a sign-in attempt and no matching user is found,
        // we'll create a default new user profile, which will trigger onboarding.
        // A real app would show an error in AuthForm ("User not found" or "Incorrect password").
        const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        userToPersist = {
            id: userId,
            email,
            name: email.split('@')[0],
            roles: ['student'], // Default to student if "sign-in" fails to find user
            isCreator: false,
            isNewUser: true, // Treat as new because they weren't "found" with prior state
            streak: 0, following: [], points: 0, questionsAnsweredCount: 0, mcqsAuthored: [], testsAuthored: [],
        };
      }
    }

    if (userToPersist) {
      setUser(userToPersist); // Update context state
      localStorage.setItem('testChampionUser', JSON.stringify(userToPersist)); // Persist
    }
    
    localStorage.removeItem('testChampionUserMode'); // Always clear selected mode for a new session
    setLoading(false);
    router.push('/'); // Central navigation logic in src/app/page.tsx will handle next steps
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('testChampionUser');
    localStorage.removeItem('testChampionUserMode');
    router.push('/auth/sign-in');
  };
  
  const completeOnboarding = () => {
    setUser(currentUser => {
      if (!currentUser) return null;
      const updatedUser = { ...currentUser, isNewUser: false };
      localStorage.setItem('testChampionUser', JSON.stringify(updatedUser));
      
      if (updatedUser.roles && updatedUser.roles.length > 1) {
        router.push('/select-role');
      } else if (updatedUser.roles && updatedUser.roles.length === 1) {
        localStorage.setItem('testChampionUserMode', updatedUser.roles[0]);
        // Also update context if UserModeProvider needs it explicitly, though it reads from localStorage
        router.push('/dashboard');
      } else {
        router.push('/dashboard'); // Fallback
      }
      return updatedUser;
    });
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

