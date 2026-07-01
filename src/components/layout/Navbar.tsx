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

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy-950/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="وضوح Wuduh" className="h-9 w-auto object-contain" />
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
