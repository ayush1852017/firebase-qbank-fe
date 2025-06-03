"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PlusCircle, ListChecks, BarChart2, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import type { MCQ } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function McqCreatorPage() {
  const { user } = useAuth();
  const authoredMCQs = user?.mcqsAuthored || [];

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
            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10" onClick={() => document.getElementById('my-mcqs-section')?.scrollIntoView({ behavior: 'smooth' })}>
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
      
      <Card id="my-mcqs-section" className="shadow-xl rounded-xl">
        <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">My Authored MCQs</CardTitle>
            <CardDescription>A list of multiple-choice questions you have created.</CardDescription>
        </CardHeader>
        <CardContent>
          {authoredMCQs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Question</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {authoredMCQs.map((mcq: MCQ) => (
                  <TableRow key={mcq.id}>
                    <TableCell className="font-medium truncate max-w-xs" title={mcq.question}>{mcq.question}</TableCell>
                    <TableCell>{mcq.topic || 'N/A'}</TableCell>
                    <TableCell>
                        <Badge variant={
                            mcq.difficulty === 'easy' ? 'default' : 
                            mcq.difficulty === 'medium' ? 'secondary' : 
                            'destructive'
                        } className={
                            mcq.difficulty === 'easy' ? 'bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30' : 
                            mcq.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30 hover:bg-yellow-500/30' : 
                            'bg-red-500/20 text-red-700 border-red-500/30 hover:bg-red-500/30'
                        }>
                            {mcq.difficulty ? mcq.difficulty.charAt(0).toUpperCase() + mcq.difficulty.slice(1) : 'N/A'}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                       <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-500">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80">
                        <Trash2 className="h-4 w-4" />
                         <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <ListChecks className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg">You haven&apos;t created any MCQs yet.</p>
              <Link href="/mcq-creator/new" passHref>
                <Button className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
                  <PlusCircle className="mr-2 h-5 w-5" /> Create Your First MCQ
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
         {authoredMCQs.length > 0 && (
          <CardFooter className="flex justify-end">
            <Link href="/mcq-creator/new" passHref>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <PlusCircle className="mr-2 h-5 w-5" /> Create More MCQs
                </Button>
            </Link>
        </CardFooter>
        )}
      </Card>

    </div>
  );
}
