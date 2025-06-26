"use client"

import { KeyRound, Paintbrush } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
    const { toast } = useToast()

    const handleSaveApiKey = () => {
        // In a real app, this would save to user settings in Firestore
        toast({ title: "API Key Saved", description: "Your API key has been updated." })
    }
  return (
    <div className="container mx-auto max-w-3xl space-y-8 py-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Paintbrush className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize the look and feel of the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">Select your preferred color theme.</p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            API Configuration
          </CardTitle>
          <CardDescription>
            Manage your personal API keys for AI services.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="gemini-key">Google Gemini API Key</Label>
                <Input id="gemini-key" type="password" placeholder="Enter your Gemini API key" />
            </div>
            <div className="flex justify-end">
                <Button onClick={handleSaveApiKey}>Save API Key</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
