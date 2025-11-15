
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Atom, PenSquare, Share2 } from 'lucide-react';
import Image from 'next/image';

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="bg-card/50 rounded-xl border border-border/50 p-6 text-center shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
    <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
      <Icon className="h-8 w-8" />
    </div>
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="mt-2 text-muted-foreground">{description}</p>
  </div>
);

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 sm:py-32">
           <div
            aria-hidden="true"
            className="absolute -top-1/2 left-1/2 -z-10 h-[200%] w-[200%] -translate-x-1/2 bg-[radial-gradient(50%_50%_at_50%_50%,_#F0F4F8_0%,_rgba(255,255,255,0)_100%)] dark:bg-[radial-gradient(50%_50%_at_50%_50%,_#020817_0%,_rgba(2,8,23,0)_100%)]"
          />
          <div className="container z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="max-w-xl text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                ReAct-AI: Your AI-Powered Research Assistant
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Turn hours of research into minutes. Our AI assistant analyzes articles, videos, and documents to deliver structured insights, so you can focus on what matters.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <Button asChild size="lg">
                  <Link href="/signup">
                    Try for Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="#">Schedule Demo</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="https://picsum.photos/seed/ai-robot/600/400"
                alt="AI assistant robot"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl"
                data-ai-hint="robot future"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 sm:py-32 bg-secondary/50">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Everything you need to accelerate your research
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                From literature reviews to collaborative summaries, we've got you covered.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={BookOpen}
                title="Intelligent Literature Review"
                description="Process and understand complex topics from multiple sources with AI-driven analysis."
              />
              <FeatureCard
                icon={PenSquare}
                title="Real-Time Citation Suggestions"
                description="Get accurate citation suggestions as you work, saving you time and effort."
              />
              <FeatureCard
                icon={Share2}
                title="Collaborative Workspace"
                description="Work with your team in a shared space to compile and refine research findings."
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
