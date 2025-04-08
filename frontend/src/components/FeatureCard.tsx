import React from "react";

export interface Props {
  /** Title of the feature */
  title: string;
  /** Description of the feature */
  description: string;
  /** Icon component for the feature */
  icon: React.ReactNode;
  /** Optional className for additional styling */
  className?: string;
}

/**
 * Feature card component to highlight product features
 */
export const FeatureCard = ({ title, description, icon, className = "" }: Props) => {
  return (
    <div className={`bg-card p-6 rounded-lg border border-border shadow-sm ${className}`}>
      <div className="p-3 rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mt-4 mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
