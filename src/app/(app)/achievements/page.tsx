"use client";

import { BadgeCard } from '@/components/gamification/badge-card';
import type { BadgeType } from '@/types';
import { Award, BookOpen, Brain, CalendarDays, Zap, BarChart, Target, Star, TrendingUp, Coffee } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const allBadges: BadgeType[] = [
  { id: '1', name: 'First Steps', description: 'Completed your first practice session.', Icon: Award, achieved: false, category: 'Getting Started' },
  { id: '2', name: 'Quick Learner', description: 'Answered 10 questions correctly.', Icon: Brain, achieved: false, category: 'Milestones' },
  { id: '3', name: 'Daily Dedication', description: 'Maintained a 3-day streak.', Icon: CalendarDays, achieved: false, category: 'Streaks' },
  { id: '4', name: 'Topic Explorer', description: 'Practiced questions from 3 different topics.', Icon: BookOpen, achieved: false, category: 'Exploration' },
  { id: '5', name: 'Speedster', description: 'Completed a session in under 5 minutes.', Icon: Zap, achieved: false, category: 'Performance' },
  { id: '6', name: 'Accuracy Ace', description: 'Achieved 90% accuracy in a session.', Icon: Target, achieved: false, category: 'Performance' },
  { id: '7', name: 'Weekend Warrior', description: 'Practiced on a weekend.', Icon: Coffee, achieved: false, category: 'Streaks' },
  { id: '8', name: 'Rising Star', description: 'Earned 100 points.', Icon: Star, achieved: false, category: 'Milestones' },
  { id: '9', name: 'Consistent Performer', description: 'Completed 5 practice sessions.', Icon: TrendingUp, achieved: false, category: 'Milestones' },
  { id: '10',name: 'Perfect Score', description: 'Achieved 100% in a practice session.', Icon: BarChart, achieved: false, category: 'Performance' }
];

export default function AchievementsPage() {
  const [achievedBadges, setAchievedBadges] = useState<BadgeType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching achieved badges for the user
    // For demo, randomly mark some as achieved
    const updatedBadges = allBadges.map(badge => ({
      ...badge,
      achieved: Math.random() > 0.5 
    }));
    setAchievedBadges(updatedBadges);
    setLoading(false);
  }, []);
  
  const badgeCategories = Array.from(new Set(achievedBadges.map(b => b.category)));

  if (loading) {
    return (
       <div className="space-y-8">
        <Card className="shadow-xl rounded-xl animate-pulse">
          <CardHeader><div className="h-8 bg-muted rounded w-1/3"></div></CardHeader>
          <CardContent><div className="h-6 bg-muted rounded w-1/2"></div></CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="shadow-lg rounded-xl animate-pulse">
              <CardHeader className="items-center pb-2">
                <div className="p-3 rounded-full mb-3 inline-block bg-muted h-14 w-14"></div>
                <div className="h-6 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-full mb-1"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-8">
      <Card className="shadow-xl rounded-xl overflow-hidden bg-gradient-to-r from-primary/10 to-accent/10">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">Your Achievements</CardTitle>
          <CardDescription className="text-muted-foreground text-lg">
            Track your progress and celebrate your learning milestones.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-foreground">You've earned <span className="font-bold text-accent">{achievedBadges.filter(b => b.achieved).length}</span> out of <span className="font-bold">{achievedBadges.length}</span> available badges. Keep up the great work!</p>
        </CardContent>
      </Card>

      {badgeCategories.map(category => (
        <div key={category}>
          <h2 className="text-2xl font-semibold text-foreground mb-4 pb-2 border-b-2 border-primary/20">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {achievedBadges.filter(b => b.category === category).map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      ))}
      
       {achievedBadges.filter(b => b.achieved).length === 0 && (
        <Card className="shadow-lg rounded-xl text-center p-8">
          <CardContent>
            <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">No badges earned yet.</p>
            <p className="text-sm text-muted-foreground">Start practicing to unlock achievements!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
