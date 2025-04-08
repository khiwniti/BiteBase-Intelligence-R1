import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export interface Props {
  /** Optional className for additional styling */
  className?: string;
}

/**
 * Main application header with navigation
 */
export const Header = ({ className = "" }: Props) => {
  const navigate = useNavigate();

  return (
    <header className={`w-full py-4 px-6 border-b border-border bg-background z-10 ${className}`}>
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary-foreground"
            >
              <path 
                d="M6 15L12 9L18 15" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold">BiteBase</h1>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-sm hover:text-primary transition-colors">Features</a>
          <a href="#benefits" className="text-sm hover:text-primary transition-colors">Benefits</a>
          <a href="#pricing" className="text-sm hover:text-primary transition-colors">Pricing</a>
          <a href="#testimonials" className="text-sm hover:text-primary transition-colors">Testimonials</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button 
            size="sm"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
};
