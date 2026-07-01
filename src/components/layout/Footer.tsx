import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-navy-950 text-white/50 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="وضوح Wuduh" className="h-10 w-auto object-contain" />
            </div>
            <p className="text-sm font-arabic leading-relaxed max-w-xs text-white/50">
              إدارة مشاريعك باحترافية PMP — بدون مدير مشاريع. وفق معايير PMI العالمية.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-white font-bold text-sm font-arabic mb-4">المنتج</h4>
            <ul className="space-y-3">
              {[
                { label: "الميزات",    href: "/#features" },
                { label: "كيف يعمل",  href: "/#how-it-works" },
                { label: "التسعير",   href: "/pricing" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm font-arabic hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-white font-bold text-sm font-arabic mb-4">الشركة</h4>
            <ul className="space-y-3">
              {[
                { label: "من نحن",           href: "/about" },
                { label: "تواصل معنا",       href: "/contact" },
                { label: "سياسة الخصوصية", href: "/privacy" },
                { label: "شروط الاستخدام", href: "/terms" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm font-arabic hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-arabic">
            © {new Date().getFullYear()} وضوح | Wuduh — جميع الحقوق محفوظة
          </p>
          <p className="text-xs font-arabic">
            مبني وفق معايير <span className="text-brand-cyan font-bold">PMI / PMBOK Guide 7th Edition</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
