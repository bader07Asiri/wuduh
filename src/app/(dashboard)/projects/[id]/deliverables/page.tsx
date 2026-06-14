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
    setGenerating(true);

    // Initialize all as "generating"
    setGenerated(selected.map(s => ({ ...s, url: "", status: "generating" as const })));

    try {
      const res = await fetch("/api/deliverables/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: id, deliverables: selected }),
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
      setGenerated(files);
      toast.success(`تم توليد ${files.filter(f => f.status === "ready").length} وثيقة بنجاح!`);
    } catch {
      toast.error("حدث خطأ أثناء التوليد");
      setGenerated(s => s.map(f => ({ ...f, status: "error" as const })));
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
          <h2 className="font-bold text-slate-900 font-arabic mb-3 flex items-center gap-2">
            <FileDown size={18} className="text-emerald-500" />
            الوثائق الجاهزة
          </h2>
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
