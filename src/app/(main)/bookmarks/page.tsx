
"use client"

import Link from "next/link"
import { ArrowRight, BookMarked, Clock, Loader2 } from "lucide-react"
import { useResearchHistory } from "@/hooks/use-research-history"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function BookmarksPage() {
  const { researchHistory, loading } = useResearchHistory()
  const bookmarkedItems = researchHistory.filter(item => item.isBookmarked)

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Your Bookmarks</h1>
        <p className="text-muted-foreground mt-2">
          Here are all the research summaries you've saved for later.
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : bookmarkedItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedItems.map((item) => (
            <Card key={item.researchId} className="flex flex-col transition-all duration-300 ease-in-out hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
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
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {item.aiResponse.introduction}
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/result/${item.researchId}`}>View Details <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-secondary p-4">
                <BookMarked className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-xl font-semibold">No Bookmarks Yet</h3>
            <p className="text-muted-foreground mt-2">
              Click the bookmark icon on a result page to save it here.
            </p>
            <Button asChild className="mt-6">
              <Link href="/">Start New Research</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
