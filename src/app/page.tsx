"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SplashLoader } from '@/components/splash-loader';
import { useAuth } from '@/contexts/auth-context';

export default function HomePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000); // Minimum splash screen duration

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showSplash && !authLoading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/auth/sign-in');
      }
    }
  }, [showSplash, authLoading, user, router]);

  return <SplashLoader />;
}
