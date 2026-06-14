import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 bg-brand-gradient relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-light/10 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-black text-white font-arabic mb-4">
          جاهز تبدأ مشروعك الآن؟
        </h2>
        <p className="text-xl text-white/70 font-arabic mb-10 leading-relaxed">
          انضم لمئات المشاريع التي تُدار بوضوح.
          <br />أول مشروع مجاني تماماً — لا تحتاج بطاقة ائتمان.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button variant="gold" size="lg" className="w-full sm:w-auto px-8">
              ابدأ مجاناً — الآن
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 border-white/30 text-white hover:bg-white/10">
              لديّ حساب بالفعل
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
