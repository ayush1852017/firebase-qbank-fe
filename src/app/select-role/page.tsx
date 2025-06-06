
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useUserMode } from "@/contexts/user-mode-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Users, Briefcase, BrainCircuit } from "lucide-react";
import type { UserMode as UserModeType } from "@/types";
import { SplashLoader } from "@/components/splash-loader";

export default function SelectRolePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { setMode: setUserMode } = useUserMode(); // Renamed for clarity

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace("/auth/sign-in");
        return;
      }
      // If user is new, they should be in onboarding
      if (user.isNewUser) {
        router.replace("/onboarding/terms");
        return;
      }
      // If user doesn't have multiple roles, or a role is already selected, redirect to dashboard
      const modeSelected = localStorage.getItem('testChampionUserMode');
      if ((user.roles && user.roles.length <= 1) || modeSelected) {
         router.replace("/dashboard");
      }
    }
  }, [user, authLoading, router]);

  const handleRoleSelect = (role: UserModeType) => {
    setUserMode(role); // This will set in context and localStorage
    router.push("/dashboard");
  };

  if (authLoading || !user) {
    return <SplashLoader />;
  }
  
  // Additional check to prevent rendering if conditions in useEffect would redirect
  if (!authLoading && user && ((user.roles && user.roles.length <= 1) || localStorage.getItem('testChampionUserMode'))) {
      return <SplashLoader />; // Content will flash before redirect, so show loader
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-xl overflow-hidden">
        <CardHeader className="text-center bg-primary/5 p-8">
          <div className="mx-auto mb-4">
            <BrainCircuit className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline text-primary">Choose Your Role</CardTitle>
          <CardDescription className="text-muted-foreground">
            How would you like to use Test Champion today?
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {user?.roles?.includes("student") && (
            <Button
              onClick={() => handleRoleSelect("student")}
              className="w-full text-lg py-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-primary-foreground"
              variant="default"
              size="lg"
            >
              <Users className="mr-3 h-6 w-6" /> Continue as Student
            </Button>
          )}
          {user?.roles?.includes("creator") && (
            <Button
              onClick={() => handleRoleSelect("creator")}
              className="w-full text-lg py-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 bg-gradient-to-r from-accent to-purple-500 hover:from-accent/90 hover:to-purple-500/90 text-accent-foreground"
              variant="default"
              size="lg"
            >
              <Briefcase className="mr-3 h-6 w-6" /> Continue as Creator
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
