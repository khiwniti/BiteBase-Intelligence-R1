import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export interface Props {
  /** The content of the page */
  children: React.ReactNode;
  /** Whether to show the header */
  showHeader?: boolean;
  /** Whether to show the footer */
  showFooter?: boolean;
  /** Optional className for additional styling */
  className?: string;
}

/**
 * App layout component for consistent page structure
 */
export const AppLayout = ({ 
  children, 
  showHeader = true, 
  showFooter = true,
  className = "" 
}: Props) => {
  return (
    <div className={`flex flex-col min-h-screen ${className}`}>
      {showHeader && <Header />}
      
      <main className="flex-1">
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
};
