import React from "react";

export interface Props {
  /** Title of the metric */
  title: string;
  /** Value of the metric */
  value: string | number;
  /** Optional change value (percentage or absolute) */
  change?: string | number;
  /** Whether the change is positive */
  isPositive?: boolean;
  /** Icon for the metric */
  icon?: React.ReactNode;
  /** Optional className for additional styling */
  className?: string;
}

/**
 * Metric card component to display KPIs
 */
export const MetricCard = ({ 
  title, 
  value, 
  change, 
  isPositive = true, 
  icon, 
  className = "" 
}: Props) => {
  return (
    <div className={`bg-card p-6 rounded-lg border border-border shadow-sm ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && (
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-baseline">
        <p className="text-3xl font-bold">{value}</p>
        {change && (
          <span className={`ml-2 text-sm font-medium ${isPositive ? 'text-primary' : 'text-destructive'}`}>
            {isPositive ? '+' : ''}{change}
          </span>
        )}
      </div>
    </div>
  );
};
