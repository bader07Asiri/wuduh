import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl font-black text-slate-200 font-latin mb-4">404</div>
      <h1 className="text-2xl font-black text-slate-900 font-arabic mb-2">الصفحة غير موجودة</h1>
      <p className="text-slate-400 font-arabic mb-8">الصفحة التي تبحث عنها غير موجودة أو تم نقلها.</p>
      <Link href="/">
        <Button icon={<Home size={18} />}>العودة للرئيسية</Button>
      </Link>
    </div>
  );
}
