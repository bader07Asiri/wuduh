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

const ADMIN_EMAIL = "info@nailart.sa";

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

/* ── Wuduh 3D Orbital Logo Icon ──────────────────────────── */
function WuduhIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sb-orb" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#7EC8FF" />
          <stop offset="35%" stopColor="#2563EB" />
          <stop offset="75%" stopColor="#1E3A80" />
          <stop offset="100%" stopColor="#0F172A" />
        </radialGradient>
        <linearGradient id="sb-r1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#64748B" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#94A3B8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#334155" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="sb-r2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#475569" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#CBD5E1" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#1E293B" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="sb-r3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="50%" stopColor="#E2E8F0" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <filter id="sb-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Outer ring */}
      <ellipse cx="60" cy="60" rx="54" ry="20" stroke="url(#sb-r1)" strokeWidth="9" fill="none" transform="rotate(-20 60 60)" strokeLinecap="round" />
      {/* Middle ring */}
      <ellipse cx="60" cy="60" rx="42" ry="15" stroke="url(#sb-r2)" strokeWidth="10" fill="none" transform="rotate(-20 60 60)" strokeLinecap="round" />
      {/* Inner ring */}
      <ellipse cx="60" cy="60" rx="30" ry="11" stroke="url(#sb-r3)" strokeWidth="9" fill="none" transform="rotate(-20 60 60)" strokeLinecap="round" />
      {/* Sphere */}
      <circle cx="60" cy="60" r="26" fill="url(#sb-orb)" filter="url(#sb-glow)" />
      {/* Specular highlight */}
      <ellipse cx="51" cy="50" rx="9" ry="6.5" fill="white" opacity="0.18" transform="rotate(-30 51 50)" />
      {/* Rim light */}
      <ellipse cx="63" cy="73" rx="10" ry="4" fill="#38BDF8" opacity="0.20" transform="rotate(-10 63 73)" />
    </svg>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [orgName, setOrgName] = useState<string | null>(null);

  const isAdmin = user?.emailAddresses?.some(e => e.emailAddress === ADMIN_EMAIL);

  useEffect(() => {
    fetch("/api/org")
      .then(r => r.json())
      .then(d => { if (d.org) setOrgName(d.org.name); })
      .catch(() => {});
  }, []);

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-navy-950 border-l border-white/10 fixed right-0 top-0">

      {/* ── Logo ──────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
        <WuduhIcon size={42} />
        <div>
          <div className="font-brand font-black text-white text-lg tracking-widest leading-none">WUDUH</div>
          <div className="text-white/40 text-[10px] font-arabic tracking-wider mt-0.5">CLARITY IN EVERY PROJECT</div>
        </div>
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
