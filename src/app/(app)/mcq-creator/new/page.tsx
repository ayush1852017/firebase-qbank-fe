"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, Trash2, Save, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const mcqFormSchema = z.object({
  question: z.string().min(10, "Question must be at least 10 characters long."),
  options: z.array(z.object({ text: z.string().min(1, "Option cannot be empty.") })).min(2, "At least two options are required.").max(5, "Maximum of 5 options allowed."),
  correctAnswerIndex: z.coerce.number().min(0, "Please select a correct answer."),
  explanation: z.string().min(10, "Explanation must be at least 10 characters long."),
  topic: z.string().min(1, "Topic is required."),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.string().optional(),
});

type McqFormValues = z.infer<typeof mcqFormSchema>;

export default function NewMcqPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { control, handleSubmit, register, formState: { errors }, watch, setValue } = useForm<McqFormValues>({
    resolver: zodResolver(mcqFormSchema),
    defaultValues: {
      question: "",
      options: [{ text: "" }, { text: "" }],
      correctAnswerIndex: -1,
      explanation: "",
      topic: "",
      difficulty: "medium",
      tags: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });
  
  const optionsWatch = watch("options");

  const onSubmit = (data: McqFormValues) => {
    console.log("MCQ Data:", data);
    // Here you would typically send data to your backend
    toast({
      title: "MCQ Created!",
      description: "Your new question has been drafted.",
      variant: "default",
    });
    router.push("/mcq-creator"); // Redirect after successful creation
  };

  return (
    <Card className="max-w-3xl mx-auto shadow-2xl rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardTitle className="text-3xl font-headline text-primary">Create New MCQ</CardTitle>
        <CardDescription className="text-muted-foreground text-lg">
          Craft a new multiple-choice question for learners.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="p-6 md:p-8 space-y-6">
          <div>
            <Label htmlFor="question" className="text-lg font-semibold">Question Text</Label>
            <Textarea
              id="question"
              {...register("question")}
              placeholder="Enter the question here..."
              className={`mt-1 text-base ${errors.question ? 'border-destructive focus:ring-destructive' : ''}`}
              rows={3}
            />
            {errors.question && <p className="text-sm text-destructive mt-1">{errors.question.message}</p>}
          </div>

          <div>
            <Label className="text-lg font-semibold">Options</Label>
            <div className="space-y-3 mt-1">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <Input
                    {...register(`options.${index}.text`)}
                    placeholder={`Option ${index + 1}`}
                    className={`text-base ${errors.options?.[index]?.text ? 'border-destructive focus:ring-destructive' : ''}`}
                  />
                  {fields.length > 2 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              ))}
              {errors.options && !errors.options.root?.message && errors.options.map((err,i) => err?.text && <p key={i} className="text-sm text-destructive mt-1">{err.text.message}</p>)}
              {errors.options?.root?.message && <p className="text-sm text-destructive mt-1">{errors.options?.root?.message}</p>}

            </div>
            {fields.length < 5 && (
              <Button type="button" variant="outline" onClick={() => append({ text: "" })} className="mt-3 text-primary border-primary/50 hover:bg-primary/10">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Option
              </Button>
            )}
          </div>
          
          <div>
            <Label htmlFor="correctAnswerIndex" className="text-lg font-semibold">Correct Answer</Label>
             <Controller
                name="correctAnswerIndex"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value === -1 ? undefined : field.value.toString()}>
                    <SelectTrigger id="correctAnswerIndex" className={`mt-1 text-base ${errors.correctAnswerIndex ? 'border-destructive focus:ring-destructive' : ''}`}>
                      <SelectValue placeholder="Select the correct option" />
                    </SelectTrigger>
                    <SelectContent>
                      {optionsWatch.map((option, index) => (
                        option.text.trim() && // Only show valid options
                        <SelectItem key={index} value={index.toString()}>
                          {`Option ${index + 1}: ${option.text.length > 30 ? option.text.substring(0,30)+'...' : option.text}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            {errors.correctAnswerIndex && <p className="text-sm text-destructive mt-1">{errors.correctAnswerIndex.message}</p>}
          </div>

          <div>
            <Label htmlFor="explanation" className="text-lg font-semibold">Explanation</Label>
            <Textarea
              id="explanation"
              {...register("explanation")}
              placeholder="Explain why the correct answer is right..."
              className={`mt-1 text-base ${errors.explanation ? 'border-destructive focus:ring-destructive' : ''}`}
              rows={4}
            />
            {errors.explanation && <p className="text-sm text-destructive mt-1">{errors.explanation.message}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="topic" className="text-lg font-semibold">Topic</Label>
              <Input
                id="topic"
                {...register("topic")}
                placeholder="e.g., Algebra, World History"
                className={`mt-1 text-base ${errors.topic ? 'border-destructive focus:ring-destructive' : ''}`}
              />
              {errors.topic && <p className="text-sm text-destructive mt-1">{errors.topic.message}</p>}
            </div>
            <div>
              <Label htmlFor="difficulty" className="text-lg font-semibold">Difficulty</Label>
              <Controller
                name="difficulty"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="difficulty" className={`mt-1 text-base ${errors.difficulty ? 'border-destructive focus:ring-destructive' : ''}`}>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.difficulty && <p className="text-sm text-destructive mt-1">{errors.difficulty.message}</p>}
            </div>
          </div>
           <div>
            <Label htmlFor="tags" className="text-lg font-semibold">Tags (comma-separated)</Label>
            <Input
              id="tags"
              {...register("tags")}
              placeholder="e.g., calculus, 20th-century, grammar"
              className="mt-1 text-base"
            />
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-secondary/30 flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={() => router.back()} className="border-muted-foreground text-muted-foreground hover:border-primary hover:text-primary">
            <XCircle className="mr-2 h-5 w-5" /> Cancel
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Save className="mr-2 h-5 w-5" /> Save Draft
          </Button>
          {/* <Button type="button" onClick={handleSubmit((data) => console.log("Publish", data))} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Send className="mr-2 h-5 w-5" /> Submit for Review
          </Button> */}
        </CardFooter>
      </form>
    </Card>
  );
}

// Placeholder icon if not imported elsewhere
const Send = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);
