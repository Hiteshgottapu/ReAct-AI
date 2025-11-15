
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Link2, BarChart3, Shield, Star } from 'lucide-react';
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
  <div className="bg-[#0f172a] border border-[#1f2933] rounded-lg p-8 transition-all hover:border-[#38bdf8]/50 hover:-translate-y-1">
    <div className="bg-[#38bdf8]/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
      <Icon size={28} className="text-[#38bdf8]" />
    </div>
    <h3 className="text-xl font-bold mb-3 text-[#e5e7eb]">{title}</h3>
    <p className="text-[#9ca3af]">
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
    <div className="bg-[#0f172a]/50 border border-[#1f2933] rounded-lg p-6 text-center">
        <div className="text-4xl font-bold text-[#38bdf8] mb-2">{step}</div>
        <h4 className="font-bold mb-2 text-[#e5e7eb] uppercase tracking-wider">{title}</h4>
        <p className="text-[#9ca3af] text-sm">{description}</p>
    </div>
)

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-[#e5e7eb] font-body">
      
      {/* Navigation - Integrated into Main Layout */}
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28 text-center">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#020617] via-transparent to-[#020617]"></div>
          <div className="absolute top-0 left-0 -z-10 h-64 w-64 bg-gradient-to-tr from-[#6366f1]/20 to-transparent rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 -z-10 h-64 w-64 bg-gradient-to-bl from-[#38bdf8]/20 to-transparent rounded-full blur-3xl opacity-50 translate-x-1/2 translate-y-1/2"></div>

        <div className="container px-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight font-headline">
                Research That <span className="text-[#38bdf8]">Thinks for You</span>
            </h1>
            <p className="text-lg md:text-xl text-[#9ca3af] mb-8 max-w-3xl mx-auto">
                Submit any research question or link. ReAct-AI analyzes YouTube videos, scrapes web content, 
                and generates structured summaries in seconds—powered by Gemini AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button 
                    asChild
                    size="lg" 
                    className="bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-[#020617] px-8 py-3 rounded-full font-bold uppercase tracking-wide transition-transform hover:scale-105"
                >
                    <Link href="/signup">
                        Try for Free <ArrowRight size={20} className="ml-2" />
                    </Link>
                </Button>
            </div>
            <p className="text-[#9ca3af] text-sm flex items-center justify-center gap-2">
                <Star size={16} className="text-yellow-400" /> Used by 500+ researchers and students
            </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-24 bg-[#0f172a]/50 border-y border-[#1f2933]">
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
      <section className="py-20 text-center border-t border-[#1f2933] bg-[#0f172a]/50">
        <div className="container px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-headline">Ready to Research Smarter?</h2>
            <p className="text-lg text-[#9ca3af] mb-8">Sign up free. No credit card needed.</p>
            
            <Button 
                asChild
                size="lg" 
                className="bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-[#020617] px-8 py-3 rounded-full font-bold uppercase tracking-wide transition-transform hover:scale-105"
            >
                <Link href="/signup">
                    Get Started Now <ArrowRight size={20} className="ml-2"/>
                </Link>
            </Button>
        </div>
      </section>
    </div>
  );
}
