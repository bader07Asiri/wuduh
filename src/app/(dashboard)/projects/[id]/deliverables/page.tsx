"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { FileDown, CheckSquare, Square, Loader2, ExternalLink, AlertTriangle } from "lucide-react";
import { DELIVERABLE_LABELS, type DeliverableType, type DeliverableFormat } from "@/types";
import { DOC_THEMES, DEFAULT_THEME_ID } from "@/lib/themes";
import { Palette, Check, Building2, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeliverableOption {
  type: DeliverableType;
  formats: DeliverableFormat[];
  recommended?: boolean;
}

const DELIVERABLE_GROUPS: { name: string; items: DeliverableOption[] }[] = [
  {
    name: "وثائق التخطيط الأساسية",
    items: [
      { type: "project_charter",     formats: ["pdf", "docx"], recommended: true },
      { type: "project_plan",        formats: ["pdf", "docx"], recommended: true },
      { type: "scope_statement",     formats: ["pdf", "docx"] },
      { type: "wbs",                 formats: ["pdf", "xlsx"], recommended: true },
      { type: "stakeholder_register",formats: ["pdf", "xlsx"] },
    ],
  },
  {
    name: "الجداول الزمنية",
    items: [
      { type: "gantt_chart",   formats: ["pdf", "xlsx"], recommended: true },
      { type: "schedule",      formats: ["pdf", "xlsx"] },
      { type: "milestone_chart", formats: ["pdf"] },
    ],
  },
  {
    name: "الموارد والميزانية",
    items: [
      { type: "resource_plan",  formats: ["pdf", "docx"] },
      { type: "budget",         formats: ["pdf", "xlsx"], recommended: true },
      { type: "cost_estimates", formats: ["xlsx"] },
    ],
  },
  {
    name: "المخاطر والجودة",
    items: [
      { type: "risk_register",  formats: ["pdf", "xlsx"], recommended: true },
      { type: "risk_response",  formats: ["pdf", "docx"] },
      { type: "quality_plan",   formats: ["pdf", "docx"] },
      { type: "quality_checklist", formats: ["pdf"] },
    ],
  },
  {
    name: "التواصل والتقارير",
    items: [
      { type: "communication_plan", formats: ["pdf", "docx"] },
      { type: "status_report",      formats: ["pdf", "docx"] },
      { type: "meeting_minutes",    formats: ["docx"] },
    ],
  },
  {
    name: "العروض التقديمية",
    items: [
      { type: "kickoff_presentation",    formats: ["pptx"], recommended: true },
      { type: "stakeholder_presentation",formats: ["pptx"] },
      { type: "progress_presentation",   formats: ["pptx"] },
    ],
  },
  {
    name: "إغلاق المشروع",
    items: [
      { type: "closure_report",    formats: ["pdf", "docx"] },
      { type: "lessons_learned",   formats: ["pdf", "docx"] },
      { type: "closure_checklist", formats: ["pdf"] },
    ],
  },
];

const FORMAT_LABELS: Record<DeliverableFormat, string> = {
  pdf: "PDF", docx: "Word", xlsx: "Excel", pptx: "PowerPoint"
};

const FORMAT_COLORS: Record<DeliverableFormat, string> = {
  pdf:  "bg-red-50 text-red-600",
  docx: "bg-blue-50 text-blue-600",
  xlsx: "bg-green-50 text-green-600",
  pptx: "bg-orange-50 text-orange-600",
};

type Selection = { type: DeliverableType; format: DeliverableFormat };
type GeneratedFile = { id?: string; type: DeliverableType; format: DeliverableFormat; url: string; status: "ready" | "generating" | "error" };

export default function DeliverablesPage() {
  const { id } = useParams<{ id: string }>();
  const [selected, setSelected] = useState<Selection[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<GeneratedFile[]>([]);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [themeId, setThemeId] = useState<string>(DEFAULT_THEME_ID);
  const [themeSearch, setThemeSearch] = useState("");
  const [showThemes, setShowThemes] = useState(false);
  const [useOrgIdentity, setUseOrgIdentity] = useState(false);
  const [includeSignature, setIncludeSignature] = useState(false);
  const [outputLang, setOutputLang] = useState<"ar" | "en">("ar");
  const activeTheme = DOC_THEMES.find(t => t.id === themeId) ?? DOC_THEMES[0];
  const filteredThemes = themeSearch
    ? DOC_THEMES.filter(t => (t.name + " " + t.nameEn).toLowerCase().includes(themeSearch.toLowerCase()))
    : DOC_THEMES;

  // Pre-select recommended
  useEffect(() => {
    const recs: Selection[] = [];
    DELIVERABLE_GROUPS.forEach(group =>
      group.items.forEach(item => {
        if (item.recommended) recs.push({ type: item.type, format: item.formats[0] });
      })
    );
    setSelected(recs);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/deliverables?projectId=${id}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!active) return;
        const saved: GeneratedFile[] = (data.deliverables || []).map(
          (d: { id: string; type: DeliverableType; format: DeliverableFormat }) => ({
            id: d.id, type: d.type, format: d.format, url: "", status: "ready" as const,
          })
        );
        if (saved.length > 0) setGenerated(saved);
      } catch { /* ignore */ }
    })();
    return () => { active = false; };
  }, [id]);

  const readyFiles = generated.filter(f => f.status === "ready" && f.id);
  const handleDownloadAll = async () => {
    if (readyFiles.length === 0) return;
    setDownloadingAll(true);
    try {
      for (const file of readyFiles) {
        const a = document.createElement("a");
        a.href = `/api/deliverables/${file.id}/download`;
        a.download = "";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        await new Promise(r => setTimeout(r, 800));
      }
    } finally {
      setDownloadingAll(false);
    }
  };

  const isSelected = (type: DeliverableType, format: DeliverableFormat) =>
    selected.some(s => s.type === type && s.format === format);

  const toggle = (type: DeliverableType, format: DeliverableFormat) => {
    if (isSelected(type, format)) {
      setSelected(s => s.filter(x => !(x.type === type && x.format === format)));
    } else {
      setSelected(s => [...s, { type, format }]);
    }
  };

  const handleGenerate = async () => {
    if (selected.length === 0) { toast.error("اختر وثيقة واحدة على الأقل"); return; }

    const alreadyReady = new Set(
      generated.filter(f => f.status === "ready").map(f => `${f.type}:${f.format}`)
    );
    const toGenerate = selected.filter(s => !alreadyReady.has(`${s.type}:${s.format}`));

    if (toGenerate.length === 0) {
      toast.info("كل الوثائق المحددة مولّدة مسبقاً — يمكنك تحميلها مباشرة دون استهلاك رصيد.");
      return;
    }
    if (toGenerate.length < selected.length) {
      toast.info(`سيتم توليد ${toGenerate.length} وثيقة جديدة فقط (الباقي مولّد مسبقاً).`);
    }

    setGenerating(true);

    setGenerated(prev => {
      const key = (t: DeliverableType, f: DeliverableFormat) => `${t}:${f}`;
      const genKeys = new Set(toGenerate.map(s => key(s.type, s.format)));
      const kept = prev.filter(f => !genKeys.has(key(f.type, f.format)));
      return [...toGenerate.map(s => ({ ...s, url: "", status: "generating" as const })), ...kept];
    });

    try {
      const res = await fetch("/api/deliverables/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: id, deliverables: toGenerate, themeId, useOrgIdentity, includeSignature, outputLang }),
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      // Map API response to GeneratedFile shape
      const files: GeneratedFile[] = (data.files || []).map((f: { id?: string; type: DeliverableType; format: DeliverableFormat; url?: string; status?: string; error?: string }) => ({
        id: f.id,
        type: f.type as DeliverableType,
        format: f.format as DeliverableFormat,
        url: f.url || "",
        status: (f.status === "ready" ? "ready" : f.status === "error" ? "error" : "generating") as "ready" | "generating" | "error",
      }));
      setGenerated(prev => {
        const key = (f: GeneratedFile) => `${f.type}:${f.format}`;
        const newKeys = new Set(files.map(key));
        const kept = prev.filter(f => !newKeys.has(key(f)));
        return [...files, ...kept];
      });
      toast.success(`تم توليد ${files.filter(f => f.status === "ready").length} وثيقة بنجاح!`);
    } catch {
      toast.error("حدث خطأ أثناء التوليد");
      setGenerated(s => s.map(f => (f.status === "generating" ? { ...f, status: "error" as const } : f)));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-arabic">توليد المخرجات</h1>
          <p className="text-slate-400 font-arabic text-sm mt-1">
            {selected.length} وثيقة محددة
          </p>
        </div>
        <Button
          icon={<FileDown size={18} />}
          loading={generating}
          disabled={selected.length === 0}
          onClick={handleGenerate}
        >
          ولّد الوثائق
        </Button>
      </div>

      {/* Theme + identity picker */}
      <Card className="mb-6">
        <button
          type="button"
          onClick={() => setShowThemes(v => !v)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Palette size={18} className="text-brand-blue" />
            <span className="font-bold text-slate-900 font-arabic">ثيم المستندات</span>
            <span className="text-xs text-slate-400 font-arabic">— اختر من {DOC_THEMES.length} ثيم</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <span className="w-4 h-4 rounded-full" style={{ background: activeTheme.dark }} />
              <span className="w-4 h-4 rounded-full" style={{ background: activeTheme.primary }} />
              <span className="w-4 h-4 rounded-full" style={{ background: activeTheme.accent }} />
            </span>
            <span className="text-sm font-arabic text-slate-600">{activeTheme.name}</span>
          </div>
        </button>

        {showThemes && (
          <div className="mt-4">
            <input
              type="text"
              value={themeSearch}
              onChange={e => setThemeSearch(e.target.value)}
              placeholder="ابحث عن ثيم بالاسم..."
              className="w-full mb-3 rounded-xl border border-slate-200 px-4 py-2 text-sm font-arabic focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-72 overflow-y-auto pr-1">
              {filteredThemes.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setThemeId(t.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border p-2 text-right transition-all",
                    t.id === themeId ? "border-brand-blue ring-1 ring-brand-blue bg-brand-blue/5" : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  <span className="flex flex-col gap-0.5 flex-shrink-0">
                    <span className="w-6 h-2 rounded-full" style={{ background: t.dark }} />
                    <span className="w-6 h-2 rounded-full" style={{ background: t.primary }} />
                    <span className="w-6 h-2 rounded-full" style={{ background: t.accent }} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-xs font-bold font-arabic text-slate-700 truncate">{t.name}</span>
                    <span className="block text-[10px] font-latin text-slate-400 truncate">{t.nameEn}</span>
                  </span>
                  {t.id === themeId && <Check size={14} className="text-brand-blue flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Org identity toggles (تسري للباقات الاحترافية والأعلى — الخادم يطبّق حسب باقتك) */}
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={useOrgIdentity} onChange={e => setUseOrgIdentity(e.target.checked)} className="rounded" />
            <Building2 size={15} className="text-slate-500" />
            <span className="text-sm font-arabic text-slate-700">استخدم هوية مؤسستي (شعار + ترويسة) — للباقات الاحترافية فأعلى</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={includeSignature} onChange={e => setIncludeSignature(e.target.checked)} className="rounded" />
            <PenLine size={15} className="text-slate-500" />
            <span className="text-sm font-arabic text-slate-700">أضف كتلة التوقيع (اسم ومنصب الموقّع من بيانات المؤسسة)</span>
          </label>
        </div>

        {/* لغة المستندات — الذكاء الاصطناعي يكتب المحتوى باللغة المختارة */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-slate-900 font-arabic text-sm">لغة المستندات</span>
            <span className="text-xs text-slate-400 font-arabic">— يُترجم المحتوى تلقائياً</span>
          </div>
          <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-slate-50">
            <button
              type="button"
              onClick={() => setOutputLang("ar")}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
                outputLang === "ar" ? "bg-white text-brand-blue shadow-sm" : "text-slate-500"
              )}
            >
              العربية
            </button>
            <button
              type="button"
              onClick={() => setOutputLang("en")}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-bold font-latin transition-all",
                outputLang === "en" ? "bg-white text-brand-blue shadow-sm" : "text-slate-500"
              )}
            >
              English
            </button>
          </div>
        </div>
      </Card>

      {/* AI Disclaimer */}
      <div className="flex items-start gap-3 bg-brand-cyan/10 border border-amber-200 rounded-2xl px-5 py-4 mb-6">
        <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 font-arabic leading-relaxed">
          <span className="font-bold text-amber-800">تنبيه: </span>
          المخرجات مولّدة بالذكاء الاصطناعي وفق PMBOK Guide 7th Edition. راجعها مع فريقك قبل الاستخدام الرسمي. وضوح لا يتحمل مسؤولية القرارات المبنية عليها دون مراجعة متخصص معتمد.
        </p>
      </div>

      {/* Generated files */}
      {generated.length > 0 && (
        <Card className="mb-6 border-2 border-emerald-500/20 bg-emerald-50/50">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-900 font-arabic flex items-center gap-2">
              <FileDown size={18} className="text-emerald-500" />
              الوثائق الجاهزة
            </h2>
            {readyFiles.length > 1 && (
              <Button size="sm" variant="outline" icon={<FileDown size={15} />} loading={downloadingAll} onClick={handleDownloadAll}>
                تحميل الكل ({readyFiles.length})
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {generated.map((file, i) => (
              <div key={i} className="flex items-center justify-between bg-white rounded-xl p-3 border border-slate-100">
                <div className="flex items-center gap-2">
                  {file.status === "generating" && <Loader2 size={14} className="animate-spin text-slate-400" />}
                  {file.status === "ready" && <CheckSquare size={14} className="text-emerald-500" />}
                  {file.status === "error" && <span className="text-red-500 text-xs">✗</span>}
                  <span className="text-sm font-arabic text-slate-700 truncate max-w-[180px]">
                    {DELIVERABLE_LABELS[file.type]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-xs px-2 py-0.5 rounded font-latin font-bold", FORMAT_COLORS[file.format])}>
                    {FORMAT_LABELS[file.format]}
                  </span>
                  {file.status === "ready" && (
                    <a
                      href={file.id ? `/api/deliverables/${file.id}/download` : file.url}
                      download
                      className="text-brand-blue hover:underline flex items-center gap-1 text-xs font-arabic"
                    >
                      <FileDown size={13} />
                      تحميل
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Selection */}
      <div className="space-y-6">
        {DELIVERABLE_GROUPS.map(({ name, items }) => (
          <Card key={name} padding="none">
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
              <h3 className="font-bold text-slate-800 font-arabic text-sm">{name}</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {items.map(({ type, formats, recommended }) => (
                <div key={type} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-2">
                    {recommended && (
                      <Badge variant="gold" className="text-[10px] px-1.5 py-0.5">موصى</Badge>
                    )}
                    <span className="text-sm font-arabic text-slate-700">{DELIVERABLE_LABELS[type]}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {formats.map(fmt => {
                      const sel = isSelected(type, fmt);
                      return (
                        <button
                          key={fmt}
                          onClick={() => toggle(type, fmt)}
                          className={cn(
                            "flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-latin font-bold transition-all",
                            sel
                              ? FORMAT_COLORS[fmt] + " ring-1 ring-current"
                              : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                          )}
                        >
                          {sel ? <CheckSquare size={12} /> : <Square size={12} />}
                          {FORMAT_LABELS[fmt]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
