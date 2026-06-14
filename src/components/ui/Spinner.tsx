import { cn } from "@/lib/utils";

export function Spinner({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizes = { sm: "w-4 h-4", md: "w-7 h-7", lg: "w-12 h-12" };
  return (
    <div className={cn("relative", sizes[size], className)}>
      <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
      <div className="absolute inset-0 rounded-full border-2 border-brand-blue border-t-transparent animate-spin" />
    </div>
  );
}

export function LoadingScreen({ message = "جارٍ التحميل..." }: { message?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
      <Spinner size="lg" />
      <p className="text-slate-600 font-arabic font-medium">{message}</p>
    </div>
  );
}
