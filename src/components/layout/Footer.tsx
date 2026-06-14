import Link from "next/link";

function WuduhFooterIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ft-orb" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#7EC8FF" />
          <stop offset="35%" stopColor="#2563EB" />
          <stop offset="75%" stopColor="#1E3A80" />
          <stop offset="100%" stopColor="#0F172A" />
        </radialGradient>
        <linearGradient id="ft-r1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#64748B" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#94A3B8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#334155" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="ft-r2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#475569" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#CBD5E1" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#1E293B" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="ft-r3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="50%" stopColor="#E2E8F0" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <filter id="ft-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <ellipse cx="60" cy="60" rx="54" ry="20" stroke="url(#ft-r1)" strokeWidth="9" fill="none" transform="rotate(-20 60 60)" strokeLinecap="round" />
      <ellipse cx="60" cy="60" rx="42" ry="15" stroke="url(#ft-r2)" strokeWidth="10" fill="none" transform="rotate(-20 60 60)" strokeLinecap="round" />
      <ellipse cx="60" cy="60" rx="30" ry="11" stroke="url(#ft-r3)" strokeWidth="9" fill="none" transform="rotate(-20 60 60)" strokeLinecap="round" />
      <circle cx="60" cy="60" r="26" fill="url(#ft-orb)" filter="url(#ft-glow)" />
      <ellipse cx="51" cy="50" rx="9" ry="6.5" fill="white" opacity="0.18" transform="rotate(-30 51 50)" />
      <ellipse cx="63" cy="73" rx="10" ry="4" fill="#38BDF8" opacity="0.20" transform="rotate(-10 63 73)" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-navy-950 text-white/50 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <WuduhFooterIcon />
              <div>
                <div className="font-brand font-black text-white text-xl tracking-widest leading-none">WUDUH</div>
                <div className="text-white/40 text-[9px] font-latin tracking-wider mt-0.5">CLARITY IN EVERY PROJECT</div>
              </div>
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

          {/* Support links */}
          <div>
            <h4 className="text-white font-bold text-sm font-arabic mb-4">الدعم</h4>
            <ul className="space-y-3">
              {[
                { label: "مركز المساعدة",   href: "#" },
                { label: "تواصل معنا",       href: "#" },
                { label: "سياسة الخصوصية", href: "#" },
                { label: "شروط الاستخدام", href: "#" },
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
