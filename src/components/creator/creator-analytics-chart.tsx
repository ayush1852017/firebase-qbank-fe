"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
  { month: "January", mcqs: 18, engagement: 800 },
  { month: "February", mcqs: 30, engagement: 1200 },
  { month: "March", mcqs: 23, engagement: 950 },
  { month: "April", mcqs: 17, engagement: 1100 },
  { month: "May", mcqs: 20, engagement: 1000 },
  { month: "June", mcqs: 21, engagement: 1300 },
];

const chartConfig = {
  mcqs: {
    label: "MCQs Created",
    color: "hsl(var(--chart-1))",
  },
  engagement: { // Added for potential future use, but not rendered in this version
    label: "Total Engagements",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function CreatorAnalyticsChart() {
  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle>Content Overview</CardTitle>
        <CardDescription>MCQs Created (January - June)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} accessibilityLayer margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={5} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar 
                dataKey="mcqs" 
                fill="var(--color-mcqs)" 
                radius={[4, 4, 0, 0]} 
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
