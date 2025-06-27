"use client"

import Link from "next/link";
import { BrainCircuit, Github, Linkedin, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Footer() {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <footer className="bg-secondary/50 text-secondary-foreground mt-auto w-full">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Branding Section */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <BrainCircuit className="h-8 w-8 text-primary" />
                            <span className="text-xl font-bold">ReAct-AI</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Powered by Gemini – Built for Curious Minds
                        </p>
                    </div>

                    {/* Links Section */}
                    <div className="space-y-4">
                        <h3 className="font-semibold uppercase tracking-wider">Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">About</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    
                    {/* Social Media Section */}
                    <div className="space-y-4">
                        <h3 className="font-semibold uppercase tracking-wider">Follow Us</h3>
                        <div className="flex items-center space-x-4">
                           <a href="https://github.com/hitesh-gottapu" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <Github className="h-6 w-6" />
                                <span className="sr-only">GitHub</span>
                            </a>
                           <a href="https://www.linkedin.com/in/hitesh-gottapu-11725b217/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="h-6 w-6" />
                                <span className="sr-only">LinkedIn</span>
                            </a>
                        </div>
                    </div>

                    {/* Back to Top Section */}
                    <div className="flex items-start justify-start md:justify-end">
                        <Button variant="outline" size="icon" onClick={scrollToTop}>
                            <ArrowUp className="h-4 w-4" />
                            <span className="sr-only">Back to top</span>
                        </Button>
                    </div>
                </div>

                <Separator className="my-8 bg-border" />

                <div className="text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Hitesh Gottapu. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
