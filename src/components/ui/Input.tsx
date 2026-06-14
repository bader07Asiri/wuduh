"use client";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-slate-700 font-arabic">
          {label}
          {props.required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 font-arabic",
            "placeholder:text-slate-400 text-base",
            "focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent",
            "disabled:bg-slate-50 disabled:cursor-not-allowed",
            "transition-all duration-150",
            error && "border-red-400 focus:ring-red-400",
            icon && "pr-10",
            className
          )}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-500 font-arabic">{error}</span>}
      {hint && !error && <span className="text-xs text-slate-400 font-arabic">{hint}</span>}
    </div>
  )
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-slate-700 font-arabic">
          {label}
          {props.required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 font-arabic",
          "placeholder:text-slate-400 text-base resize-none",
          "focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent",
          "disabled:bg-slate-50 disabled:cursor-not-allowed",
          "transition-all duration-150",
          error && "border-red-400 focus:ring-red-400",
          className
        )}
        rows={4}
        {...props}
      />
      {error && <span className="text-xs text-red-500 font-arabic">{error}</span>}
      {hint && !error && <span className="text-xs text-slate-400 font-arabic">{hint}</span>}
    </div>
  )
);
Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-slate-700 font-arabic">
          {label}
          {props.required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 font-arabic",
          "focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent",
          "disabled:bg-slate-50 disabled:cursor-not-allowed transition-all duration-150",
          error && "border-red-400",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500 font-arabic">{error}</span>}
    </div>
  )
);
Select.displayName = "Select";
