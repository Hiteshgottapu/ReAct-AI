
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BookMarked, Home, Settings, User, Loader2, BrainCircuit, BarChart } from "lucide-react"
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
import { ResearchHistoryProvider } from "@/components/research-history-provider"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const isActive = (path: string) => {
    return pathname === path || (path !== "/dashboard" && pathname.startsWith(path));
  }

  const getPageTitle = (path: string) => {
    if (path === "/dashboard") return "Dashboard";
    if (path.startsWith("/result")) return "Research Result";
    if (path.startsWith("/bookmarks")) return "Bookmarks";
    if (path.startsWith("/profile")) return "Profile";
    if (path.startsWith("/settings")) return "Settings";
    if (path.startsWith("/analysis")) return "Analysis";
    const segment = path.split('/')[1];
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  }
  
  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <ResearchHistoryProvider>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <Sidebar className="border-r-0 bg-card">
            <SidebarHeader>
              <div className="flex items-center gap-2 p-2">
                  <BrainCircuit className="h-6 w-6 text-primary" />
                  <h1 className="text-lg font-bold group-data-[collapsible=icon]:hidden text-foreground">
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
                  <SidebarMenuButton asChild isActive={isActive("/analysis")}>
                    <Link href="/analysis">
                      <BarChart />
                      <span>Analysis</span>
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
            <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-sm sm:px-6">
              <div className="flex items-center gap-2">
                  <SidebarTrigger className="md:hidden" />
                  <h2 className="text-xl font-semibold text-foreground">
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
