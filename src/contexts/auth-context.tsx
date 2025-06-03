"use client";

import type { User, MCQ, Test } from '@/types'; // Added Test import
import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  toggleFollow: (creatorId: string) => void;
  updateUserStats?: (stats: Partial<Pick<User, 'points' | 'questionsAnsweredCount' | 'streak'>>) => void;
  addTest?: (testData: Omit<Test, 'id' | 'creatorId' | 'createdAt'>) => void;
  addMcq?: (mcqData: Omit<MCQ, 'id' | 'creatorId' | 'creatorName'>) => void;
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

  useEffect(() => {
    if (!loading) {
      const isAuthPage = pathname?.startsWith('/auth');
      if (!user && !isAuthPage && pathname !== '/') {
        router.push('/auth/sign-in');
      } else if (user && isAuthPage) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, pathname, router]);


  const login = (email: string, name?: string) => {
    const userId = Date.now().toString();
    const userName = name || email.split('@')[0];
    const isCreator = Math.random() > 0.5; 

    let authoredMcqsForUser: MCQ[] = [];
    if (isCreator) {
      authoredMcqsForUser = sampleAuthoredMCQs.map(mcq => ({
        ...mcq,
        creatorId: userId,
        creatorName: userName,
        id: `${userId}-${mcq.id.split('-').slice(2).join('-') || mcq.id}` // Ensure unique ID based on user
      }));
    }

    const newUser: User = { 
      id: userId, 
      email, 
      name: userName, 
      streak: Math.floor(Math.random() * 10),
      following: [],
      isCreator: isCreator,
      points: Math.floor(Math.random() * 1000),
      questionsAnsweredCount: Math.floor(Math.random() * 200),
      mcqsAuthored: authoredMcqsForUser,
      testsAuthored: [], // Initialize testsAuthored
    };
    setUser(newUser);
    localStorage.setItem('testChampionUser', JSON.stringify(newUser));
    router.push('/dashboard');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('testChampionUser');
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
    <AuthContext.Provider value={{ user, loading, login, logout, toggleFollow, updateUserStats, addTest, addMcq }}>
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
