
"use client"

import { useResearchHistory } from "@/hooks/use-research-history";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { eachDayOfInterval, format, subDays, startOfDay } from 'date-fns';

export default function AnalysisPage() {
  const { researchHistory, loading } = useResearchHistory();

  const processChartData = () => {
    // Top Tags
    const tagsData = researchHistory.reduce((acc, item) => {
      item.aiResponse.tags.forEach(tag => {
        const existingTag = acc.find(t => t.name === tag);
        if (existingTag) {
          existingTag.count += 1;
        } else {
          acc.push({ name: tag, count: 1 });
        }
      });
      return acc;
    }, [] as { name: string, count: number }[]).sort((a, b) => b.count - a.count).slice(0, 10);

    // Activity Over Time (Last 30 days)
    const thirtyDaysAgo = subDays(new Date(), 29);
    const dateRange = eachDayOfInterval({ start: thirtyDaysAgo, end: new Date() });
    
    const activityData = dateRange.map(date => ({
      date: format(date, 'MMM dd'),
      count: 0
    }));

    researchHistory.forEach(item => {
      const itemDate = startOfDay(item.timestamp);
      const activityEntry = activityData.find(d => format(itemDate, 'MMM dd') === d.date);
      if (activityEntry) {
        activityEntry.count++;
      }
    });

    // Feedback Scores
    const feedbackData = [
      { name: '1 Star', count: 0 },
      { name: '2 Stars', count: 0 },
      { name: '3 Stars', count: 0 },
      { name: '4 Stars', count: 0 },
      { name: '5 Stars', count: 0 },
    ];
    let totalFeedback = 0;
    researchHistory.forEach(item => {
      if (item.feedbackScore) {
        totalFeedback++;
        feedbackData[item.feedbackScore - 1].count++;
      }
    });
    
    const avgFeedback = totalFeedback > 0 
      ? (researchHistory.reduce((sum, item) => sum + (item.feedbackScore || 0), 0) / totalFeedback).toFixed(2)
      : 'N/A';

    return { tagsData, activityData, feedbackData, avgFeedback };
  }

  const { tagsData, activityData, feedbackData, avgFeedback } = processChartData();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Research Analysis</h1>
        <p className="text-muted-foreground mt-2">
          An overview of your research activity and topics.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Research</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{researchHistory.length}</p>
            <p className="text-sm text-muted-foreground">items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bookmarked</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{researchHistory.filter(i => i.isBookmarked).length}</p>
            <p className="text-sm text-muted-foreground">items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Unique Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{new Set(researchHistory.flatMap(i => i.aiResponse.tags)).size}</p>
            <p className="text-sm text-muted-foreground">tags</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg. Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{avgFeedback}</p>
            <p className="text-sm text-muted-foreground">out of 5 stars</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
              <CardTitle>Activity - Last 30 Days</CardTitle>
              <CardDescription>Number of research summaries generated per day.</CardDescription>
          </CardHeader>
          <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
                      <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                      <Tooltip
                        cursor={{ fill: 'hsl(var(--accent))' }}
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                      />
                      <Line type="monotone" dataKey="count" name="Research" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
                  </LineChart>
              </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Research Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={tagsData} layout="vertical" margin={{ left: 25, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--accent))' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                />
                <Bar dataKey="count" name="Count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Feedback Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={feedbackData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={60} />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--accent))' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                />
                <Bar dataKey="count" name="Count" fill="hsl(var(--secondary))" radius={[0, 4, 4, 0]}/>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
