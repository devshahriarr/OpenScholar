"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { clsx } from "clsx";

export function AdminStatCard({ 
  label, 
  value, 
  trend, 
  icon: Icon, 
  color = "primary" 
}: { 
  label: string; 
  value: string; 
  trend: string; 
  icon: any; 
  color?: "primary" | "success" | "warning" | "purple";
}) {
  const colors = {
    primary: "bg-primary-light text-primary",
    success: "bg-green-50 text-green-600",
    warning: "bg-orange-50 text-orange-500",
    purple: "bg-purple-50 text-purple-600",
  };

  const isPositive = trend.startsWith("+");

  return (
    <div className="card-premium p-6">
      <div className="flex justify-between items-start mb-4">
        <div className={clsx("p-3 rounded-xl", colors[color])}>
          <Icon size={24} />
        </div>
        <div className={clsx(
          "flex items-center gap-1 text-sm font-bold",
          isPositive ? "text-green-600" : "text-red-500"
        )}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {trend}
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-extrabold text-text-primary mb-1">{value}</h3>
        <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}
