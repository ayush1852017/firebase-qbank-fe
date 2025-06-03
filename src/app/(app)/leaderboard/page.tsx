"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Users, ListOrdered, Star } from "lucide-react";
import type { User } from "@/types"; // Assuming User type includes points and questionsAnsweredCount
import { useAuth } from "@/contexts/auth-context";

interface LeaderboardUser extends Partial<User> {
  rank: number;
  // Ensure points and questionsAnsweredCount are numbers for sorting/display
  points: number;
  questionsAnsweredCount: number;
}

// Static mock data for the leaderboard
const mockLeaderboardUsers: LeaderboardUser[] = [
  { rank: 1, id: 'user101', name: 'Alice Wonder', points: 15200, questionsAnsweredCount: 750, email: 'alice@example.com' },
  { rank: 2, id: 'user102', name: 'Bob The Builder', points: 14850, questionsAnsweredCount: 720, email: 'bob@example.com' },
  { rank: 3, id: 'user103', name: 'Charlie Brown', points: 13500, questionsAnsweredCount: 680, email: 'charlie@example.com' },
  { rank: 4, id: 'user104', name: 'Diana Prince', points: 12200, questionsAnsweredCount: 610, email: 'diana@example.com' },
  { rank: 5, id: 'user105', name: 'Edward Scissorhands', points: 11950, questionsAnsweredCount: 590, email: 'edward@example.com' },
  { rank: 6, id: 'user106', name: 'Fiona Apple', points: 10800, questionsAnsweredCount: 530, email: 'fiona@example.com' },
  { rank: 7, id: 'user107', name: 'George Costanza', points: 9500, questionsAnsweredCount: 480, email: 'george@example.com' },
  { rank: 8, id: 'user108', name: 'Harry Potter', points: 8900, questionsAnsweredCount: 450, email: 'harry@example.com' },
  { rank: 9, id: 'user109', name: 'Ivy Green', points: 7600, questionsAnsweredCount: 380, email: 'ivy@example.com' },
  { rank: 10, id: 'user110', name: 'Jack Sparrow', points: 7200, questionsAnsweredCount: 350, email: 'jack@example.com' },
].sort((a, b) => b.points - a.points).map((user, index) => ({ ...user, rank: index + 1 }));


const getInitials = (name?: string) => {
  if (!name) return '??';
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export default function LeaderboardPage() {
  const { user: currentUser } = useAuth();

  const isCurrentUser = (userId?: string) => currentUser?.id === userId;

  return (
    <div className="space-y-8">
      <Card className="shadow-xl rounded-xl overflow-hidden bg-gradient-to-r from-primary/10 to-accent/10">
        <CardHeader className="flex flex-row items-center space-x-4">
          <ListOrdered className="h-12 w-12 text-primary" />
          <div>
            <CardTitle className="text-3xl font-headline text-primary">Leaderboard</CardTitle>
            <CardDescription className="text-muted-foreground text-lg">
              See how you rank against other learners!
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card className="shadow-lg rounded-xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16 text-center font-semibold text-primary">Rank</TableHead>
                <TableHead className="font-semibold text-primary">Player</TableHead>
                <TableHead className="text-right font-semibold text-primary">Points</TableHead>
                <TableHead className="text-right font-semibold text-primary hidden sm:table-cell">Questions Answered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLeaderboardUsers.map((player) => (
                <TableRow key={player.id} className={isCurrentUser(player.id) ? "bg-accent/10 hover:bg-accent/20" : "hover:bg-muted/30"}>
                  <TableCell className="text-center font-bold text-lg">
                    {player.rank === 1 && <Trophy className="h-6 w-6 text-yellow-500 inline-block" />}
                    {player.rank === 2 && <Trophy className="h-6 w-6 text-gray-400 inline-block" />}
                    {player.rank === 3 && <Trophy className="h-6 w-6 text-orange-400 inline-block" />}
                    {player.rank > 3 && player.rank}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 border-2 border-primary/30">
                        <AvatarImage src={`https://placehold.co/40x40.png?text=${getInitials(player.name)}`} alt={player.name || 'User'} data-ai-hint="avatar profile small" />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">{getInitials(player.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{player.name} {isCurrentUser(player.id) && <span className="text-xs text-accent ml-1">(You)</span>}</p>
                        <p className="text-xs text-muted-foreground hidden md:block">{player.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-primary">{player.points?.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-muted-foreground hidden sm:table-cell">{player.questionsAnsweredCount?.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
         {mockLeaderboardUsers.length === 0 && (
            <CardContent className="text-center py-10">
                 <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">The leaderboard is currently empty.</p>
                <p className="text-sm text-muted-foreground">Start practicing to get on the board!</p>
            </CardContent>
        )}
      </Card>

      {currentUser && !mockLeaderboardUsers.find(u => u.id === currentUser.id) && (
         <Card className="shadow-md rounded-xl mt-6 p-4 bg-primary/5 border-primary/20">
            <CardTitle className="text-lg text-primary mb-2 flex items-center"><Star className="h-5 w-5 mr-2 text-yellow-500"/>Your Current Standing</CardTitle>
            <div className="flex justify-between items-center text-sm">
                <p className="text-foreground">You are not in the top {mockLeaderboardUsers.length} yet. Keep practicing!</p>
                <div className="text-right">
                    <p className="font-semibold text-primary">{currentUser.points || 0} Points</p>
                    <p className="text-muted-foreground">{currentUser.questionsAnsweredCount || 0} Questions</p>
                </div>
            </div>
        </Card>
      )}
    </div>
  );
}
