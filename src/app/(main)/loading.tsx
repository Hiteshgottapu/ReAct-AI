
import { Skeleton } from "@/components/ui/skeleton";
import { BrainCircuit } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Skeleton */}
      <aside className="hidden md:block w-64 border-r border-border p-4">
        <div className="flex items-center gap-2 p-2 mb-4">
          <BrainCircuit className="h-6 w-6 text-muted" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <Skeleton className="h-6 w-6 rounded-md" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 space-y-3">
           <div className="flex items-center gap-3 p-2">
              <Skeleton className="h-6 w-6 rounded-md" />
              <Skeleton className="h-4 w-32" />
            </div>
        </div>
      </aside>
      
      {/* Main Content Skeleton */}
      <div className="flex-1">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 sm:px-6">
            <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 md:hidden" />
                <Skeleton className="h-6 w-40" />
            </div>
            <Skeleton className="h-9 w-9 rounded-full" />
        </header>
        <main className="p-4 sm:p-6">
           <div className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-5 w-2/3" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                         <Skeleton className="h-[400px] w-full rounded-2xl" />
                    </div>
                    <aside className="space-y-4">
                        <Skeleton className="h-6 w-48 mb-4" />
                        <Skeleton className="h-40 w-full rounded-2xl" />
                        <Skeleton className="h-40 w-full rounded-2xl" />
                        <Skeleton className="h-40 w-full rounded-2xl" />
                    </aside>
                </div>
           </div>
        </main>
      </div>
    </div>
  )
}
