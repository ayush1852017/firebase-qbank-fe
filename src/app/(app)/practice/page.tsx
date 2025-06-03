"use client";

import { PracticeFeed } from '@/components/practice/practice-feed';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PracticePage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardTitle className="text-3xl font-headline text-primary">Practice Arena</CardTitle>
          <CardDescription className="text-muted-foreground text-lg">
            Hone your skills with a variety of questions.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <PracticeFeed />
        </CardContent>
      </Card>
    </div>
  );
}
