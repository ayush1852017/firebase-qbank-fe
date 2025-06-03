"use client";

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserIconLucide, Users, BookOpenCheck, Mail, Award, Loader2, ShieldAlert } from 'lucide-react'; // Renamed User to avoid conflict with type
import { useEffect, useState } from 'react';
import type { User } from '@/types';

// Simulate fetching creator data - in a real app, this would be an API call
// Store this outside the component or use React.useMemo if it were complex and inline
const sampleCreators: Record<string, Partial<User>> = {
  'creator1': { name: 'Dr. KnowItAll', email: 'dr.know@example.com', id: 'creator1', isCreator: true },
  'creator2': { name: 'QuizMaster Flex', email: 'qmaster@example.com', id: 'creator2', isCreator: true },
  'user1': { name: 'Learner Luke', email: 'luke@example.com', id: 'user1', isCreator: false }, // Example non-creator
};

const getCreatorDetails = async (creatorId: string): Promise<Partial<User> | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  if (sampleCreators[creatorId]) {
    return sampleCreators[creatorId];
  }
  // Fallback for dynamic IDs not in sample, assume they are creators for demo
  return { name: `Creator ${creatorId.substring(0,8)}...`, id: creatorId, email: `${creatorId.substring(0,8)}@example.com`, isCreator: true };
};


export default function CreatorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const creatorId = params.creatorId as string;
  const { user: currentUser, toggleFollow, loading: authLoading } = useAuth();
  const [creator, setCreator] = useState<Partial<User> | null>(null);
  const [isLoadingCreator, setIsLoadingCreator] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (creatorId) {
      setIsLoadingCreator(true);
      setError(null);
      getCreatorDetails(creatorId)
        .then(data => {
          if (data && data.isCreator) {
            setCreator(data);
          } else if (data && !data.isCreator) {
            setError(`${data.name || 'This user'} is not a content creator.`);
            setCreator(null);
          } else {
            setError('Creator profile not found.');
            setCreator(null);
          }
        })
        .catch(() => setError('Failed to load creator profile.'))
        .finally(() => setIsLoadingCreator(false));
    } else {
        router.push('/dashboard'); // Redirect if no creatorId
    }
  }, [creatorId, router]);
  
  const getInitials = (nameStr?: string) => {
    if (!nameStr) return 'C';
    const names = nameStr.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return nameStr.substring(0, 2).toUpperCase();
  };

  if (authLoading || isLoadingCreator) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading creator profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto mt-10 text-center shadow-lg rounded-xl">
        <CardHeader>
            <ShieldAlert className="h-16 w-16 text-destructive mx-auto mb-4" />
            <CardTitle className="text-2xl text-destructive">Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
        <CardFooter>
            <Button onClick={() => router.back()} variant="outline" className="w-full">Go Back</Button>
        </CardFooter>
      </Card>
    );
  }
  
  if (!creator) {
     return (
      <Card className="max-w-md mx-auto mt-10 text-center shadow-lg rounded-xl">
        <CardHeader>
            <UserIconLucide className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="text-2xl">Creator Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">The creator profile you are looking for does not exist or could not be loaded.</p>
        </CardContent>
         <CardFooter>
            <Button onClick={() => router.push('/dashboard')} variant="outline" className="w-full">Go to Dashboard</Button>
        </CardFooter>
      </Card>
    );
  }


  const isFollowing = currentUser?.following?.includes(creatorId);

  const handleFollowToggle = () => {
    if (!currentUser) {
      router.push('/auth/sign-in?redirect=/creators/' + creatorId);
      return;
    }
    toggleFollow(creatorId);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <Card className="shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 p-8">
          <div className="flex flex-col md:flex-row items-center md:space-x-6">
             <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-lg">
              <AvatarImage src={`https://placehold.co/128x128.png?text=${getInitials(creator.name)}`} alt={creator.name || 'Creator'} data-ai-hint="profile avatar large"/>
              <AvatarFallback className="text-4xl bg-primary text-primary-foreground font-semibold">
                {getInitials(creator.name)}
              </AvatarFallback>
            </Avatar>
            <div className="mt-4 md:mt-0 text-center md:text-left">
              <CardTitle className="text-3xl md:text-4xl font-headline text-primary">{creator.name || 'Creator Profile'}</CardTitle>
              {creator.email && (
                <CardDescription className="text-lg text-muted-foreground flex items-center justify-center md:justify-start">
                   <Mail className="h-4 w-4 mr-2" /> {creator.email}
                </CardDescription>
              )}
              {currentUser && currentUser.id !== creatorId && (
                <Button
                  onClick={handleFollowToggle}
                  variant={isFollowing ? "outline" : "default"}
                  className="mt-4 w-full md:w-auto text-md py-2 px-5 shadow-md hover:shadow-lg bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
              )}
              {currentUser && currentUser.id === creatorId && (
                 <p className="text-sm text-muted-foreground mt-2">This is your public profile page.</p>
              )}
               {!currentUser && (
                <Button onClick={() => router.push('/auth/sign-in?redirect=/creators/' + creatorId)} className="mt-4 bg-accent hover:bg-accent/90">
                  Sign in to Follow
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <h3 className="text-xl font-semibold text-foreground mb-4">Creator Stats</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <StatItem icon={BookOpenCheck} label="MCQs Created" value="50+" />
            <StatItem icon={Users} label="Followers" value="1.2k+" />
            <StatItem icon={Award} label="Avg. Rating" value="4.8/5" />
             {/* Add more placeholder stats as needed */}
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-foreground mb-2">About {creator.name?.split(' ')[0] || 'Creator'}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {creator.name || 'This creator'} is passionate about sharing knowledge and helping learners achieve their goals. Stay tuned for more exciting content! (This is a placeholder bio).
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">Content by {creator.name?.split(' ')[0] || 'Creator'}</CardTitle>
            <CardDescription>Browse MCQs and other learning materials from this creator.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground mb-4">A list of MCQs by this creator will appear here.</p>
            {/* Placeholder for content list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1,2,3,4].map(i => (
                    <div key={i} className="border p-4 rounded-lg bg-muted/30 hover:shadow-md transition-shadow">
                        <h4 className="font-semibold text-primary mb-1">Sample MCQ Title {i}</h4>
                        <p className="text-xs text-muted-foreground">Topic: Sample Topic • Difficulty: Medium</p>
                        <img src={`https://placehold.co/300x150.png?text=MCQ${i}`} data-ai-hint="quiz item" alt={`MCQ Placeholder ${i}`} className="mt-2 rounded shadow-sm w-full aspect-[2/1] object-cover"/>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface StatItemProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
}
function StatItem({ icon: Icon, label, value }: StatItemProps) {
  return (
    <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg shadow-sm">
      <Icon className="h-8 w-8 text-accent" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xl font-bold text-primary">{value}</p>
      </div>
    </div>
  );
}
