"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Plus, Search, Trash2 } from "lucide-react"

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
    <Card>
      <CardHeader>
        <CardTitle>Start New Research</CardTitle>
        <CardDescription>
          Enter your topic and any relevant links to begin.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="queryText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Research Topic</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., The future of renewable energy sources..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Contextual Links (Optional)</FormLabel>
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
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            disabled={fields.length <= 1 && form.getValues(`inputLinks.${index}.value`) === ""}
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
                className="mt-3"
                onClick={() => append({ value: "" })}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Link
              </Button>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
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
