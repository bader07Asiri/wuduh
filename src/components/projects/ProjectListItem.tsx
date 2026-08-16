"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreVertical, Pencil, Copy, Trash2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

const statusConfig: Record<string, { label: string; variant: "default" | "info" | "success" | "warning" | "danger" }> = {
  draft: { label: "مسودة", variant: "default" },
  planning: { label: "تخطيط", variant: "info" },
  active: { label: "نشط", variant: "success" },
  on_hold: { label: "موقوف", variant: "warning" },
  completed: { label: "مكتمل", variant: "success" },
  cancelled: { label: "ملغى", variant: "danger" },
};

type Project = {
  id: string; name: string; client_name?: string | null;
  start_date: string; end_date: string; status?: string; agenda_approved?: boolean;
};

export function ProjectListItem({ project }: { project: Project }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const config = statusConfig[project.status ?? "draft"] ?? statusConfig.draft;

  const go = () => router.push(`/projects/${project.id}`);

  const duplicate = async () => {
    setOpen(false); setBusy(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/duplicate`, { method: "POST" });
      if (!res.ok) throw new Error();
      const { id } = await res.json();
      toast.success("تم إنشاء نسخة — عدّل بياناتها ثم ابنِ الخطة");
      router.push(`/projects/${id}/edit`);
    } catch {
      toast.error("تعذّر إنشاء النسخة");
      setBusy(false);
    }
  };

  const remove = async () => {
    setOpen(false);
    if (!confirm(`حذف المشروع «${project.name}» نهائياً؟ لا يمكن التراجع.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("تم حذف المشروع");
      router.refresh();
    } catch {
      toast.error("تعذّر الحذف");
      setBusy(false);
    }
  };

  return (
    <Card hover className="flex items-center gap-4 relative">
      <div className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer" onClick={go}>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-blue/10 to-brand-light/10 flex items-center justify-center text-brand-blue font-black text-xl font-arabic flex-shrink-0">
          {project.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-slate-900 font-arabic truncate">{project.name}</div>
          <div className="text-xs text-slate-400 font-arabic mt-0.5 flex items-center gap-3">
            <span>{project.client_name ?? "—"}</span>
            <span>•</span>
            <span>{formatDate(project.start_date)} — {formatDate(project.end_date)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        {project.agenda_approved && <Badge variant="success" dot>أجندة معتمدة</Badge>}
        <Badge variant={config.variant}>{config.label}</Badge>

        <div className="relative">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
            disabled={busy}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="خيارات المشروع"
          >
            {busy ? <Loader2 size={18} className="animate-spin" /> : <MoreVertical size={18} />}
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute left-0 mt-1 w-48 rounded-xl border border-slate-200 bg-white shadow-lg z-20 overflow-hidden py-1">
                <button onClick={() => { setOpen(false); router.push(`/projects/${project.id}/edit`); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-arabic text-slate-700 hover:bg-slate-50 text-right">
                  <Pencil size={15} className="text-slate-400" /> تعديل المدخلات
                </button>
                <button onClick={duplicate}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-arabic text-slate-700 hover:bg-slate-50 text-right">
                  <Copy size={15} className="text-slate-400" /> إنشاء نسخة
                </button>
                <button onClick={remove}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-arabic text-red-600 hover:bg-red-50 text-right">
                  <Trash2 size={15} /> حذف المشروع
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
