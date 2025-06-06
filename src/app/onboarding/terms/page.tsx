
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FileText, ShieldCheck } from "lucide-react";
import { SplashLoader } from "@/components/splash-loader";

export default function TermsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && !user.isNewUser) {
      // If user is not new, redirect away from onboarding
      router.replace("/dashboard");
    }
    if (!loading && !user) {
      router.replace("/auth/sign-in");
    }
  }, [user, loading, router]);

  const handleAccept = () => {
    // In a real app, you might record acceptance
    router.push("/onboarding/profile");
  };

  if (loading || !user) {
    return <SplashLoader />;
  }
  
  if (user && !user.isNewUser && !loading) {
     // This state should ideally be caught by useEffect, but as a fallback:
    return <SplashLoader />; // Or redirect immediately
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-2xl shadow-2xl rounded-xl overflow-hidden">
        <CardHeader className="text-center bg-primary/5 p-8">
          <div className="mx-auto mb-4">
            <FileText className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline text-primary">Terms of Service</CardTitle>
          <CardDescription className="text-muted-foreground">
            Please review and accept our terms to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <ScrollArea className="h-64 w-full rounded-md border p-4 bg-muted/20">
            <h3 className="font-semibold mb-2 text-foreground">Welcome to Test Champion!</h3>
            <p className="text-sm text-muted-foreground mb-3">
              These terms and conditions outline the rules and regulations for the use of Test Champion&apos;s Website, located at testchampion.app.
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              By accessing this website we assume you accept these terms and conditions. Do not continue to use Test Champion if you do not agree to take all of the terms and conditions stated on this page.
            </p>
             <h4 className="font-semibold mt-3 mb-1 text-foreground">Cookies</h4>
            <p className="text-sm text-muted-foreground mb-3">
              We employ the use of cookies. By accessing Test Champion, you agreed to use cookies in agreement with the Test Champion&apos;s Privacy Policy. Most interactive websites use cookies to let us retrieve the user’s details for each visit.
            </p>
             <h4 className="font-semibold mt-3 mb-1 text-foreground">License</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Unless otherwise stated, Test Champion and/or its licensors own the intellectual property rights for all material on Test Champion. All intellectual property rights are reserved. You may access this from Test Champion for your own personal use subjected to restrictions set in these terms and conditions.
            </p>
            <p className="text-sm text-muted-foreground">
              You must not:
              <ul className="list-disc list-inside ml-4 my-1">
                <li>Republish material from Test Champion</li>
                <li>Sell, rent or sub-license material from Test Champion</li>
                <li>Reproduce, duplicate or copy material from Test Champion</li>
                <li>Redistribute content from Test Champion</li>
              </ul>
            </p>
             <p className="text-sm text-muted-foreground mt-4">
              (This is placeholder text. In a real application, you would include your full terms of service here.)
            </p>
          </ScrollArea>
          <Button onClick={handleAccept} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5">
            <ShieldCheck className="mr-2 h-5 w-5" /> Accept & Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
