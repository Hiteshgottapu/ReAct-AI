
"use client"

import { useState, ChangeEvent, useCallback, Fragment } from "react"
import Link from "next/link"
import { ArrowRight, BookMarked, Clock, Edit, Save, Search, Loader2, Upload } from "lucide-react"
import { updateProfile } from "firebase/auth"
import React from 'react'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { auth, storage } from "@/lib/firebase"

import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useResearchHistory } from "@/hooks/use-research-history"
import { Textarea } from "@/components/ui/textarea"

function ProfileForm() {
    const { user } = useAuth();
    const { toast } = useToast();
    
    const [displayName, setDisplayName] = useState(user?.displayName || "");
    const [title, setTitle] = useState("AI Researcher"); // Placeholder
    const [bio, setBio] = useState("Passionate about the future of artificial intelligence and its impact on technology and society."); // Placeholder

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            if (displayName !== user.displayName) {
                await updateProfile(user, { displayName });
            }
            // In a real app, you would save title and bio to your database (e.g., Firestore)
            console.log("Saving additional user data (UI demo):", { title, bio });
            toast({ title: "Profile updated successfully!" });
            setIsEditing(false);
        } catch (error: any) {
            toast({ variant: "destructive", title: "Update failed", description: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setDisplayName(user?.displayName || "");
        setTitle("AI Researcher"); // Reset placeholder
        setBio("Passionate about the future of artificial intelligence and its impact on technology and society."); // Reset placeholder
        setIsEditing(false);
    }

    const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!user) return;
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const storageRef = ref(storage, `avatars/${user.uid}`);

        try {
            await uploadBytes(storageRef, file);
            const photoURL = await getDownloadURL(storageRef);
            await updateProfile(user, { photoURL });

            toast({
                title: "Avatar updated!",
                description: "Your new profile picture has been saved.",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Upload failed",
                description: error.message || "Could not upload your avatar.",
            });
        } finally {
            setIsUploading(false);
        }
    };

    if (!user) return null;
    
    const creationDate = user.metadata.creationTime 
      ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : 'N/A';

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>View and update your personal details.</CardDescription>
                </div>
                {!isEditing && (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="flex flex-col items-center text-center gap-4 md:col-span-1 md:border-r md:pr-8">
                        <div className="group relative">
                            <Avatar className="h-32 w-32">
                                 <AvatarImage src={user.photoURL || "https://placehold.co/128x128.png"} data-ai-hint="avatar person" />
                                 <AvatarFallback>{user.displayName?.split(" ").map(n => n[0]).join("") || user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <label 
                                htmlFor="avatar-upload"
                                className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
                            >
                                {isUploading ? (
                                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                                ) : (
                                    <Upload className="h-6 w-6 text-white" />
                                )}
                                <span className="sr-only">Upload new avatar</span>
                            </label>
                            <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploading} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-semibold">{displayName}</h3>
                            <p className="text-muted-foreground">{user.email}</p>
                            <p className="text-sm text-muted-foreground pt-2">Member since {creationDate}</p>
                        </div>
                    </div>

                    <div className="space-y-6 md:col-span-2">
                        {isEditing ? (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="displayName">Display Name</Label>
                                    <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} disabled={isSaving} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title">Professional Title</Label>
                                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., AI Researcher" disabled={isSaving}/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself" rows={4} disabled={isSaving}/>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <Label>Professional Title</Label>
                                    <p className="text-muted-foreground">{title}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Bio</Label>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{bio}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
            {isEditing && (
                <CardFooter className="justify-end gap-2 border-t pt-6">
                    <Button variant="ghost" onClick={handleCancel} disabled={isSaving}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </CardFooter>
            )}
        </Card>
    )
}

const ResearchHistoryItem = React.memo(function ResearchHistoryItem({ item }: { item: any }) {
    return (
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-2">
                <Link href={`/result/${item.researchId}`} className="font-medium hover:underline">{item.aiResponse.title}</Link>
                <p className="line-clamp-1 text-sm text-muted-foreground">{item.queryText}</p>
                <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {item.timestamp.toLocaleDateString()}</span>
                    {item.isBookmarked && <Badge variant="secondary" className="gap-1.5 pl-1.5"><BookMarked className="h-3 w-3" /> Bookmarked</Badge>}
                    {item.aiResponse.tags?.slice(0, 3).map((tag:string) => <Badge key={tag} variant="outline">{tag}</Badge>)}
                </div>
            </div>
            <Button variant="ghost" size="icon" asChild>
                <Link href={`/result/${item.researchId}`}>
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </Button>
        </div>
    );
});


function ResearchHistoryList() {
    const { researchHistory, loading, hasMore, loadMore } = useResearchHistory();
    const [filter, setFilter] = useState("all") // 'all' or 'bookmarked'
    const [searchTerm, setSearchTerm] = useState("")

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
                    {loading && filteredHistory.length === 0 ? (
                       <div className="flex justify-center py-8">
                           <Loader2 className="h-8 w-8 animate-spin" />
                       </div>
                    ) : filteredHistory.length > 0 ? (
                        <>
                            {filteredHistory.map(item => (
                                <ResearchHistoryItem key={item.researchId} item={item} />
                            ))}
                            {hasMore && (
                                <div className="pt-4 text-center">
                                    <Button onClick={loadMore} disabled={loading}>
                                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : 'Load More'}
                                    </Button>
                                </div>
                            )}
                        </>
                    )
                    : (
                        <p className="text-center text-muted-foreground py-8">No research found.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default function ProfilePage() {
    return (
        <div className="w-full space-y-8">
            <h1 className="text-3xl font-bold text-center">Your Profile</h1>
            <Tabs defaultValue="account" className="w-full">
                <TabsList className="mx-auto flex w-fit">
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
