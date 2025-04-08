import React from "react";
import { Header } from "components/Header";
import { HeroSection } from "components/HeroSection";
import { FeatureCard } from "components/FeatureCard";
import { Footer } from "components/Footer";
import { AppLayout } from "components/AppLayout";

export default function App() {
  // Example features for the landing page
  const features = [
    {
      title: "Market Analysis",
      description: "Comprehensive market research with demographic and competitive data to inform your business decisions.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 21H3V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 14L12 9L16 13L21 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      title: "Location Intelligence",
      description: "Interactive maps and geospatial analysis to find the ideal location for your restaurant.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 7V20L8 17L3 20V7L8 4L15 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 7L21 4V17L15 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      title: "Competitor Analysis",
      description: "Detailed insights on nearby competitors, including menu, pricing, and customer reviews.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 21V19C16 16.7909 14.2091 15 12 15H5C2.79086 15 1 16.7909 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M23 21V19C22.9986 17.1771 21.765 15.5857 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 3.13C18.7699 3.55134 20.0078 5.14742 20.0078 7.00001C20.0078 8.8526 18.7699 10.4487 17 10.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
  ];

  return (
    <AppLayout>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <section className="py-20 px-4" id="features">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              BiteBase Intelligence provides everything you need to make data-driven decisions for your restaurant business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted" id="benefits">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Image/Visualization */}
            <div className="md:w-1/2">
              <div className="aspect-square max-w-md mx-auto bg-card rounded-lg p-6 shadow-lg">
                <div className="w-full h-full rounded bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="rounded-full bg-background p-6 shadow-lg">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                      <path d="M22 11.0801V12.0001C21.9988 14.1565 21.3005 16.2548 20.0093 17.9819C18.7182 19.7091 16.9033 20.9726 14.8354 21.584C12.7674 22.1954 10.5573 22.122 8.53447 21.3747C6.51168 20.6274 4.78465 19.2462 3.61096 17.4372C2.43727 15.6281 1.87979 13.4882 2.02168 11.3364C2.16356 9.18467 2.99721 7.13643 4.39828 5.49718C5.79935 3.85793 7.69279 2.71549 9.79619 2.24025C11.8996 1.76502 14.1003 1.98245 16.07 2.86011" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold">Why Choose BiteBase?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2 bg-primary/10 text-primary mt-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Data-Driven Decisions</h3>
                    <p className="text-muted-foreground">Make confident business decisions backed by comprehensive market data and analytics.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2 bg-primary/10 text-primary mt-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Competitive Edge</h3>
                    <p className="text-muted-foreground">Identify gaps in the market and position your restaurant for success with strategic insights.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2 bg-primary/10 text-primary mt-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Time & Resource Savings</h3>
                    <p className="text-muted-foreground">Reduce research time and costs with our comprehensive platform that consolidates all necessary market data.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Restaurant Business?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of restaurant entrepreneurs making data-driven decisions with BiteBase Intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto justify-center">
            <button className="bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Start Free Trial
            </button>
            <button className="bg-card border border-border py-3 px-6 rounded-lg font-medium hover:bg-muted transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
