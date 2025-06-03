
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, Save, XCircle, AlertTriangle, BookOpenCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import type { MCQ } from "@/types";
import Link from "next/link";

const testFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long.").max(100, "Title must be 100 characters or less."),
  description: z.string().max(500, "Description must be 500 characters or less.").optional(),
  topic: z.string().min(1, "Topic is required.").max(50, "Topic must be 50 characters or less."),
  selectedMcqIds: z.array(z.string()).min(1, "Please select at least one MCQ for the test."),
});

type TestFormValues = z.infer<typeof testFormSchema>;

export default function NewTestPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, addTest } = useAuth();
  const authoredMCQs = user?.mcqsAuthored || [];

  const { control, handleSubmit, register, formState: { errors }, watch, setValue } = useForm<TestFormValues>({
    resolver: zodResolver(testFormSchema),
    defaultValues: {
      title: "",
      description: "",
      topic: "",
      selectedMcqIds: [],
    },
  });

  const selectedMcqIdsWatch = watch("selectedMcqIds");

  const onSubmit = (data: TestFormValues) => {
    if (!addTest) {
        toast({ title: "Error", description: "Could not save test. Auth function not available.", variant: "destructive" });
        return;
    }
    const testData = {
        title: data.title,
        description: data.description,
        topic: data.topic,
        mcqIds: data.selectedMcqIds,
    };
    addTest(testData);
    toast({
      title: "Test Created!",
      description: `"${data.title}" has been successfully created.`,
      variant: "default",
    });
    router.push("/tests"); 
  };

  if (!user?.isCreator) {
    return (
        <Card className="max-w-xl mx-auto mt-10 shadow-lg rounded-xl">
            <CardHeader className="text-center">
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-3" />
                <CardTitle className="text-2xl text-destructive">Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground">You must be a creator to access this page.</p>
            </CardContent>
            <CardFooter>
                <Button onClick={() => router.push('/dashboard')} variant="outline" className="w-full">
                    Go to Dashboard
                </Button>
            </CardFooter>
        </Card>
    );
  }
  
  if (authoredMCQs.length === 0) {
    return (
        <Card className="max-w-xl mx-auto mt-10 shadow-lg rounded-xl">
            <CardHeader className="text-center">
                <BookOpenCheck className="h-12 w-12 text-primary mx-auto mb-3" />
                <CardTitle className="text-2xl text-primary">No MCQs Found</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground mb-4">You need to create some MCQs before you can build a test.</p>
                <Link href="/mcq-creator/new" passHref>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        <PlusCircle className="mr-2 h-5 w-5" /> Create Your First MCQ
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
  }


  return (
    <Card className="max-w-3xl mx-auto shadow-2xl rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardTitle className="text-3xl font-headline text-primary">Create New Test</CardTitle>
        <CardDescription className="text-muted-foreground text-lg">
          Assemble a new test by selecting from your authored MCQs.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="p-6 md:p-8 space-y-6">
          <div>
            <Label htmlFor="title" className="text-lg font-semibold">Test Title</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="e.g., Chapter 1 Review, Advanced Algebra Practice"
              className={`mt-1 text-base ${errors.title ? 'border-destructive focus:ring-destructive' : ''}`}
            />
            {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <Label htmlFor="description" className="text-lg font-semibold">Description (Optional)</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Briefly describe this test..."
              className={`mt-1 text-base ${errors.description ? 'border-destructive focus:ring-destructive' : ''}`}
              rows={3}
            />
            {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="topic" className="text-lg font-semibold">Topic</Label>
            <Input
              id="topic"
              {...register("topic")}
              placeholder="e.g., Biology, European History"
              className={`mt-1 text-base ${errors.topic ? 'border-destructive focus:ring-destructive' : ''}`}
            />
            {errors.topic && <p className="text-sm text-destructive mt-1">{errors.topic.message}</p>}
          </div>

          <div>
            <Label className="text-lg font-semibold">Select MCQs for this Test</Label>
            <p className="text-sm text-muted-foreground mb-2">Selected: {selectedMcqIdsWatch.length} MCQs</p>
            {errors.selectedMcqIds && <p className="text-sm text-destructive mb-2">{errors.selectedMcqIds.message}</p>}
            <ScrollArea className="h-72 w-full rounded-md border p-4 bg-muted/20">
              <div className="space-y-3">
                {authoredMCQs.map((mcq: MCQ) => (
                  <div key={mcq.id} className="flex items-start space-x-3 p-3 rounded-md bg-background hover:bg-secondary/50 transition-colors border border-transparent hover:border-border">
                    <Controller
                      name="selectedMcqIds"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id={`mcq-${mcq.id}`}
                          checked={field.value?.includes(mcq.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...(field.value || []), mcq.id])
                              : field.onChange(
                                  (field.value || []).filter(
                                    (value) => value !== mcq.id
                                  )
                                );
                          }}
                          className="mt-1"
                        />
                      )}
                    />
                    <Label htmlFor={`mcq-${mcq.id}`} className="flex-1 cursor-pointer">
                      <p className="font-medium text-foreground">{mcq.question.length > 100 ? mcq.question.substring(0,97)+'...' : mcq.question}</p>
                      <p className="text-xs text-muted-foreground">
                        Topic: {mcq.topic || 'N/A'} &bull; Difficulty: {mcq.difficulty || 'N/A'}
                      </p>
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

        </CardContent>
        <CardFooter className="p-6 bg-secondary/30 flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={() => router.back()} className="border-muted-foreground text-muted-foreground hover:border-primary hover:text-primary">
            <XCircle className="mr-2 h-5 w-5" /> Cancel
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Save className="mr-2 h-5 w-5" /> Save Test
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
