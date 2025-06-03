"use client";

import React, { type ReactNode } from 'react';
import { AuthProvider } from '@/contexts/auth-context';
import { UserModeProvider } from '@/contexts/user-mode-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserModeProvider>
          {children}
        </UserModeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
