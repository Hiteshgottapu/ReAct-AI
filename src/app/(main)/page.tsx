"use client"

import Link from "next/link";
import { ArrowRight, BookMarked, Clock, Loader2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResearchForm } from "@/components/research/research-form";
import { Badge } from "@/components/ui/badge";
import { useResearchHistory } from "@/hooks/use-research-history";

export default function DashboardPage() {
  const { researchHistory, loading } = useResearchHistory();
  const recentResearch = researchHistory.slice(0, 3);

  return (
    <div className="container mx-auto max-w-5xl space-y-12 py-8">
      <section className="text-center">
        <h1 className="bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
          ReAct to Information
        </h1>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
          Your personal AI research assistant. Just ask, and we&apos;ll dive deep.
        </p>
      </section>

      <section>
        <ResearchForm />
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Recent Research</h2>
          <Button variant="link" asChild>
            <Link href="/profile">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : recentResearch.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentResearch.map((item) => (
              <Card key={item.researchId} className="flex flex-col">
                <CardHeader>
                  {item.aiResponse.tags && item.aiResponse.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.aiResponse.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  )}
                  <CardTitle className="line-clamp-2 pt-2">{item.aiResponse.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 pt-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{item.timestamp.toLocaleDateString()}</span>
                    {item.isBookmarked && <Badge variant="secondary" className="gap-1.5 pl-1.5"><BookMarked className="h-3 w-3"/>Bookmarked</Badge>}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {item.aiResponse.introduction}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/result/${item.researchId}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-secondary p-3">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
              <p className="font-semibold">No Research Yet</p>
              <p className="text-sm text-muted-foreground">Start a new research query to see your results here.</p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
