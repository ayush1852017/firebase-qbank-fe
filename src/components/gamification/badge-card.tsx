import type { BadgeType } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BadgeCardProps {
  badge: BadgeType;
}

export function BadgeCard({ badge }: BadgeCardProps) {
  const { Icon } = badge;
  return (
    <Card 
      className={cn(
        "shadow-lg rounded-xl text-center transition-all duration-300 ease-in-out",
        badge.achieved ? "bg-gradient-to-br from-accent/20 to-primary/20 border-accent/50 transform hover:scale-105 hover:shadow-2xl" : "bg-muted/30 border-muted/50 opacity-70"
      )}
    >
      <CardHeader className="items-center pb-2">
        <div className={cn(
          "p-3 rounded-full mb-3 inline-block",
          badge.achieved ? "bg-accent text-accent-foreground" : "bg-muted-foreground/20 text-muted-foreground"
        )}>
          <Icon className="h-8 w-8" />
        </div>
        <CardTitle className={cn("text-lg font-semibold", badge.achieved ? "text-accent-foreground" : "text-foreground")}>{badge.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className={cn("text-xs", badge.achieved ? "text-accent-foreground/80" : "text-muted-foreground")}>
          {badge.description}
        </CardDescription>
        {!badge.achieved && (
          <p className="text-xs text-muted-foreground mt-2 italic">Not yet achieved</p>
        )}
      </CardContent>
    </Card>
  );
}
