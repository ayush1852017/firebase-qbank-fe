
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useState, useEffect, type FormEvent } from "react";
import { UserCircle, CheckCircle, Briefcase, Users as UsersIcon } from "lucide-react"; // Added Briefcase, UsersIcon
import type { UserMode } from "@/types";
import { SplashLoader } from "@/components/splash-loader";

export default function OnboardingProfilePage() {
  const router = useRouter();
  const { user, loading, login, completeOnboarding } = useAuth();
  const [name, setName] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<UserMode[]>([]);
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
      // Pre-fill roles if they were somehow set before, though unlikely in this new flow
      setSelectedRoles(user.roles || []); 
    }
  }, [user, loading, router]);

  const handleRoleChange = (role: UserMode) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }
    if (selectedRoles.length === 0) {
      setError("Please select at least one role (Student or Creator).");
      return;
    }

    if (user) {
      // Step 1: Update user's name and roles using the login function
      // This call to login will update the user in AuthContext and localStorage
      login(user.email, name, selectedRoles);
      
      // Step 2: Finalize onboarding
      // completeOnboarding will set isNewUser to false and handle redirection
      completeOnboarding(); 
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
      <Card className="w-full max-w-lg shadow-2xl rounded-xl overflow-hidden"> {/* Increased max-width */}
        <CardHeader className="text-center bg-primary/5 p-8">
          <div className="mx-auto mb-4">
            <UserCircle className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline text-primary">Complete Your Profile</CardTitle>
          <CardDescription className="text-muted-foreground">
            Tell us a bit about yourself to get started!
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6"> {/* Increased space-y */}
            <div>
              <Label htmlFor="name" className="font-semibold">Full Name</Label>
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
              <Label htmlFor="email" className="font-semibold">Email (read-only)</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                readOnly
                className="mt-1 bg-muted/50 cursor-not-allowed"
              />
            </div>
            
            <div className="space-y-3"> {/* Increased space-y */}
              <Label className="font-semibold">How will you use Test Champion?</Label>
              <p className="text-sm text-muted-foreground">Select all that apply. You can change this later.</p>
              <div className="flex flex-col space-y-3 pt-2"> {/* Increased space-y and pt */}
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id="role-student"
                    checked={selectedRoles.includes('student')}
                    onCheckedChange={() => handleRoleChange('student')}
                    className="h-5 w-5"
                  />
                  <Label htmlFor="role-student" className="font-normal flex items-center cursor-pointer text-base">
                    <UsersIcon className="mr-2 h-5 w-5 text-primary" /> As a Student <span className="text-xs text-muted-foreground ml-1">- to practice and learn.</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id="role-creator"
                    checked={selectedRoles.includes('creator')}
                    onCheckedChange={() => handleRoleChange('creator')}
                    className="h-5 w-5"
                  />
                  <Label htmlFor="role-creator" className="font-normal flex items-center cursor-pointer text-base">
                     <Briefcase className="mr-2 h-5 w-5 text-accent" /> As a Creator <span className="text-xs text-muted-foreground ml-1">- to build and share MCQs.</span>
                  </Label>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5">
              <CheckCircle className="mr-2 h-5 w-5" /> Save Profile & Continue
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
