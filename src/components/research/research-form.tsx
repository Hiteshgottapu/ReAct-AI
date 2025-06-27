"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Plus, Trash2, FileText, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { generateResearchSummary } from "@/ai/flows/generate-research-summary"
import { useRouter } from "next/navigation"
import type { ResearchResult } from "@/lib/types"
import { useResearchHistory } from "@/hooks/use-research-history"
import { useAuth } from "@/hooks/use-auth"

const researchSchema = z.object({
  queryText: z.string().min(10, "Please enter a more detailed research topic."),
  inputLinks: z.array(
    z.object({
      value: z.string().url({ message: "Please enter a valid URL." }).or(z.literal("")),
    })
  ).optional(),
})

export function ResearchForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { addResearchResult } = useResearchHistory();
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof researchSchema>>({
    resolver: zodResolver(researchSchema),
    defaultValues: {
      queryText: "",
      inputLinks: [{ value: "" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    name: "inputLinks",
    control: form.control,
  })

  async function onSubmit(values: z.infer<typeof researchSchema>) {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to start a new research.",
      });
      return;
    }
    
    setIsLoading(true)
    try {
      const filteredLinks = values.inputLinks
        ?.map(link => link.value)
        .filter(link => link.trim() !== "") || []

      const result = await generateResearchSummary({
        queryText: values.queryText,
        inputLinks: filteredLinks.length > 0 ? filteredLinks : undefined,
      })

      const newResearchResult: Omit<ResearchResult, 'researchId' | 'timestamp' | 'userId'> = {
        queryText: values.queryText,
        inputLinks: filteredLinks,
        aiResponse: result,
        isBookmarked: false,
      }

      const newResearchId = await addResearchResult(newResearchResult);

      if (newResearchId) {
        toast({
          title: "Research Generated!",
          description: `Redirecting to summary: "${result.title}"`,
        })

        form.reset();
        
        router.push(`/result/${newResearchId}`)
      }

    } catch (error) {
      console.error("Error generating research:", error)
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "There was a problem generating your research. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="shadow-lg dark:shadow-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <FileText className="h-6 w-6" />
          Start New Research
        </CardTitle>
        <CardDescription>
          Enter your topic and any relevant links to begin.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="queryText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Research Topic</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., The future of renewable energy sources and their impact on global economies..."
                      className="min-h-[120px] text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel className="text-base font-semibold">Reference Links (Optional)</FormLabel>
              <p className="text-sm text-muted-foreground">Provide URLs for the AI to use as context.</p>
              <div className="mt-2 space-y-3">
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`inputLinks.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input
                              placeholder="https://example.com"
                              {...field}
                              className="text-base"
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            disabled={fields.length <= 1}
                            className="hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ value: "" })}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Another Link
              </Button>
            </div>

            <Button type="submit" disabled={isLoading} size="lg" className="w-full text-lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Insights
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
