
"use client"

import { KeyRound, Paintbrush, Trash2, ShieldQuestion, FileDown, History } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/hooks/use-toast"
import { useResearchHistory } from "@/hooks/use-research-history"
import { useAuth } from "@/hooks/use-auth"
import { deleteUser } from "firebase/auth"
import { useRouter } from "next/navigation"


export default function SettingsPage() {
    const { toast } = useToast()
    const { user } = useAuth();
    const router = useRouter();
    const { researchHistory, loading: isHistoryLoading } = useResearchHistory();

    const handleSaveApiKey = () => {
        // In a real app, this would save to user settings in Firestore
        toast({ title: "API Key Saved", description: "Your API key has been updated." })
    }

    const handleExportData = () => {
        if (isHistoryLoading) {
            toast({ variant: "destructive", title: "Please wait", description: "History is still loading." });
            return;
        }
        const dataStr = JSON.stringify(researchHistory, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'react-ai-history.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        toast({ title: "Data Exported", description: "Your research history has been downloaded." });
    }

    const handleClearHistory = () => {
        // In a real app, you would call a function to delete all documents
        // from the user's researchHistory subcollection in Firestore.
        console.log("Clearing research history for user:", user?.uid);
        toast({ title: "History Cleared", description: "Your research history has been permanently deleted." });
    }
    
    const handleDeleteAccount = async () => {
        if (!user) return;
        try {
            // Re-authentication might be required for this operation.
            // This is a simplified example.
            await deleteUser(user);
            toast({ title: "Account Deleted", description: "Your account has been permanently deleted." });
            router.push('/signup');
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Deletion Failed",
                description: error.message || "An error occurred while deleting your account."
            });
        }
    }


  return (
    <div className="container mx-auto max-w-5xl space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your application and account preferences.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Column 1 */}
        <div className="space-y-8">
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
                </CardContent>
                <CardFooter className="justify-end">
                     <Button onClick={handleSaveApiKey}>Save API Key</Button>
                </CardFooter>
            </Card>
        </div>

        {/* Column 2 */}
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><History className="h-5 w-5" /> Data & Privacy</CardTitle>
                    <CardDescription>Manage your research data.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label>Export Research Data</Label>
                            <p className="text-sm text-muted-foreground">Download all your past research as a JSON file.</p>
                        </div>
                        <Button variant="outline" onClick={handleExportData} disabled={isHistoryLoading}>
                            <FileDown className="mr-2 h-4 w-4" /> Export
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="border-t border-destructive/20 bg-destructive/10 p-4 justify-between items-center rounded-b-xl">
                    <div>
                        <Label className="text-destructive-foreground font-semibold">Clear History</Label>
                        <p className="text-sm text-destructive-foreground/80">Permanently delete all research data.</p>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4"/>Clear</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete all of your research history.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleClearHistory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Yes, clear history
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ShieldQuestion className="h-5 w-5" /> Account Management</CardTitle>
                    <CardDescription>Manage account security and settings.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="flex items-center justify-between">
                        <div>
                            <Label>Change Password</Label>
                            <p className="text-sm text-muted-foreground">Update the password for your account.</p>
                        </div>
                        <Button variant="outline" onClick={() => toast({ title: "Coming Soon!", description: "This feature is not yet implemented." })}>
                            Change
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="border-t border-destructive/20 bg-destructive/10 p-4 justify-between items-center rounded-b-xl">
                    <div>
                        <Label className="text-destructive-foreground font-semibold">Delete Account</Label>
                        <p className="text-sm text-destructive-foreground/80">Permanently delete your account and all data.</p>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4"/>Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your account, your profile, and all of your research data.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Yes, delete my account
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  )
}
