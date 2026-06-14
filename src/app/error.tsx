"use client";
import { Button } from "@/components/ui/Button";
import { RefreshCw } from "lucide-react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center px-4">
      <div className="text-6xl mb-4">⚠️</div>
      <h1 className="text-2xl font-black text-slate-900 font-arabic mb-2">حدث خطأ غير متوقع</h1>
      <p className="text-slate-400 font-arabic mb-8 max-w-sm">
        {error.message || "حاول مرة أخرى أو تواصل معنا إذا استمرت المشكلة."}
      </p>
      <Button onClick={reset} icon={<RefreshCw size={18} />}>حاول مرة أخرى</Button>
    </div>
  );
}
