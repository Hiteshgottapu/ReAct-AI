"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, BookMarked, Clock, Edit, Save, Search } from "lucide-react"

import { mockUser } from "@/lib/mock-data"
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
    const [displayName, setDisplayName] = useState(mockUser.displayName)
    const [isEditing, setIsEditing] = useState(false)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>View and update your personal details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src="https://placehold.co/128x128.png" data-ai-hint="avatar person" />
                        <AvatarFallback>{displayName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <Label htmlFor="displayName">Display Name</Label>
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                                <Button size="icon" onClick={() => setIsEditing(false)}><Save className="h-4 w-4" /></Button>
                            </div>
                        ) : (
                             <div className="flex items-center gap-2">
                                <p className="text-xl font-semibold">{displayName}</p>
                                <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}><Edit className="h-4 w-4" /></Button>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <Label>Email</Label>
                    <p className="text-muted-foreground">{mockUser.email}</p>
                </div>
            </CardContent>
        </Card>
    )
}

function ResearchHistoryList() {
    const [filter, setFilter] = useState("all") // 'all' or 'bookmarked'
    const [searchTerm, setSearchTerm] = useState("")
    const { researchHistory } = useResearchHistory();

    const filteredHistory = researchHistory
        .filter(item => filter === "bookmarked" ? item.isBookmarked : true)
        .filter(item => 
            item.queryText.toLowerCase().includes(searchTerm.toLowerCase()) || 
            item.aiResponse.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
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
                    {filteredHistory.length > 0 ? filteredHistory.map(item => (
                        <div key={item.researchId} className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-1">
                                <Link href={`/result/${item.researchId}`} className="font-medium hover:underline">{item.aiResponse.title}</Link>
                                <p className="line-clamp-1 text-sm text-muted-foreground">{item.queryText}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {item.timestamp.toLocaleDateString()}</span>
                                    {item.isBookmarked && <Badge variant="secondary" className="gap-1.5 pl-1.5"><BookMarked className="h-3 w-3" /> Bookmarked</Badge>}
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
        <div className="container mx-auto max-w-5xl space-y-8 py-8">
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <Tabs defaultValue="account">
                <TabsList>
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
