"use client";

import type { UserMode } from '@/types';
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface UserModeContextType {
  mode: UserMode;
  toggleMode: () => void;
  setMode: (newMode: UserMode) => void;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

export function UserModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<UserMode>('student');

  useEffect(() => {
    const storedMode = localStorage.getItem('testChampionUserMode') as UserMode | null;
    if (storedMode) {
      setModeState(storedMode);
    }
  }, []);

  const setMode = (newMode: UserMode) => {
    setModeState(newMode);
    localStorage.setItem('testChampionUserMode', newMode);
  };

  const toggleMode = () => {
    setMode(mode === 'student' ? 'creator' : 'student');
  };

  return (
    <UserModeContext.Provider value={{ mode, toggleMode, setMode }}>
      {children}
    </UserModeContext.Provider>
  );
}

export function useUserMode() {
  const context = useContext(UserModeContext);
  if (context === undefined) {
    throw new Error('useUserMode must be used within a UserModeProvider');
  }
  return context;
}
