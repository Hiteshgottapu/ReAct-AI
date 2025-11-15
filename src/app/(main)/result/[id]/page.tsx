
"use client"

import { useParams } from "next/navigation"
import {
  BookMarked,
  Check,
  Clipboard,
  Download,
  Info,
  Lightbulb,
  Link as LinkIcon,
  Loader2,
  MessageSquareQuote,
  Target,
} from "lucide-react"
import { useState } from "react"
import jsPDF from "jspdf"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useResearchHistory } from "@/hooks/use-research-history"

function Feedback({ researchId }: { researchId: string }) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const { toast } = useToast()
  const { updateFeedbackScore } = useResearchHistory();

  const handleRating = async (rate: number) => {
    setRating(rate)
    try {
      await updateFeedbackScore(researchId, rate);
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
                  ? 'text-primary'
                  : 'text-gray-300 dark:text-gray-600'
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

export default function ResultPage() {
  const params = useParams<{ id: string }>()
  const { toast } = useToast()
  const { getResearchById, toggleBookmark, loading } = useResearchHistory();
  const result = getResearchById(params.id)

  if (loading) {
    return (
        <div className="mx-auto flex max-w-5xl items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  if (!result) {
    return (
        <div className="mx-auto max-w-5xl space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Research Result Not Found</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>The research you are looking for does not exist or you may not have permission to view it.</p>
                </CardContent>
            </Card>
        </div>
    )
  }
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "The summary has been copied as Markdown."
    });
  };
  
  const handleToggleBookmark = () => {
    toggleBookmark(result.researchId);
    toast({
      title: result.isBookmarked ? "Bookmark removed" : "Bookmark added",
    });
  }

  const handleDownload = () => {
    const doc = new jsPDF();
    const margin = 15;
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = margin;

    const addText = (text: string, size: number, options?: any) => {
        const splitText = doc.splitTextToSize(text, doc.internal.pageSize.getWidth() - margin * 2);
        splitText.forEach((line: string) => {
            if (yPos > pageHeight - margin) {
                doc.addPage();
                yPos = margin;
            }
            doc.text(line, margin, yPos, options);
            yPos += (size / 2); // Line height
        });
        yPos += 5; // Paragraph spacing
    };

    doc.setFont("helvetica", "bold");
    addText(result.aiResponse.title, 22);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    addText(`Research for: "${result.queryText}"`, 10);
    addText(`Date: ${result.timestamp.toLocaleString()}`, 10);

    yPos += 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    addText("Introduction", 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    addText(result.aiResponse.introduction, 12);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    addText("Key Insights", 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    result.aiResponse.keyInsights.forEach((insight, index) => {
        addText(`${index + 1}. ${insight}`, 12);
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    addText("Conclusion", 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    addText(result.aiResponse.conclusion, 12);

    if (result.aiResponse.sources && result.aiResponse.sources.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        addText("Sources", 16);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        result.aiResponse.sources.forEach(source => {
            addText(`${source.title}: ${source.url}`, 10);
        });
    }

    doc.save(`${result.aiResponse.title.replace(/ /g, "_")}.pdf`);
    toast({ title: "Downloading PDF..." });
  };

  const markdownText = `
# ${result.aiResponse.title}

**Date:** ${result.timestamp.toLocaleString()}
**Query:** "${result.queryText}"

## Introduction
${result.aiResponse.introduction}

## Key Insights
${result.aiResponse.keyInsights.map(insight => `- ${insight}`).join('\n')}

## Conclusion
${result.aiResponse.conclusion}

## Sources
${result.aiResponse.sources?.map(source => `- [${source.title || source.url}](${source.url})`).join('\n') || 'N/A'}
  `.trim();

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Research for: "{result.queryText}"
        </p>
        <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
                <h1 className="text-4xl font-bold tracking-tight text-primary">
                    {result.aiResponse.title}
                </h1>
                {result.aiResponse.tags && result.aiResponse.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {result.aiResponse.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                )}
            </div>
            <div className="flex items-center gap-2">
                <Button variant={result.isBookmarked ? "secondary" : "outline"} size="sm" onClick={handleToggleBookmark}>
                    <BookMarked className="mr-2 h-4 w-4" />
                    {result.isBookmarked ? "Bookmarked" : "Bookmark"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(markdownText)}>
                    <Clipboard className="mr-2 h-4 w-4" />
                    Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                </Button>
            </div>
        </div>
        <p className="text-lg text-muted-foreground">
          {result.timestamp.toLocaleString()}
        </p>
      </header>
      
      <Separator />

      <main className="space-y-8">
        <Card>
          <CardContent className="space-y-12 p-6 md:p-8">
            {/* Introduction */}
            <section className="space-y-4">
              <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground">
                <MessageSquareQuote className="h-6 w-6 text-accent" />
                Introduction
              </h2>
              <p className="leading-relaxed text-muted-foreground">{result.aiResponse.introduction}</p>
            </section>

            <Separator />

            {/* Key Insights */}
            <section className="space-y-6">
              <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground">
                <Lightbulb className="h-6 w-6 text-accent" />
                Key Insights
              </h2>
              <ul className="space-y-4">
                {result.aiResponse.keyInsights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-4 rounded-lg bg-accent/50 p-4">
                    <span className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                      {index + 1}
                    </span>
                    <p className="flex-1 text-base text-foreground/90">{insight}</p>
                  </li>
                ))}
              </ul>
            </section>

            <Separator />

            {/* Conclusion */}
            <section className="space-y-4">
              <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground">
                <Target className="h-6 w-6 text-accent" />
                Conclusion
              </h2>
              <p className="leading-relaxed text-muted-foreground">{result.aiResponse.conclusion}</p>
            </section>

            {/* Sources */}
            {result.aiResponse.sources && result.aiResponse.sources.length > 0 && (
              <>
                <Separator />
                <section className="space-y-4">
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground">
                    <LinkIcon className="h-6 w-6 text-accent" />
                    Sources
                  </h2>
                  <ul className="space-y-2">
                    {result.aiResponse.sources.map((source, index) => (
                      <li key={index} className="truncate">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          {source.title || source.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              </>
            )}
          </CardContent>
        </Card>
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

    