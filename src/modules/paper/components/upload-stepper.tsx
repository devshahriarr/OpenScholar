"use client";

import { Check, Upload, FileText, Eye, Send } from "lucide-react";
import { clsx } from "clsx";

const STEPS = [
  { id: 1, label: "Upload PDF", icon: Upload },
  { id: 2, label: "Add Metadata", icon: FileText },
  { id: 3, label: "Preview", icon: Eye },
  { id: 4, label: "Submit", icon: Send },
];

export function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="card-premium p-8 mb-8 border-none shadow-sm bg-surface">
      <div className="flex items-center justify-between max-w-5xl mx-auto relative px-4">
        {/* Connector Lines */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-border -translate-y-[22px] z-0"></div>
        <div 
          className="absolute top-1/2 left-0 h-[2px] bg-green-500 transition-all duration-500 -translate-y-[22px] z-0"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        ></div>

        {STEPS.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
              <div
                className={clsx(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                  isCompleted ? "bg-green-500 border-green-500 text-white" :
                  isActive ? "bg-green-500 border-green-500 text-white" :
                  "bg-surface border-border text-text-muted"
                )}
              >
                {isCompleted ? <Check size={20} /> : <Icon size={20} />}
              </div>
              <span className={clsx(
                "text-[11px] font-bold uppercase tracking-widest",
                isActive || isCompleted ? "text-text-primary" : "text-text-muted"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
