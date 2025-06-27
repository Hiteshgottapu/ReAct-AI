"use client"

import { useState, ChangeEvent } from "react"
import Link from "next/link"
import { ArrowRight, BookMarked, Clock, Edit, Save, Search, Loader2, Upload } from "lucide-react"
import { updateProfile } from "firebase/auth"

import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useResearchHistory } from "@/hooks/use-research-history"

function ProfileForm() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [displayName, setDisplayName] = useState(user?.displayName || "")
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
      if (!user || !displayName || displayName === user.displayName) {
        setIsEditing(false);
        return;
      };
      setIsSaving(true);
      try {
        await updateProfile(user, { displayName });
        toast({ title: "Profile updated successfully!" });
        setIsEditing(false);
      } catch (error: any) {
        toast({ variant: "destructive", title: "Update failed", description: error.message });
      } finally {
        setIsSaving(false);
      }
    }

    const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // In a real app, you would upload this file to Firebase Storage
            // and get a URL to update the user's profile.
            console.log("Selected file:", file.name);
            toast({
                title: "Avatar Upload",
                description: "File upload UI is ready. Backend logic needs to be implemented.",
            });
        }
    };


    if (!user) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>View and update your personal details.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                    <div className="group relative">
                        <Avatar className="h-32 w-32">
                             <AvatarImage src={user.photoURL || "https://placehold.co/128x128.png"} data-ai-hint="avatar person" />
                             <AvatarFallback>{user.displayName?.split(" ").map(n => n[0]).join("") || user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <label 
                            htmlFor="avatar-upload"
                            className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                            <Upload className="h-6 w-6 text-white" />
                            <span className="sr-only">Upload new avatar</span>
                        </label>
                        <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                    </div>
                    <div className="flex-grow space-y-4 text-center sm:text-left">
                        <div className="space-y-2">
                            <Label htmlFor="displayName">Display Name</Label>
                             {isEditing ? (
                                <div className="flex items-center justify-center gap-2 sm:justify-start">
                                    <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} disabled={isSaving} className="max-w-xs"/>
                                    <Button size="icon" onClick={handleSave} disabled={isSaving}>
                                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin"/> : <Save className="h-4 w-4" />}
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2 sm:justify-start">
                                    <p className="text-xl font-semibold">{user.displayName}</p>
                                    <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="shrink-0"><Edit className="h-4 w-4" /></Button>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <p className="text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function ResearchHistoryList() {
    const [filter, setFilter] = useState("all") // 'all' or 'bookmarked'
    const [searchTerm, setSearchTerm] = useState("")
    const { researchHistory, loading } = useResearchHistory();

    const filteredHistory = researchHistory
        .filter(item => filter === "bookmarked" ? item.isBookmarked : true)
        .filter(item => 
            item.queryText.toLowerCase().includes(searchTerm.toLowerCase()) || 
            item.aiResponse.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Research History</CardTitle>
                <CardDescription>Review your past research queries and results.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search history..." 
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="bookmarks-only">Show Bookmarks Only</Label>
                        <Switch 
                            id="bookmarks-only"
                            checked={filter === 'bookmarked'}
                            onCheckedChange={(checked) => setFilter(checked ? 'bookmarked' : 'all')}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {loading ? (
                       <div className="flex justify-center py-8">
                           <Loader2 className="h-8 w-8 animate-spin" />
                       </div>
                    ) : filteredHistory.length > 0 ? filteredHistory.map(item => (
                        <div key={item.researchId} className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-2">
                                <Link href={`/result/${item.researchId}`} className="font-medium hover:underline">{item.aiResponse.title}</Link>
                                <p className="line-clamp-1 text-sm text-muted-foreground">{item.queryText}</p>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {item.timestamp.toLocaleDateString()}</span>
                                    {item.isBookmarked && <Badge variant="secondary" className="gap-1.5 pl-1.5"><BookMarked className="h-3 w-3" /> Bookmarked</Badge>}
                                    {item.aiResponse.tags?.slice(0, 3).map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" asChild>
                                <Link href={`/result/${item.researchId}`}>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    )) : (
                        <p className="text-center text-muted-foreground py-8">No research found.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default function ProfilePage() {
    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-center">Your Profile</h1>
            <Tabs defaultValue="account">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="mt-6">
                    <ProfileForm />
                </TabsContent>
                <TabsContent value="history" className="mt-6">
                    <ResearchHistoryList />
                </TabsContent>
            </Tabs>
        </div>
    )
}
