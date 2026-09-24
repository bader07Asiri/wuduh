"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Building2, Save, Upload, Palette } from "lucide-react";
import { INDUSTRY_LABELS, type Industry } from "@/types";

const industryOptions = [
  { value: "", label: "اختر القطاع..." },
  ...Object.entries(INDUSTRY_LABELS).map(([v, l]) => ({ value: v, label: l })),
];

type OrgForm = {
  name: string; name_en: string; industry: string; cr_number: string;
  logo_url: string; primary_color: string; letterhead_text: string;
  signatory_name: string; signatory_title: string; department: string;
  website: string; phone: string; email: string; address: string;
};

const EMPTY: OrgForm = {
  name: "", name_en: "", industry: "", cr_number: "",
  logo_url: "", primary_color: "", letterhead_text: "",
  signatory_name: "", signatory_title: "", department: "",
  website: "", phone: "", email: "", address: "",
};

export default function OrgEditPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<OrgForm>(EMPTY);

  useEffect(() => {
    fetch("/api/org")
      .then(r => r.json())
      .then(({ org }) => {
        if (!org) { router.replace("/org/setup"); return; }
        setForm({ ...EMPTY, ...Object.fromEntries(Object.keys(EMPTY).map(k => [k, org[k] ?? ""])) } as OrgForm);
      })
      .catch(() => toast.error("تعذّر تحميل بيانات المؤسسة"))
      .finally(() => setLoading(false));
  }, [router]);

  const set = (k: keyof OrgForm, v: string) => setForm(f => ({ ...f, [k]: v }));

  const uploadLogo = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/org/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "فشل الرفع");
      set("logo_url", data.url);
      toast.success("تم رفع الشعار بنجاح");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "فشل رفع الشعار");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!form.name.trim()) { toast.error("اسم المؤسسة مطلوب"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/org", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "خطأ");
      toast.success("تم حفظ بيانات المؤسسة");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "حدث خطأ في الحفظ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;

  const colorValid = /^#?[0-9a-fA-F]{6}$/.test(form.primary_color);

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center">
          <Building2 size={24} className="text-brand-blue" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-arabic">إعدادات المؤسسة</h1>
          <p className="text-slate-400 font-arabic text-sm mt-0.5">عدّل بيانات مؤسستك وهويتها البصرية — تُطبَّق على المستندات المولّدة</p>
        </div>
      </div>

      <Card className="space-y-5">
        <Input label="اسم المؤسسة (بالعربي) *" value={form.name} onChange={e => set("name", e.target.value)} />
        <Input label="اسم المؤسسة (بالإنجليزي)" value={form.name_en} onChange={e => set("name_en", e.target.value)} />
        <Select label="القطاع" value={form.industry} onChange={e => set("industry", e.target.value as Industry)} options={industryOptions} />
        <Input label="رقم السجل التجاري" value={form.cr_number} onChange={e => set("cr_number", e.target.value)} />
      </Card>

      {/* الهوية البصرية */}
      <Card className="space-y-5 mt-6">
        <div className="flex items-center gap-2">
          <Palette size={16} className="text-brand-blue" />
          <h2 className="font-bold text-slate-900 font-arabic">الهوية البصرية</h2>
        </div>
        <p className="text-xs text-slate-400 font-arabic leading-relaxed">
          الشعار واللون الأساسي يُطبَّقان تلقائياً على غلاف المستندات وعناوينها وجداولها عند اختيار «هوية مؤسستي» أثناء التوليد.
        </p>

        {/* الشعار */}
        <div>
          <label className="text-sm font-arabic font-semibold text-slate-700 block mb-1">شعار المؤسسة</label>
          <div className="flex flex-col gap-2">
            {form.logo_url && (
              <div className="flex items-center gap-2 p-2 border border-slate-200 rounded-xl bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.logo_url} alt="Logo" className="h-10 w-auto object-contain" />
                <span className="text-xs text-slate-500 truncate flex-1">{form.logo_url}</span>
              </div>
            )}
            <label className={`flex items-center gap-2 cursor-pointer border-2 border-dashed rounded-xl px-4 py-3 transition-colors ${uploading ? "border-brand-blue bg-blue-50" : "border-slate-300 hover:border-brand-blue hover:bg-blue-50"}`}>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                disabled={uploading}
                onChange={e => { const f = e.target.files?.[0]; if (f) uploadLogo(f); e.target.value = ""; }}
              />
              {uploading ? (
                <span className="text-sm font-arabic text-brand-blue">جاري الرفع...</span>
              ) : (
                <>
                  <Upload size={16} className="text-slate-400" />
                  <span className="text-sm font-arabic text-slate-600">اضغط لرفع شعار (PNG أو JPG أو WebP — بحد أقصى 2MB)</span>
                </>
              )}
            </label>
          </div>
        </div>

        {/* اللون الأساسي */}
        <div>
          <label className="text-sm font-arabic font-semibold text-slate-700 block mb-1">اللون الأساسي للعلامة</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={colorValid ? (form.primary_color.startsWith("#") ? form.primary_color : `#${form.primary_color}`) : "#2563EB"}
              onChange={e => set("primary_color", e.target.value)}
              className="w-11 h-11 rounded-xl border border-slate-200 cursor-pointer p-0.5"
            />
            <Input value={form.primary_color} placeholder="#1E3A80" onChange={e => set("primary_color", e.target.value)} className="w-40 font-latin text-sm" />
            <span className="text-xs text-slate-400 font-arabic">يُشتقّ منه ثيم المستند كاملاً</span>
          </div>
        </div>

        <Input label="نص الترويسة (لتر هيد)" value={form.letterhead_text} onChange={e => set("letterhead_text", e.target.value)} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="اسم الموقّع" value={form.signatory_name} onChange={e => set("signatory_name", e.target.value)} />
          <Input label="منصب الموقّع" value={form.signatory_title} onChange={e => set("signatory_title", e.target.value)} />
          <Input label="القسم" value={form.department} onChange={e => set("department", e.target.value)} />
          <Input label="الهاتف" value={form.phone} onChange={e => set("phone", e.target.value)} />
          <Input label="الموقع الإلكتروني" value={form.website} onChange={e => set("website", e.target.value)} />
          <Input label="البريد الإلكتروني" value={form.email} onChange={e => set("email", e.target.value)} />
        </div>
        <Input label="العنوان" value={form.address} onChange={e => set("address", e.target.value)} />
      </Card>

      <div className="flex gap-3 mt-6">
        <Button icon={<Save size={18} />} loading={saving} onClick={save} className="flex-1">حفظ التعديلات</Button>
      </div>
    </div>
  );
}
