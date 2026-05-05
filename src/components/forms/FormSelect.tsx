"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, options, className, id, ...props }, ref) => {
    const backupId = React.useId();
    const selectId = id || backupId;

    return (
      <div className="flex w-full flex-col gap-1.5">
        <label htmlFor={selectId} className="text-sm font-medium text-text-primary">
          {label}
        </label>
        <select
          id={selectId}
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer",
            error && "border-error focus:ring-error",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${selectId}-error`} className="text-xs font-medium text-error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
FormSelect.displayName = "FormSelect";

export { FormSelect };
