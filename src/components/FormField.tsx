import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  "data-error"?: boolean;
};

export function FormField({ label, htmlFor, error, required, children, className, "data-error": dataError }: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)} data-error={dataError ? "true" : undefined}>
      <label htmlFor={htmlFor} className="mini-label">
        {label}
        {required && <span className="text-amber-400/70 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-red-300/90 text-xs mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}
    </div>
  );
}
