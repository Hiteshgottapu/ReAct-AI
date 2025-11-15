
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Link2, BarChart3, CheckCircle2, Sparkles, Wand2, BrainCircuit } from 'lucide-react';
import { Footer } from '@/components/layout/footer';


const FeatureCard = ({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: 'blue' | 'purple' | 'green';
}) => {
  const colorClasses = {
    blue: 'text-primary bg-primary/10',
    purple: 'text-secondary bg-secondary/10',
    green: 'text-[#10b981] bg-[#10b981]/10',
  };
  return (
    <div className="bg-card border border-border rounded-2xl p-8 transition-all duration-300 ease-in-out hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
      <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-6 ${colorClasses[color]}`}>
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold mb-3 text-card-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

const HowItWorksStep = ({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) => (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative bg-card border border-border rounded-xl p-6 text-center h-full">
          <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-2">{step}</div>
          <h4 className="font-bold mb-2 text-foreground uppercase tracking-wider">{title}</h4>
          <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
)

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-body">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-sm sm:px-6">
           <Link href="/" className="flex items-center gap-2">
              <BrainCircuit className="h-6 w-6 text-primary" />
              <h1 className="text-lg font-bold text-foreground">
                  ReAct-AI
              </h1>
          </Link>
          <div className="flex items-center gap-2">
               <Button asChild variant="ghost" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground">
                  <Link href="/#features">Features</Link>
               </Button>
               <Button asChild variant="ghost" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground">
                  <Link href="/#how-it-works">How It Works</Link>
               </Button>
               <Button asChild size="sm" className="rounded-full font-semibold">
                <Link href="/login">Login</Link>
              </Button>
          </div>
      </header>
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 sm:py-32 text-center">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.15),transparent)]"></div>

          <div className="container px-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground">
                  Turn Information Into <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Insight</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
                  Submit any research question or link. ReAct-AI analyzes YouTube videos, scrapes web content, 
                  and generates structured summaries in seconds—powered by Gemini AI.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <Button 
                      asChild
                      size="lg" 
                      className="font-bold text-base transition-transform hover:scale-105 shadow-[0_4px_12px_rgba(59,130,246,0.3)]"
                  >
                      <Link href="/signup">
                          Get Started for Free <ArrowRight size={20} className="ml-2" />
                      </Link>
                  </Button>
              </div>
              <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} className="text-[#10b981]" /> Used by 500+ researchers and students
              </p>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 sm:py-24 bg-card/50 border-y border-border">
          <div className="container px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 tracking-tight">What ReAct-AI Does</h2>
            <p className="text-muted-foreground text-center text-lg max-w-2xl mx-auto mb-16">
              From video transcripts to complex codebases, get the insights you need without the manual work.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={Zap}
                title="YouTube Analysis"
                description="Paste any YouTube link. ReAct-AI transcribes, analyzes, and summarizes 30-min videos in 90 seconds."
                color="blue"
              />
              <FeatureCard 
                icon={Link2}
                title="Web Content Scraping"
                description="Submit any website URL. We extract content from articles, docs, and even GitHub repos, and generate insights instantly."
                color="purple"
              />
              <FeatureCard 
                icon={BarChart3}
                title="Structured Summaries"
                description="All your research is organized into clear, structured summaries with key insights, conclusions, and sources."
                color="green"
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 sm:py-24">
          <div className="container px-6">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 tracking-tight">The ReAct Paradigm</h2>
               <p className="text-muted-foreground text-center text-lg max-w-2xl mx-auto mb-16">
                Our AI follows a simple yet powerful framework to deliver accurate, relevant results every time.
              </p>
              
              <div className="grid md:grid-cols-4 gap-8">
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Ready to Research Smarter?</h2>
              <p className="text-lg text-muted-foreground mb-8">Sign up free. No credit card needed.</p>
              
              <Button 
                  asChild
                  size="lg" 
                  className="font-bold text-base transition-transform hover:scale-105 shadow-[0_4px_12px_rgba(59,130,246,0.3)]"
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
