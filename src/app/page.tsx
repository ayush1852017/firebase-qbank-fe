
"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SplashLoader } from '@/components/splash-loader';
import { useAuth } from '@/contexts/auth-context';

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500); // Minimum splash screen duration

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showSplash || authLoading) {
      return; // Wait for splash and auth to finish
    }

    if (!user) {
      // If not logged in and not on an auth page already, redirect to sign-in
      if (!pathname.startsWith('/auth')) {
        router.replace('/auth/sign-in');
      }
      return;
    }

    // User is logged in, handle redirection logic
    if (user.isNewUser) {
      if (!pathname.startsWith('/onboarding')) {
        router.replace('/onboarding/terms');
      }
      return;
    }

    // User is not new, check for role selection if multi-role
    const userModeSelected = localStorage.getItem('testChampionUserMode');
    if (user.roles && user.roles.length > 1 && !userModeSelected) {
      if (pathname !== '/select-role') {
        router.replace('/select-role');
      }
      return;
    }

    // User is not new, and either has a single role or has selected a mode
    // If on auth, onboarding, or select-role pages, redirect to dashboard
    if (pathname.startsWith('/auth') || pathname.startsWith('/onboarding') || pathname === '/select-role') {
      router.replace('/dashboard');
      return;
    }

    // Otherwise, user is on a valid app page, no redirection needed from here.
    // The AppLayout will handle redirection if user somehow logs out while on an app page.

  }, [showSplash, authLoading, user, router, pathname]);

  // Show splash while loading or if redirection decision is pending
  if (showSplash || authLoading) {
    return <SplashLoader />;
  }

  // If execution reaches here, it means it's a page that should render its content
  // (e.g. auth pages when no user, or app pages when user is fully set up)
  // However, for the root '/' page, we primarily use it for redirection.
  // If a specific component should render at '/', it would go here.
  // For now, SplashLoader covers the "loading/redirecting" state.
  return <SplashLoader />;
}
