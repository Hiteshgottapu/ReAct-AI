"use client"

import { notFound } from "next/navigation"
import {
  BookMarked,
  Check,
  Clipboard,
  Info,
  Lightbulb,
  Link as LinkIcon,
  MessageSquareQuote,
  Target,
} from "lucide-react"
import { useState } from "react"
import { collectAiFeedback } from "@/ai/flows/collect-ai-feedback"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { mockResearchHistory, mockUser } from "@/lib/mock-data"
import type { ResearchResult } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

function Feedback({ researchId }: { researchId: string }) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const { toast } = useToast()

  const handleRating = async (rate: number) => {
    setRating(rate)
    try {
      await collectAiFeedback({
        researchId: researchId,
        userId: mockUser.uid,
        feedbackScore: rate
      });
      setSubmitted(true)
      toast({ title: "Feedback submitted!", description: "Thank you for helping us improve." })
    } catch (error) {
      toast({ variant: "destructive", title: "Submission failed", description: "Could not submit feedback." })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <p className="text-sm font-medium">Rate this summary:</p>
      {[...Array(5)].map((_, index) => {
        const starRating = index + 1
        return (
          <button
            key={starRating}
            onClick={() => handleRating(starRating)}
            onMouseEnter={() => setHoverRating(starRating)}
            onMouseLeave={() => setHoverRating(0)}
            disabled={submitted}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className={`h-6 w-6 transition-colors ${
                starRating <= (hoverRating || rating)
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          </button>
        )
      })}
       {submitted && <Check className="h-5 w-5 text-green-500" />}
    </div>
  )
}

export default function ResultPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const result: ResearchResult | undefined = mockResearchHistory.find(
    (r) => r.researchId === params.id
  )
  const [isBookmarked, setIsBookmarked] = useState(result?.isBookmarked || false)

  if (!result) {
    notFound()
  }
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
    });
  };
  
  const toggleBookmark = () => {
    // In a real app, this would be an API call to update Firestore
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Bookmark removed" : "Bookmark added",
    });
  }

  const fullText = `
Title: ${result.aiResponse.title}

Introduction:
${result.aiResponse.introduction}

Key Insights:
${result.aiResponse.keyInsights.map(insight => `- ${insight}`).join('\n')}

Conclusion:
${result.aiResponse.conclusion}

Sources:
${result.aiResponse.sources?.map(source => `- ${source.title}: ${source.url}`).join('\n') || 'N/A'}
  `.trim();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Research for: "{result.queryText}"
        </p>
        <div className="flex flex-wrap items-start justify-between gap-4">
            <h1 className="text-4xl font-bold tracking-tight text-primary">
                {result.aiResponse.title}
            </h1>
            <div className="flex items-center gap-2">
                <Button variant={isBookmarked ? "secondary" : "outline"} size="sm" onClick={toggleBookmark}>
                    <BookMarked className="mr-2 h-4 w-4" />
                    {isBookmarked ? "Bookmarked" : "Bookmark"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(fullText)}>
                    <Clipboard className="mr-2 h-4 w-4" />
                    Copy
                </Button>
            </div>
        </div>
        <p className="text-lg text-muted-foreground">
          {new Date(result.timestamp).toLocaleString()}
        </p>
      </header>
      
      <Separator />

      <main className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareQuote className="h-6 w-6 text-accent" />
              Introduction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">{result.aiResponse.introduction}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-accent" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {result.aiResponse.keyInsights.map((insight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {index + 1}
                  </span>
                  <p className="flex-1 pt-0.5 text-base">{insight}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-accent" />
              Conclusion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">{result.aiResponse.conclusion}</p>
          </CardContent>
        </Card>

        {result.aiResponse.sources && result.aiResponse.sources.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-6 w-6 text-accent" />
                Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.aiResponse.sources.map((source, index) => (
                  <li key={index}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {source.title || source.url}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </main>

      <Separator />

      <footer className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <Feedback researchId={result.researchId} />
          </CardContent>
        </Card>
        
        {result.aiResponse.disclaimer && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4" />
            <p>{result.aiResponse.disclaimer}</p>
          </div>
        )}
      </footer>
    </div>
  )
}
