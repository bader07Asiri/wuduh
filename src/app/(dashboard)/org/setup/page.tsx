"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Building2, ChevronRight, Users, Layers, FolderKanban, ShieldCheck } from "lucide-react";
import { INDUSTRY_LABELS, type Industry } from "@/types";

const ORG_BENEFITS = [
  { icon: Users, title: "إدارة الفريق", desc: "أضف أعضاء فريقك ووزّع الأدوار والصلاحيات (مالك، مشرف، عضو)." },
  { icon: Layers, title: "أقسام منظّمة", desc: "قسّم مؤسستك لإدارات (هندسة، تسويق، مالية...) واربط كل مشروع بقسمه." },
  { icon: FolderKanban, title: "مشاريع مشتركة", desc: "اجمع كل مشاريع المؤسسة في مكان واحد بدل حسابات فردية متفرقة." },
  { icon: ShieldCheck, title: "تحكّم مركزي", desc: "أنت المالك — تتحكم بمن يضيف مشاريع ومن يطّلع على المخرجات." },
];

const industryOptions = [
  { value: "", label: "اختر القطاع..." },
  ...Object.entries(INDUSTRY_LABELS).map(([v, l]) => ({ value: v, label: l })),
];

export default function OrgSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", name_en: "", industry: "", cr_number: "",
  });

  const handleSubmit = async () => {
    if (!form.name.trim()) { toast.error("اسم المؤسسة مطلوب"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/org", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "خطأ");
      }
      toast.success("تم إنشاء المؤسسة بنجاح!");
      router.push("/org/departments");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center">
          <Building2 size={24} className="text-brand-blue" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-arabic">إنشاء مؤسستك</h1>
          <p className="text-slate-400 font-arabic text-sm mt-0.5">حوّل حسابك الفردي إلى مساحة عمل لفريقك بالكامل</p>
        </div>
      </div>

      <Card className="mb-6 bg-gradient-to-br from-brand-blue/[0.04] to-brand-cyan/[0.06] border border-brand-blue/10">
        <h2 className="font-bold text-slate-900 font-arabic mb-1">ليش أنشئ مؤسسة؟</h2>
        <p className="text-slate-500 font-arabic text-sm mb-4 leading-relaxed">
          الحساب الفردي مناسب لمشاريعك الخاصة. المؤسسة تفتح لك العمل الجماعي: فريق، أقسام، ومشاريع مشتركة تحت مظلة واحدة.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ORG_BENEFITS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3 bg-white/70 rounded-xl p-3 border border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-brand-blue/10 flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-brand-blue" />
              </div>
              <div>
                <div className="font-bold text-slate-800 font-arabic text-sm">{title}</div>
                <div className="text-slate-500 font-arabic text-xs mt-0.5 leading-relaxed">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-5">
        <Input
          label="اسم المؤسسة (بالعربي) *"
          placeholder="مثال: شركة الإنشاءات السعودية"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
        <Input
          label="اسم المؤسسة (بالإنجليزي)"
          placeholder="Saudi Construction Company"
          value={form.name_en}
          onChange={e => setForm(f => ({ ...f, name_en: e.target.value }))}
        />
        <Select
          label="القطاع"
          value={form.industry}
          onChange={e => setForm(f => ({ ...f, industry: e.target.value as Industry }))}
          options={industryOptions}
        />
        <Input
          label="رقم السجل التجاري (اختياري)"
          placeholder="1010XXXXXX"
          value={form.cr_number}
          onChange={e => setForm(f => ({ ...f, cr_number: e.target.value }))}
        />

        <div className="pt-2">
          <Button
            className="w-full"
            loading={loading}
            onClick={handleSubmit}
            icon={<ChevronRight size={18} />}
          >
            إنشاء المؤسسة والمتابعة
          </Button>
        </div>
      </Card>
    </div>
  );
}
