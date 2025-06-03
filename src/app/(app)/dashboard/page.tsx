"use client";

import { useUserMode } from '@/contexts/user-mode-context';
import { PracticeFeed } from '@/components/practice/practice-feed';
import { StreakCounter } from '@/components/gamification/streak-counter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Edit3, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import type { CreatorStats } from '@/types';
import { useEffect, useState } from 'react';

const initialCreatorStats: CreatorStats = {
  mcqsCreated: 15,
  mcqsPublished: 10,
  followers: 120,
  earnings: 250.75,
};


export default function DashboardPage() {
  const { mode } = useUserMode();
  const [creatorStats, setCreatorStats] = useState<CreatorStats | null>(null);

  useEffect(() => {
    if (mode === 'creator') {
      // Simulate fetching creator stats
      setCreatorStats(initialCreatorStats);
    }
  }, [mode]);

  return (
    <div className="space-y-8">
      {mode === 'student' && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StreakCounter />
            {/* Placeholder for other student stats cards */}
            <Card className="shadow-lg rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Questions Answered</CardTitle>
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">125</div>
                <p className="text-xs text-muted-foreground mt-1">+20 this week</p>
              </CardContent>
            </Card>
             <Card className="shadow-lg rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Overall Accuracy</CardTitle>
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">85%</div>
                <p className="text-xs text-muted-foreground mt-1">Keep practicing!</p>
              </CardContent>
            </Card>
             <Card className="shadow-lg rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Badges Earned</CardTitle>
                <Trophy className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">5</div>
                <Link href="/achievements" className="text-xs text-primary hover:underline mt-1 block">View Badges</Link>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-xl rounded-xl overflow-hidden">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-2xl font-headline text-primary">Daily Practice</CardTitle>
              <CardDescription className="text-muted-foreground">
                Challenge yourself with new questions tailored to your progress.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <PracticeFeed />
            </CardContent>
          </Card>
        </>
      )}

      {mode === 'creator' && creatorStats && (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-headline text-primary">Creator Dashboard</h1>
            <Link href="/mcq-creator/new" passHref>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md hover:shadow-lg">
                <PlusCircle className="mr-2 h-5 w-5" /> Create New MCQ
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="MCQs Created" value={creatorStats.mcqsCreated.toString()} icon={Edit3} />
            <StatCard title="MCQs Published" value={creatorStats.mcqsPublished.toString()} icon={BarChart3} />
            <StatCard title="Followers" value={creatorStats.followers.toString()} icon={UsersIcon} />
            <StatCard title="Earnings" value={`$${creatorStats.earnings.toFixed(2)}`} icon={DollarSignIcon} />
          </div>
          <Card className="shadow-xl rounded-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-headline text-primary">Your MCQs</CardTitle>
              <CardDescription>Manage and review your created multiple-choice questions.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder for MCQ list or management table */}
              <p className="text-muted-foreground">MCQ management interface will be here. You can view, edit, and track the status of your questions.</p>
               <div className="mt-6 text-center">
                 <img src="https://placehold.co/600x300.png" alt="Creator Content Placeholder" className="rounded-lg shadow-md mx-auto" data-ai-hint="data analytics chart" />
               </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}


// Helper components for Creator Dashboard
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
}

function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <Card className="shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-primary">{value}</div>
      </CardContent>
    </Card>
  );
}

// Placeholder icons
const Trophy = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2.5c3.59 0 6.5 2.91 6.5 6.5s-2.91 6.5-6.5 6.5S5.5 12.59 5.5 9 8.41 2.5 12 2.5zM5.5 16H4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1m14.5 0h1a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-1.5M12 16v5.5m-3-2h6"/></svg>
);
const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const DollarSignIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);

