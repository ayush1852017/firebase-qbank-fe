
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

    // If user is fully set up and on the root path, redirect to dashboard.
    if (pathname === '/') {
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

  // This state means redirection logic has completed, and if the current path
  // is not the root page, it should allow the page content to render.
  // For the root page itself, if it reaches here, it implies an unhandled case or
  // it's the very brief moment before a redirect takes effect.
  // SplashLoader is a safe fallback.
  return <SplashLoader />;
}
