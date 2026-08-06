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

  const linkBase = "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium font-arabic transition-all duration-200";
  const inactive = "text-slate-500 hover:text-slate-900 hover:bg-slate-100";

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white border-l border-slate-200 fixed right-0 top-0">

      {/* ── Logo ──────────────────────────────────────── */}
      <div className="flex items-center justify-center px-5 py-4 border-b border-slate-100">
        <Link href="/dashboard">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/wuduh-assets/logo-full-light.png" alt="وضوح Wuduh" className="h-12 w-auto object-contain" />
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
                linkBase,
                active
                  ? "bg-brand-blue text-white shadow-sm"
                  : highlight
                  ? "bg-brand-blue/10 text-brand-blue border border-brand-blue/20 hover:bg-brand-blue/15"
                  : inactive
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
              linkBase, "mt-2",
              pathname.startsWith("/admin")
                ? "bg-[#17306A] text-white font-bold"
                : "text-slate-500 hover:text-[#17306A] hover:bg-slate-100"
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
                <Building2 size={11} className="text-brand-blue" />
                <span className="text-slate-400 text-[10px] font-arabic tracking-wider">المؤسسة</span>
              </div>
              <div className="text-slate-700 text-xs font-arabic font-bold truncate">{orgName}</div>
            </div>
            {orgItems.map(({ label, href, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(linkBase, active ? "bg-brand-blue text-white" : inactive)}
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
            className={cn(linkBase, "text-slate-400 hover:text-slate-700 hover:bg-slate-100")}
          >
            <Building2 size={16} />
            <span>إنشاء مؤسسة</span>
          </Link>
        )}
      </div>

      {/* ── Upgrade Banner ────────────────────────────── */}
      <div className="mx-3 mb-3 p-3 rounded-xl border border-brand-blue/15 bg-gradient-to-br from-brand-blue/5 to-brand-cyan/5">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles size={14} className="text-brand-blue" />
          <span className="text-slate-900 text-xs font-bold font-arabic">ترقية الخطة</span>
        </div>
        <p className="text-slate-500 text-xs font-arabic leading-relaxed mb-2">
          احصل على مشاريع غير محدودة وكل المخرجات
        </p>
        <Link href="/settings" className="block text-center text-xs font-bold text-brand-blue hover:underline font-arabic">
          ترقية الآن ←
        </Link>
      </div>

      {/* ── Bottom ────────────────────────────────────── */}
      <div className="px-3 pb-4 border-t border-slate-100 pt-3 space-y-1">
        {bottomItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(linkBase, pathname === href ? "bg-brand-blue text-white" : inactive)}
          >
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}

        <div className="flex items-center gap-3 px-3 py-3 mt-1 rounded-xl hover:bg-slate-100 transition-all">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-cyan flex items-center justify-center text-white text-xs font-bold font-brand flex-shrink-0">
            {user?.firstName?.[0]?.toUpperCase() ?? "م"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-slate-900 text-sm font-bold font-arabic truncate">{user?.firstName ?? "المستخدم"}</div>
            <div className="text-slate-400 text-[11px] font-latin truncate">{user?.emailAddresses?.[0]?.emailAddress}</div>
          </div>
          <button
            onClick={() => signOut()}
            className="text-slate-300 hover:text-slate-600 transition-colors flex-shrink-0"
            title="تسجيل الخروج"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

    </aside>
  );
}
