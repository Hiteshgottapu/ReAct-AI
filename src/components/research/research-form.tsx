
"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Plus, Sparkles, Trash2, Wand2 } from "lucide-react"

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
import { Separator } from "../ui/separator"

const researchSchema = z.object({
  queryText: z.string().min(10, "Please describe your research topic in a bit more detail."),
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
          title: "Research Complete!",
          description: `Your summary is ready.`,
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
    <Card className="bg-card border border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-bold">
          <Wand2 className="h-6 w-6 text-primary" />
          What are you researching today?
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          I can analyze articles, YouTube videos, and more. Just give me a topic and some links.
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
                  <FormLabel className="text-base font-semibold text-foreground">Tell me your research topic</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="For example: What are the latest advancements in quantum computing and their potential impact on cryptography?"
                      className="min-h-[120px] bg-background border-border"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Separator />

            <div className="space-y-4">
              <div>
                <FormLabel className="text-base font-semibold text-foreground">Do you have any links for me to read?</FormLabel>
                <p className="text-sm text-muted-foreground mt-1">I can process websites, YouTube videos, and GitHub repos (optional).</p>
              </div>
              <div className="space-y-4">
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
                              className="bg-background border-border"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            disabled={fields.length <= 1 && form.getValues('inputLinks.0.value') === ''}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
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
            
            <Separator/>

            <Button type="submit" disabled={isLoading} size="lg" className="w-full font-bold">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Research
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
