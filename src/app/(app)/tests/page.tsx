
"use client";

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, FileText, Edit, Trash2, Eye } from 'lucide-react';
import type { Test } from '@/types';
import { format } from 'date-fns';

export default function MyTestsPage() {
  const { user } = useAuth();
  const tests = user?.testsAuthored || [];

  return (
    <div className="space-y-8">
      <Card className="shadow-xl rounded-xl overflow-hidden bg-gradient-to-r from-primary/10 to-accent/10">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">My Tests</CardTitle>
          <CardDescription className="text-muted-foreground text-lg">
            Manage your created tests and quizzes.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Link href="/tests/new" passHref>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md hover:shadow-lg">
                <PlusCircle className="mr-2 h-5 w-5" /> Create New Test
              </Button>
            </Link>
        </CardContent>
      </Card>

      <Card className="shadow-xl rounded-xl">
        <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">Your Test Bank</CardTitle>
            <CardDescription>A list of tests you have created.</CardDescription>
        </CardHeader>
        <CardContent>
          {tests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Title</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>MCQs</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map((test: Test) => (
                  <TableRow key={test.id}>
                    <TableCell className="font-medium">{test.title}</TableCell>
                    <TableCell>{test.topic || 'N/A'}</TableCell>
                    <TableCell>{test.mcqIds.length}</TableCell>
                    <TableCell>{format(new Date(test.createdAt), 'PPp')}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80" title="View">
                        <Eye className="h-4 w-4" />
                      </Button>
                       <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-500" title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <FileText className="h-16 w-16 mx-auto mb-4" />
              <p className="text-lg mb-2">You haven&apos;t created any tests yet.</p>
              <Link href="/tests/new" passHref>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <PlusCircle className="mr-2 h-5 w-5" /> Create Your First Test
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
        {tests.length > 0 && (
             <CardFooter className="flex justify-end pt-4">
                <Link href="/tests/new" passHref>
                    <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <PlusCircle className="mr-2 h-5 w-5" /> Create Another Test
                    </Button>
                </Link>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}
