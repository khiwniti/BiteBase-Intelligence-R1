import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { useCurrentUser } from "app";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

export interface Props {
  /** The content of the dashboard */
  children: React.ReactNode;
  /** Optional className for additional styling */
  className?: string;
}

/**
 * Dashboard layout component with sidebar navigation
 */
export const DashboardLayout = ({ children, className = "" }: Props) => {
  const { user, loading } = useCurrentUser();
  const { t } = useTranslation();
  
  // Show loading state while auth is being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  return (
    <div className={`flex flex-col md:flex-row min-h-screen bg-background ${className}`}>
      <Sidebar className="md:h-screen h-auto" />
      
      <div className="flex-1 overflow-auto bg-background">
        <div className="flex justify-end p-4">
          <LanguageSwitcher />
        </div>
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
