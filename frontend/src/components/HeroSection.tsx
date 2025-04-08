import React from "react";
import { Button } from "@/components/ui/button";

export interface Props {
  /** Optional className for additional styling */
  className?: string;
}

/**
 * Hero section component for landing page
 */
export const HeroSection = ({ className = "" }: Props) => {
  return (
    <section className={`py-20 px-4 bg-gradient-to-b from-background to-muted ${className}`}>
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Content */}
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Data-Driven Restaurant Market Intelligence
            </h1>
            <p className="text-lg text-muted-foreground">
              Empower your restaurant business with comprehensive market research 
              and analytics to make informed decisions and outperform competitors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="px-8">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="px-8">
                Request Demo
              </Button>
            </div>
          </div>
          
          {/* Image/Visualization */}
          <div className="lg:w-1/2">
            <div className="aspect-video bg-card rounded-lg border border-border shadow-lg overflow-hidden p-4">
              <div className="w-full h-full rounded bg-muted flex items-center justify-center">
                {/* Placeholder for visualization */}
                <div className="text-center space-y-4">
                  <div className="inline-flex rounded-full bg-primary/10 p-6">
                    <svg 
                      width="40" 
                      height="40" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-primary"
                    >
                      <path 
                        d="M21 21H3V3" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />
                      <path 
                        d="M7 14L12 9L16 13L21 8" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Market Intelligence Dashboard</h3>
                  <p className="text-sm text-muted-foreground">Interactive visualization of market data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
