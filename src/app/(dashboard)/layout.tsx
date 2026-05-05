import * as React from "react";
import DashboardNav from "@/components/dashboard/DashboardNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardNav />
      <div className="flex flex-1">
        {children}
      </div>
    </div>
  );
}
