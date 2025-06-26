"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookMarked, Home, Search, Settings, User } from "lucide-react"

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
import { ThemeToggle } from "@/components/theme-toggle"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  const getPageTitle = (path: string) => {
    if (path === "/") return "Dashboard";
    if (path.startsWith("/result")) return "Research Result";
    const segment = path.split('/')[1];
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-secondary/50">
        <Sidebar className="border-r">
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
                <Search className="h-6 w-6 text-primary" />
                <h1 className="text-lg font-bold group-data-[collapsible=icon]:hidden">
                    Contextual Insights
                </h1>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/")}>
                  <Link href="/">
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
                <SidebarMenuButton asChild isActive={pathname.includes("bookmarks")}>
                  <Link href="/profile">
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
        <div className="flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden" />
                <h2 className="text-xl font-semibold">
                  {getPageTitle(pathname)}
                </h2>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <UserNav />
            </div>
          </header>
          <main className="p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
