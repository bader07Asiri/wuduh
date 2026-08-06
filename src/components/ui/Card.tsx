import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg" | "none";
}

const paddingMap = { none: "", sm: "p-4", md: "p-6", lg: "p-8" };

export function Card({ children, className, hover, padding = "md" }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-100/90 shadow-[0_1px_2px_rgba(16,32,72,0.04),0_16px_40px_-24px_rgba(16,32,72,0.16)] transition-all duration-300",
        hover && "hover:-translate-y-1 hover:border-brand-blue/20 hover:shadow-[0_1px_2px_rgba(16,32,72,0.04),0_26px_52px_-24px_rgba(37,99,235,0.24)] cursor-pointer",
        paddingMap[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn("text-lg font-bold text-slate-900 font-arabic", className)}>{children}</h3>;
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-sm text-slate-500 mt-1 font-arabic", className)}>{children}</p>;
}
