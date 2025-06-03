"use client";

import type { User } from '@/types';
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Simulate fetching user from localStorage or API
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
    const newUser: User = { id: Date.now().toString(), email, name: name || email.split('@')[0], streak: 0 };
    setUser(newUser);
    localStorage.setItem('testChampionUser', JSON.stringify(newUser));
    router.push('/dashboard');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('testChampionUser');
    router.push('/auth/sign-in');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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
