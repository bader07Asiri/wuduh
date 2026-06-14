"use client";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "gold" | "cyan";
type Size    = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:   "bg-brand-blue text-white hover:bg-blue-700 shadow-sm",
  secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200",
  outline:   "border-2 border-brand-blue text-brand-blue hover:bg-blue-50",
  ghost:     "text-slate-600 hover:bg-slate-100",
  danger:    "bg-red-500 text-white hover:bg-red-600",
  // gold → brand cyan accent (brand identity has no gold)
  gold:      "bg-gradient-to-r from-brand-blue to-brand-cyan text-white hover:opacity-90 shadow-glow",
  cyan:      "bg-brand-cyan text-navy-950 font-bold hover:opacity-90 shadow-glow-cyan",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-5 py-2.5 text-base gap-2",
  lg: "px-7 py-3.5 text-lg gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, icon, children, className, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-arabic",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" size={size === "sm" ? 14 : 18} /> : icon}
      {children}
    </button>
  )
);

Button.displayName = "Button";
