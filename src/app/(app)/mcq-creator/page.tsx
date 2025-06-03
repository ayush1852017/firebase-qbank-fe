"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, ListChecks, BarChart2 } from "lucide-react";
import Link from "next/link";

export default function McqCreatorPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-xl rounded-xl overflow-hidden bg-gradient-to-r from-primary/10 to-accent/10">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">MCQ Creator Hub</CardTitle>
          <CardDescription className="text-muted-foreground text-lg">
            Create, manage, and analyze your multiple-choice questions.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold text-primary">
              <PlusCircle className="mr-3 h-7 w-7 text-accent" />
              Create New MCQ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Start crafting a new question for students.
            </p>
            <Link href="/mcq-creator/new" passHref>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Start Creating
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold text-primary">
              <ListChecks className="mr-3 h-7 w-7 text-accent" />
              Manage My MCQs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              View, edit, and track the status of your existing questions.
            </p>
            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
              View My Questions
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold text-primary">
              <BarChart2 className="mr-3 h-7 w-7 text-accent" />
              Performance Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              See how your questions are performing and get insights.
            </p>
            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">Creator Resources</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Find tips and best practices for creating effective MCQs.</p>
            <div className="mt-4">
                <img src="https://placehold.co/600x200.png" data-ai-hint="education infographic" alt="Creator resources placeholder" className="rounded-md shadow-sm w-full" />
            </div>
        </CardContent>
      </Card>

    </div>
  );
}
