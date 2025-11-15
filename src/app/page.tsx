
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Link2, BarChart3, Star, BrainCircuit } from 'lucide-react';
import { Footer } from '@/components/layout/footer';


const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="bg-card border border-border rounded-lg p-8 transition-all hover:border-primary/50 hover:-translate-y-1">
    <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
      <Icon size={28} className="text-primary" />
    </div>
    <h3 className="text-xl font-bold mb-3 text-card-foreground">{title}</h3>
    <p className="text-muted-foreground">
      {description}
    </p>
  </div>
);

const HowItWorksStep = ({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) => (
    <div className="bg-card/50 border border-border rounded-lg p-6 text-center">
        <div className="text-4xl font-bold text-primary mb-2">{step}</div>
        <h4 className="font-bold mb-2 text-card-foreground uppercase tracking-wider">{title}</h4>
        <p className="text-muted-foreground text-sm">{description}</p>
    </div>
)

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-body">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm sm:px-6">
           <Link href="/" className="flex items-center gap-2">
              <BrainCircuit className="h-6 w-6 text-primary" />
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
               <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-bold uppercase tracking-wide">
                <Link href="/login">Login</Link>
              </Button>
          </div>
      </header>
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28 text-center">
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-transparent to-background"></div>
            <div className="absolute top-0 left-0 -z-10 h-64 w-64 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 -z-10 h-64 w-64 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl opacity-50 translate-x-1/2 translate-y-1/2"></div>

          <div className="container px-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight font-headline">
                  Research That <span className="text-primary">Thinks for You</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                  Submit any research question or link. ReAct-AI analyzes YouTube videos, scrapes web content, 
                  and generates structured summaries in seconds—powered by Gemini AI.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <Button 
                      asChild
                      size="lg" 
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-bold uppercase tracking-wide transition-transform hover:scale-105"
                  >
                      <Link href="/signup">
                          Try for Free <ArrowRight size={20} className="ml-2" />
                      </Link>
                  </Button>
              </div>
              <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
                  <Star size={16} className="text-yellow-400" /> Used by 500+ researchers and students
              </p>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 sm:py-24 bg-card/50 border-y border-border">
          <div className="container px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 font-headline">What ReAct-AI Does</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={Zap}
                title="YouTube Analysis"
                description="Paste any YouTube link. ReAct-AI transcribes, analyzes, and summarizes 30-min videos in 90 seconds."
              />
              <FeatureCard 
                icon={Link2}
                title="Web Content Scraping"
                description="Submit any website URL. We extract content, analyze structure, and generate insights instantly."
              />
              <FeatureCard 
                icon={BarChart3}
                title="Research History"
                description="All your research saved securely. Search, filter, and revisit past analyses anytime you want."
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 sm:py-24">
          <div className="container px-6">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 font-headline">The ReAct Paradigm</h2>
              
              <div className="grid md:grid-cols-4 gap-6">
                  <HowItWorksStep step="1" title="Reason" description="AI decides: should I search this link or use past research?" />
                  <HowItWorksStep step="2" title="Act" description="Fetches data from YouTube transcripts, web pages, or its memory." />
                  <HowItWorksStep step="3" title="Generate" description="Gemini AI synthesizes findings into structured summaries." />
                  <HowItWorksStep step="4" title="Store" description="Results saved to your personal history for future reference." />
              </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-center border-t border-border bg-card/50">
          <div className="container px-6">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-headline">Ready to Research Smarter?</h2>
              <p className="text-lg text-muted-foreground mb-8">Sign up free. No credit card needed.</p>
              
              <Button 
                  asChild
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-bold uppercase tracking-wide transition-transform hover:scale-105"
              >
                  <Link href="/signup">
                      Get Started Now <ArrowRight size={20} className="ml-2"/>
                  </Link>
              </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
