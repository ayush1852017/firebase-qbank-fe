"use client";

import { Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context'; // Assuming streak is part of user context

export function StreakCounter() {
  const { user } = useAuth();
  const streak = user?.streak ?? 0; // Default to 0 if not available

  return (
    <Card className="shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
        <Flame className={`h-5 w-5 ${streak > 0 ? 'text-orange-500 animate-pulse' : 'text-muted-foreground'}`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-primary">{streak} Days</div>
        <p className="text-xs text-muted-foreground mt-1">
          {streak > 0 ? "Keep up the great work!" : "Start practicing to build your streak!"}
        </p>
      </CardContent>
    </Card>
  );
}
