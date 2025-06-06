
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useState, useEffect, type FormEvent } from "react";
import { UserCircle, CheckCircle } from "lucide-react";
import { SplashLoader } from "@/components/splash-loader";

export default function OnboardingProfilePage() {
  const router = useRouter();
  const { user, loading, login, completeOnboarding } = useAuth(); // login is used to update user details
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && user && !user.isNewUser) {
      router.replace("/dashboard");
    }
     if (!loading && !user) {
      router.replace("/auth/sign-in");
    }
    if (user) {
      setName(user.name || '');
    }
  }, [user, loading, router]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }
    if (user) {
      // Update user's name via the login function (which also handles updates)
      // This is a slight misuse of login, but fits the current auth context structure for updating user details
      login(user.email, name, user.roles); // This will update the user in context & local storage
      completeOnboarding(); // This will set isNewUser to false and handle next redirection
    }
  };

  if (loading || !user) {
    return <SplashLoader />;
  }
  
  if (user && !user.isNewUser && !loading) {
    return <SplashLoader />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-xl overflow-hidden">
        <CardHeader className="text-center bg-primary/5 p-8">
          <div className="mx-auto mb-4">
            <UserCircle className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline text-primary">Complete Your Profile</CardTitle>
          <CardDescription className="text-muted-foreground">
            Just one more step to get started!
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
                className="mt-1"
              />
            </div>
             <div>
              <Label htmlFor="email">Email (read-only)</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                readOnly
                className="mt-1 bg-muted/50 cursor-not-allowed"
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5">
              <CheckCircle className="mr-2 h-5 w-5" /> Save & Continue
            </Button>
          </form>
        </CardContent>
         <CardFooter className="p-4 bg-secondary/30 text-center">
            <p className="text-xs text-muted-foreground">
                You can update your profile information later from your account settings.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
