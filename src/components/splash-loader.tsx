"use client";

import { BrainCircuit } from 'lucide-react';
import { useEffect, useState } from 'react';

export function SplashLoader() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <div className="flex items-center space-x-4 mb-6">
        <BrainCircuit className="h-16 w-16 text-primary animate-subtle-pulse" />
        <h1 className="text-5xl font-headline font-bold text-primary">Test Champion</h1>
      </div>
      <div className="flex items-center space-x-2 text-lg text-muted-foreground">
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span>Loading{dots}</span>
      </div>
    </div>
  );
}
