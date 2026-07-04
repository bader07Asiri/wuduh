"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FolderOpen, PlusCircle,
  Settings, LogOut, ChevronRight,
  Building2, Users, Layers, ShieldCheck, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useClerk, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";

const navItems = [
  { label: "لوحة التحكم", href: "/dashboard",    icon: LayoutDashboard },
  { label: "مشاريعي",     href: "/projects",     icon: FolderOpen },
  { label: "مشروع جديد", href: "/projects/new", icon: PlusCircle, highlight: true },
];

const orgItems = [
  { label: "الأقسام", href: "/org/departments", icon: Layers },
  { label: "الأعضاء", href: "/org/members",     icon: Users },
];

const bottomItems = [
  { label: "الإعدادات", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [orgName, setOrgName] = useState<string | null>(null);

  const isAdmin = user?.emailAddresses?.some(
    e => e.emailAddress.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  );

  useEffect(() => {
    fetch("/api/org")
      .then(r => r.json())
      .then(d => { if (d.org) setOrgName(d.org.name); })
      .catch(() => {});
  }, []);

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-navy-950 border-l border-white/10 fixed right-0 top-0">

      {/* ── Logo ──────────────────────────────────────── */}
      <div className="flex items-center justify-center px-5 py-4 border-b border-white/10">
        <Link href="/dashboard">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-full.png" alt="وضوح Wuduh" className="h-12 w-auto object-contain" />
        </Link>
      </div>

      {/* ── Main Nav ──────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ label, href, icon: Icon, highlight }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium font-arabic transition-all duration-200",
                active
                  ? "bg-brand-blue text-white shadow-glow"
                  : highlight
                  ? "bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/25 hover:bg-brand-cyan/25"
                  : "text-white/60 hover:text-white hover:bg-white/8"
              )}
            >
              <Icon size={18} />
              <span>{label}</span>
              {active && <ChevronRight size={14} className="mr-auto opacity-60" />}
            </Link>
          );
        })}

        {isAdmin && (
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium font-arabic transition-all duration-200 mt-2",
              pathname.startsWith("/admin")
                ? "bg-brand-light text-navy-950 font-bold"
                : "text-brand-light/70 hover:text-brand-light hover:bg-brand-light/10"
            )}
          >
            <ShieldCheck size={18} />
            <span>لوحة الأدمن</span>
          </Link>
        )}
      </nav>

      {/* ── Org Section ───────────────────────────────── */}
      <div className="px-3 pb-3">
        {orgName ? (
          <>
            <div className="px-4 py-2 mb-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Building2 size={11} className="text-brand-light" />
                <span className="text-white/40 text-[10px] font-arabic tracking-wider">المؤسسة</span>
              </div>
              <div className="text-white/80 text-xs font-arabic font-bold truncate">{orgName}</div>
            </div>
            {orgItems.map(({ label, href, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium font-arabic transition-all",
                    active ? "bg-brand-blue text-white" : "text-white/60 hover:text-white hover:bg-white/8"
                  )}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                  {active && <ChevronRight size={14} className="mr-auto opacity-60" />}
                </Link>
              );
            })}
          </>
        ) : (
          <Link
            href="/org/setup"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-arabic text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
          >
            <Building2 size={16} />
            <span>إنشاء مؤسسة</span>
          </Link>
        )}
      </div>

      {/* ── Upgrade Banner ────────────────────────────── */}
      <div className="mx-3 mb-3 p-3 rounded-xl border border-brand-blue/30 bg-gradient-to-br from-brand-royal/20 to-brand-blue/10">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles size={14} className="text-brand-cyan" />
          <span className="text-white text-xs font-bold font-arabic">ترقية الخطة</span>
        </div>
        <p className="text-white/55 text-xs font-arabic leading-relaxed mb-2">
          احصل على مشاريع غير محدودة وكل المخرجات
        </p>
        <Link href="/settings" className="block text-center text-xs font-bold text-brand-cyan hover:underline font-arabic">
          ترقية الآن ←
        </Link>
      </div>

      {/* ── Bottom ────────────────────────────────────── */}
      <div className="px-3 pb-4 border-t border-white/10 pt-3 space-y-1">
        {bottomItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium font-arabic transition-all",
              pathname === href ? "bg-brand-blue text-white" : "text-white/60 hover:text-white hover:bg-white/8"
            )}
          >
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}

        <div className="flex items-center gap-3 px-3 py-3 mt-1 rounded-xl hover:bg-white/5 transition-all">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-cyan flex items-center justify-center text-white text-xs font-bold font-brand flex-shrink-0">
            {user?.firstName?.[0]?.toUpperCase() ?? "م"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-bold font-arabic truncate">{user?.firstName ?? "المستخدم"}</div>
            <div className="text-white/40 text-[11px] font-latin truncate">{user?.emailAddresses?.[0]?.emailAddress}</div>
          </div>
          <button
            onClick={() => signOut()}
            className="text-white/30 hover:text-white/70 transition-colors flex-shrink-0"
            title="تسجيل الخروج"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

    </aside>
  );
}
