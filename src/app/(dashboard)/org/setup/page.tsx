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
    logo_url: "", primary_color: "", letterhead_text: "",
    signatory_name: "", signatory_title: "", department: "",
    website: "", phone: "", email: "", address: "",
  });
  const [showIdentity, setShowIdentity] = useState(false);

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

        {/* الهوية البصرية (اختياري — تظهر في مستندات الباقات الاحترافية فأعلى) */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowIdentity(v => !v)}
            className="text-sm font-bold text-brand-blue font-arabic"
          >
            {showIdentity ? "− إخفاء" : "+ إضافة"} الهوية البصرية (شعار، ترويسة، توقيع)
          </button>
          <p className="text-xs text-slate-400 font-arabic mt-1">
            تُطبّق تلقائياً على المستندات المولّدة للباقات الاحترافية والأعلى.
          </p>
        </div>

        {showIdentity && (
          <div className="space-y-4">
            <Input
              label="رابط شعار المؤسسة (URL)"
              placeholder="https://.../logo.png"
              value={form.logo_url}
              onChange={e => setForm(f => ({ ...f, logo_url: e.target.value }))}
            />
            <Input
              label="نص الترويسة (لتر هيد)"
              placeholder="العنوان • الهاتف • الموقع الإلكتروني"
              value={form.letterhead_text}
              onChange={e => setForm(f => ({ ...f, letterhead_text: e.target.value }))}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="اسم الموقّع"
                placeholder="م. عبدالله العسيري"
                value={form.signatory_name}
                onChange={e => setForm(f => ({ ...f, signatory_name: e.target.value }))}
              />
              <Input
                label="منصب الموقّع"
                placeholder="مدير المشاريع"
                value={form.signatory_title}
                onChange={e => setForm(f => ({ ...f, signatory_title: e.target.value }))}
              />
              <Input
                label="القسم"
                placeholder="إدارة المشاريع"
                value={form.department}
                onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
              />
              <Input
                label="اللون الأساسي (Hex)"
                placeholder="#1E3A80"
                value={form.primary_color}
                onChange={e => setForm(f => ({ ...f, primary_color: e.target.value }))}
              />
              <Input
                label="الهاتف"
                placeholder="+9665xxxxxxxx"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              />
              <Input
                label="الموقع الإلكتروني"
                placeholder="www.example.com"
                value={form.website}
                onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
              />
              <Input
                label="البريد الإلكتروني"
                placeholder="info@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
              <Input
                label="العنوان"
                placeholder="الرياض، السعودية"
                value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              />
            </div>
          </div>
        )}

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
