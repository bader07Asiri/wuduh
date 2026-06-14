"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { label: "الميزات",    href: "/#features" },
  { label: "كيف يعمل",  href: "/#how-it-works" },
  { label: "التسعير",   href: "/pricing" },
];

function WuduhNavIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="nb-orb" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#7EC8FF" />
          <stop offset="35%" stopColor="#2563EB" />
          <stop offset="75%" stopColor="#1E3A80" />
          <stop offset="100%" stopColor="#0F172A" />
        </radialGradient>
        <linearGradient id="nb-r1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#64748B" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#94A3B8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#334155" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="nb-r2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#475569" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#CBD5E1" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#1E293B" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="nb-r3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="50%" stopColor="#E2E8F0" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <filter id="nb-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <ellipse cx="60" cy="60" rx="54" ry="20" stroke="url(#nb-r1)" strokeWidth="9" fill="none" transform="rotate(-20 60 60)" strokeLinecap="round" />
      <ellipse cx="60" cy="60" rx="42" ry="15" stroke="url(#nb-r2)" strokeWidth="10" fill="none" transform="rotate(-20 60 60)" strokeLinecap="round" />
      <ellipse cx="60" cy="60" rx="30" ry="11" stroke="url(#nb-r3)" strokeWidth="9" fill="none" transform="rotate(-20 60 60)" strokeLinecap="round" />
      <circle cx="60" cy="60" r="26" fill="url(#nb-orb)" filter="url(#nb-glow)" />
      <ellipse cx="51" cy="50" rx="9" ry="6.5" fill="white" opacity="0.18" transform="rotate(-30 51 50)" />
      <ellipse cx="63" cy="73" rx="10" ry="4" fill="#38BDF8" opacity="0.20" transform="rotate(-10 63 73)" />
    </svg>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy-950/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <WuduhNavIcon />
            <div>
              <div className="font-brand font-black text-white text-lg tracking-widest leading-none">WUDUH</div>
              <div className="text-white/40 text-[9px] font-latin tracking-wider">CLARITY IN EVERY PROJECT</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/70 hover:text-white text-sm font-medium font-arabic transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                تسجيل الدخول
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="gold" size="sm">ابدأ مجاناً</Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white p-2" onClick={() => setOpen(!open)} aria-label="القائمة">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-navy-950 border-t border-white/10 px-4 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/80 hover:text-white font-arabic py-2 text-base"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2 border-t border-white/10">
            <Link href="/login" className="flex-1">
              <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                تسجيل الدخول
              </Button>
            </Link>
            <Link href="/signup" className="flex-1">
              <Button variant="gold" className="w-full">ابدأ مجاناً</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
