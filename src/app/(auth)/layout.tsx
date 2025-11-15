
import { Footer } from "@/components/layout/footer";
import { BrainCircuit } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="absolute top-0 left-0 right-0 p-4">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-bold text-foreground">
              ReAct-AI
          </h1>
        </Link>
      </header>
      <main className="flex flex-grow flex-col items-center justify-center p-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}
