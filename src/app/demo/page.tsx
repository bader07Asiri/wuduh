"use client";

// ============================
// وضوح | Wuduh — الوضع التجريبي (عام، بدون تسجيل دخول)
// بيانات وهمية بالكامل: لا ذكاء، لا استهلاك توكن، لا قاعدة بيانات.
// «التوليد» يحاكي النجاح ويعطي ملف نموذج جاهز من /public/samples.
// ============================

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, FolderKanban, FileText, Wallet, Settings,
  Sparkles, Download, Loader2, Check, FlaskConical, ArrowLeft, Users, ShieldAlert, CalendarRange,
} from "lucide-react";

type Nav = "dashboard" | "projects" | "deliverables" | "finance" | "settings";

const SAMPLES: Record<string, { label: string; file: string; fmt: "Word" | "Excel" | "PowerPoint"; icon: typeof FileText }> = {
  charter:   { label: "ميثاق المشروع",        file: "نموذج-ميثاق-المشروع.docx",     fmt: "Word",       icon: FileText },
  plan:      { label: "خطة إدارة المشروع",     file: "نموذج-خطة-المشروع.docx",       fmt: "Word",       icon: FileText },
  wbs:       { label: "هيكل تجزئة العمل",       file: "نموذج-هيكل-تجزئة-العمل.xlsx",   fmt: "Excel",      icon: FolderKanban },
  risk:      { label: "سجل المخاطر",           file: "نموذج-سجل-المخاطر.xlsx",        fmt: "Excel",      icon: ShieldAlert },
  budget:    { label: "ميزانية المشروع",       file: "نموذج-الميزانية.xlsx",          fmt: "Excel",      icon: Wallet },
  kickoff:   { label: "عرض انطلاق المشروع",     file: "نموذج-عرض-الانطلاق.pptx",       fmt: "PowerPoint", icon: Sparkles },
};

const FMT_COLOR: Record<string, string> = {
  Word: "bg-blue-50 text-blue-600",
  Excel: "bg-green-50 text-green-600",
  PowerPoint: "bg-orange-50 text-orange-600",
};

const NAV_ITEMS: { key: Nav; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { key: "projects", label: "المشاريع", icon: FolderKanban },
  { key: "deliverables", label: "المخرجات", icon: FileText },
  { key: "finance", label: "المالية", icon: Wallet },
  { key: "settings", label: "الإعدادات", icon: Settings },
];

export default function DemoPage() {
  const [nav, setNav] = useState<Nav>("dashboard");
  // حالة كل مخرج: idle | generating | ready
  const [status, setStatus] = useState<Record<string, "idle" | "generating" | "ready">>({});

  const generate = (key: string) => {
    if (status[key] === "generating") return;
    setStatus(s => ({ ...s, [key]: "generating" }));
    setTimeout(() => setStatus(s => ({ ...s, [key]: "ready" })), 1400);
  };
  const generateAll = () => Object.keys(SAMPLES).forEach((k, i) => setTimeout(() => generate(k), i * 250));

  return (
    <div dir="rtl" className="min-h-screen bg-[#FBFCFE] text-[#0E1B33] font-arabic">
      {/* شريط الوضع التجريبي */}
      <div className="sticky top-0 z-30 flex items-center justify-between gap-3 bg-gradient-to-l from-brand-blue to-[#00B4D8] px-4 py-2.5 text-white">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <FlaskConical size={16} />
          <span>الوضع التجريبي — بيانات وهمية، بدون ذكاء ولا استهلاك. تجوّل في النظام بحرية.</span>
        </div>
        <Link href="/signup" className="hidden sm:inline-flex items-center gap-1 rounded-lg bg-white/15 px-3 py-1 text-xs font-bold hover:bg-white/25 transition">
          أنشئ حساباً حقيقياً <ArrowLeft size={13} />
        </Link>
      </div>

      <div className="flex">
        {/* الشريط الجانبي */}
        <aside className="hidden lg:flex w-60 shrink-0 flex-col gap-1 border-l border-slate-200 bg-white p-4 min-h-[calc(100vh-44px)]">
          <div className="mb-5 flex items-center gap-2 px-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/wuduh-assets/logo-full-light.png" alt="وضوح" className="h-10 w-auto object-contain" />
          </div>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = nav === item.key;
            return (
              <button key={item.key} onClick={() => setNav(item.key)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-brand-blue text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}>
                <Icon size={18} /> {item.label}
              </button>
            );
          })}
          <div className="mt-auto rounded-xl bg-slate-50 p-3 text-xs text-slate-500 leading-relaxed">
            هذه نسخة استعراضية. للحصول على مستندات حقيقية بالذكاء الاصطناعي،{" "}
            <Link href="/signup" className="font-bold text-brand-blue">سجّل حساباً</Link>.
          </div>
        </aside>

        {/* المحتوى */}
        <main className="flex-1 p-5 sm:p-8 max-w-6xl mx-auto w-full">
          {nav === "dashboard" && <Dashboard onOpen={() => setNav("deliverables")} />}
          {nav === "projects" && <Projects onOpen={() => setNav("deliverables")} />}
          {nav === "deliverables" && <Deliverables status={status} generate={generate} generateAll={generateAll} />}
          {nav === "finance" && <Finance />}
          {nav === "settings" && <SettingsView />}
        </main>
      </div>
    </div>
  );
}

// ---------- مكوّنات مساعدة ----------
function Card({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return <div onClick={onClick} className={`rounded-2xl border border-slate-100 bg-white shadow-[0_1px_2px_rgba(16,32,72,0.04),0_16px_40px_-24px_rgba(16,32,72,0.16)] ${className}`}>{children}</div>;
}
function Title({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-black text-slate-900">{children}</h1>
      {sub && <p className="text-sm text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}
function Stat({ label, value, tint }: { label: string; value: string; tint: string }) {
  return (
    <Card className="p-5">
      <div className={`w-10 h-10 rounded-xl ${tint} mb-3`} />
      <div className="text-2xl font-black text-slate-900">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </Card>
  );
}

const PROJECT = {
  name: "منصة حجز المواعيد الطبية «موعِد»",
  client: "مجمع النخبة الطبي",
  budget: "850,000 ر.س",
  team: "8 أعضاء",
  duration: "26 أسبوعاً",
  methodology: "هجينة (Agile-Waterfall)",
  desc: "تطوير وإطلاق منصة رقمية (ويب + جوال) لحجز المواعيد الطبية بمجمع النخبة، مع تكامل آمن مع نظام المعلومات الصحية الحالي.",
};

function Dashboard({ onOpen }: { onOpen: () => void }) {
  return (
    <>
      <Title sub="نظرة عامة على نشاطك (بيانات تجريبية)">أهلاً بك 👋</Title>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="المشاريع النشطة" value="1" tint="bg-blue-100" />
        <Stat label="المستندات المولّدة" value="6" tint="bg-cyan-100" />
        <Stat label="أصحاب المصلحة" value="5" tint="bg-emerald-100" />
        <Stat label="المخاطر المرصودة" value="3" tint="bg-amber-100" />
      </div>
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs font-bold text-brand-blue mb-1">مشروع تجريبي</div>
            <h3 className="text-lg font-bold text-slate-900">{PROJECT.name}</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">{PROJECT.desc}</p>
          </div>
          <button onClick={onOpen} className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 transition">
            عرض المخرجات <ArrowLeft size={15} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          {[["العميل", PROJECT.client], ["الميزانية", PROJECT.budget], ["الفريق", PROJECT.team], ["المدة", PROJECT.duration]].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-slate-50 p-3">
              <div className="text-[11px] text-slate-400">{k}</div>
              <div className="text-sm font-bold text-slate-800">{v}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function Projects({ onOpen }: { onOpen: () => void }) {
  return (
    <>
      <Title sub="مشاريعك (بيانات تجريبية)">المشاريع</Title>
      <Card className="p-6 cursor-pointer hover:border-brand-blue/30 transition" onClick={onOpen}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-brand-blue/10 grid place-items-center"><FolderKanban className="text-brand-blue" size={20} /></div>
            <div>
              <h3 className="font-bold text-slate-900">{PROJECT.name}</h3>
              <p className="text-xs text-slate-500">{PROJECT.client} • {PROJECT.methodology}</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1">نشط</span>
        </div>
        <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1"><Users size={14} /> {PROJECT.team}</span>
          <span className="inline-flex items-center gap-1"><CalendarRange size={14} /> {PROJECT.duration}</span>
          <span className="inline-flex items-center gap-1"><Wallet size={14} /> {PROJECT.budget}</span>
        </div>
      </Card>
    </>
  );
}

function Deliverables({ status, generate, generateAll }:
  { status: Record<string, "idle" | "generating" | "ready">; generate: (k: string) => void; generateAll: () => void }) {
  const anyReady = Object.values(status).some(s => s === "ready");
  return (
    <>
      <Title sub="اختر مستنداً و«ولّده» — في الوضع التجريبي تحصل على ملف نموذج جاهز فوراً بدون ذكاء.">مخرجات المشروع</Title>
      <div className="flex items-center gap-3 mb-5">
        <button onClick={generateAll} className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition">
          <Sparkles size={16} /> توليد الكل
        </button>
        {anyReady && <span className="text-xs text-emerald-600 font-semibold inline-flex items-center gap-1"><Check size={14} /> جاهز للتنزيل</span>}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(SAMPLES).map(([key, s]) => {
          const st = status[key] || "idle";
          const Icon = s.icon;
          return (
            <Card key={key} className="p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl bg-slate-50 grid place-items-center"><Icon className="text-brand-blue" size={20} /></div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${FMT_COLOR[s.fmt]}`}>{s.fmt}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{s.label}</h3>
              {st === "ready" ? (
                <a href={`/samples/${encodeURIComponent(s.file)}`} download
                  className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 text-emerald-700 px-3 py-2 text-sm font-bold hover:bg-emerald-100 transition">
                  <Download size={15} /> تنزيل النموذج
                </a>
              ) : (
                <button onClick={() => generate(key)} disabled={st === "generating"}
                  className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 text-slate-700 px-3 py-2 text-sm font-bold hover:bg-slate-200 transition disabled:opacity-70">
                  {st === "generating" ? (<><Loader2 size={15} className="animate-spin" /> جارٍ التوليد…</>) : (<><Sparkles size={15} /> توليد</>)}
                </button>
              )}
            </Card>
          );
        })}
      </div>
    </>
  );
}

function Finance() {
  const rows = [
    ["إيرادات الاشتراكات", "12,400 ر.س", "text-emerald-600"],
    ["تكلفة التوكن (الذكاء)", "1,180 ر.س", "text-rose-600"],
    ["صافي الربح", "11,220 ر.س", "text-emerald-600"],
  ];
  return (
    <>
      <Title sub="أرقام تجريبية توضيحية فقط">المالية</Title>
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {rows.map(([k, v, c]) => (
          <Card key={k} className="p-5">
            <div className="text-sm text-slate-500">{k}</div>
            <div className={`text-2xl font-black mt-1 ${c}`}>{v}</div>
          </Card>
        ))}
      </div>
      <Card className="p-6 text-sm text-slate-500">
        توزيع الدخل: إعادة شحن التوكن، ادخار الطوارئ، الاحتياطي، والأرباح — يُحسب تلقائياً في النسخة الحقيقية.
      </Card>
    </>
  );
}

function SettingsView() {
  return (
    <>
      <Title sub="نظرة على الإعدادات (تجريبي)">الإعدادات</Title>
      <Card className="p-6 space-y-4">
        {[["الباقة الحالية", "احترافية (تجريبي)"], ["اللغة", "العربية"], ["المؤسسة", "مجمع النخبة الطبي"]].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
            <span className="text-sm text-slate-500">{k}</span>
            <span className="text-sm font-bold text-slate-800">{v}</span>
          </div>
        ))}
        <p className="text-xs text-slate-400">في الوضع التجريبي لا يمكن تعديل الإعدادات.</p>
      </Card>
    </>
  );
}
