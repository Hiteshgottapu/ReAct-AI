"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BookMarked, Home, Settings, User, Loader2, BrainCircuit, Search } from "lucide-react"
import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { UserNav } from "@/components/layout/user-nav"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { ResearchHistoryProvider } from "@/components/research-history-provider"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    // On landing page, we don't redirect
    if (pathname === '/') return;
    
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router, pathname])

  const isActive = (path: string) => {
    // Special handling for the new landing page vs the authed dashboard
    if (path === '/dashboard') return pathname === '/dashboard';
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path)
  }

  const getPageTitle = (path: string) => {
    if (path === "/") return "Home";
    if (path === "/dashboard") return "Dashboard";
    if (path.startsWith("/result")) return "Research Result";
    if (path.startsWith("/bookmarks")) return "Bookmarks";
    if (path.startsWith("/profile")) return "Profile";
    if (path.startsWith("/settings")) return "Settings";
    const segment = path.split('/')[1];
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  }
  
  if (loading && pathname !== '/') {
    return (
      <div className="flex h-screen items-center justify-center bg-[#020617]">
        <Loader2 className="h-8 w-8 animate-spin text-[#38bdf8]" />
      </div>
    );
  }
  
  // Render a simplified layout for the unauthenticated landing page
  if (!user && pathname === '/') {
    return (
        <div className="flex min-h-screen flex-col bg-[#020617] font-body">
            <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-[#1f2933] bg-[#0f172a]/80 px-4 backdrop-blur-sm sm:px-6">
                 <Link href="/" className="flex items-center gap-2">
                    <BrainCircuit className="h-6 w-6 text-[#38bdf8]" />
                    <h1 className="text-lg font-bold font-headline">
                        ReAct-AI
                    </h1>
                </Link>
                <div className="flex items-center gap-4">
                     <Button asChild variant="ghost" className="hidden sm:inline-flex">
                        <Link href="/#features">Features</Link>
                     </Button>
                     <Button asChild variant="ghost" className="hidden sm:inline-flex">
                        <Link href="/#how-it-works">How It Works</Link>
                     </Button>
                     <Button asChild size="sm" className="bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-[#020617] rounded-full font-bold uppercase tracking-wide">
                      <Link href="/login">Login</Link>
                    </Button>
                </div>
            </header>
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    )
  }

  // Render the full dashboard layout for authenticated users
  if (user) {
    return (
      <ResearchHistoryProvider>
        <SidebarProvider>
          <div className="flex min-h-screen">
            <Sidebar className="border-r border-[#1f2933]">
              <SidebarHeader>
                <div className="flex items-center gap-2 p-2">
                    <BrainCircuit className="h-6 w-6 text-[#38bdf8]" />
                    <h1 className="text-lg font-bold group-data-[collapsible=icon]:hidden font-headline">
                        ReAct-AI
                    </h1>
                </div>
              </SidebarHeader>
              <SidebarContent className="p-2">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
                      <Link href="/dashboard">
                        <Home />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                    <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/profile")}>
                      <Link href="/profile">
                        <User />
                        <span>Profile</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/bookmarks")}>
                      <Link href="/bookmarks">
                        <BookMarked />
                        <span>Bookmarks</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarContent>
              <SidebarFooter className="p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive("/settings")}>
                            <Link href="/settings">
                                <Settings />
                                <span>Settings</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            </Sidebar>
            <div className="flex flex-1 flex-col">
              <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#1f2933] bg-background/80 px-4 backdrop-blur-sm sm:px-6">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="md:hidden" />
                    <h2 className="text-xl font-semibold font-headline">
                      {getPageTitle(pathname)}
                    </h2>
                </div>
                <div className="flex items-center gap-4">
                  <UserNav />
                </div>
              </header>
              <main className="flex-grow p-4 sm:p-6">{children}</main>
              <Footer />
            </div>
          </div>
        </SidebarProvider>
      </ResearchHistoryProvider>
    )
  }

  // Fallback for non-landing pages when user is not logged in but not yet redirected.
  // Or any other edge case.
  return <main>{children}</main>;
}
