"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarInset, SidebarRail } from '@/components/ui/sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { MainNav } from '@/components/layout/main-nav';
import { Button } from '@/components/ui/button';
import { LogOut, Settings } from 'lucide-react';
import { SplashLoader } from '@/components/splash-loader';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/sign-in');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <SplashLoader />; // Or any other loading state
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="p-4 items-center justify-center">
          {/* Can add a small logo or icon here for collapsed state */}
        </SidebarHeader>
        <SidebarContent className="p-2">
          <MainNav />
        </SidebarContent>
        <SidebarFooter className="p-2">
           <Button variant="ghost" onClick={logout} className="w-full justify-start text-muted-foreground hover:text-destructive">
            <LogOut className="mr-2 h-5 w-5" />
            <span>Log Out</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarRail />
      <SidebarInset className="flex flex-col">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
