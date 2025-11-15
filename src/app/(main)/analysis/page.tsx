
"use client"

import { useResearchHistory } from "@/hooks/use-research-history";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export default function AnalysisPage() {
  const { researchHistory, loading } = useResearchHistory();

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Top 10 Research Tags</CardTitle>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={tagsData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip
                      cursor={{ fill: 'hsl(var(--accent))' }}
                      contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                    />
                    <Legend />
                    <Bar dataKey="count" name="Research Count" fill="hsl(var(--primary))" />
                </BarChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
}
