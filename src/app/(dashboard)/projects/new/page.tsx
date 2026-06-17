"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, Plus, X, Sparkles } from "lucide-react";
import type { ProjectFormData } from "@/types";

const steps = ["معلومات المشروع", "الأهداف والتفاصيل", "المراجعة والإرسال"];

export default function NewProjectPage() {
  const router = useRouter();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<ProjectFormData>({
    name: "",
    description: "",
    client_name: "",
    start_date: "",
    end_date: "",
    budget: undefined,
    currency: "SAR",
    team_size: 1,
    objectives: [""],
    constraints: "",
    assumptions: "",
    pmbok_edition: "7",
  });

  const set = (field: keyof ProjectFormData, value: unknown) =>
    setForm(f => ({ ...f, [field]: value }));

  const addObjective = () => set("objectives", [...form.objectives, ""]);
  const removeObjective = (i: number) =>
    set("objectives", form.objectives.filter((_, idx) => idx !== i));
  const updateObjective = (i: number, val: string) => {
    const arr = [...form.objectives];
    arr[i] = val;
    set("objectives", arr);
  };

  const handleSubmit = async () => {
    const validObjectives = form.objectives.filter(o => o.trim());
    if (!form.name || !form.start_date || !form.end_date || validObjectives.length === 0) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, objectives: validObjectives }),
      });

      if (!res.ok) throw new Error();
      const { id } = await res.json();
      toast.success("تم إنشاء المشروع، وضوح يبني أجندتك الآن...");
      router.push(`/projects/${id}`);
    } catch {
      toast.error("حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => step > 0 ? setStep(s => s - 1) : router.push("/dashboard")}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-500" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-arabic">مشروع جديد</h1>
          <p className="text-slate-400 font-arabic text-sm">الخطوة {step + 1} من {steps.length}</p>
        </div>
      </div>

      {/* Step Tabs */}
      <div className="flex gap-2 mb-8">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`flex-1 h-1.5 rounded-full transition-all ${i <= step ? "bg-brand-blue" : "bg-slate-200"}`}
          />
        ))}
      </div>

      <Card>
        {/* Step 0: Basic Info */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-black text-slate-900 font-arabic mb-1">{steps[0]}</h2>
              <p className="text-slate-400 font-arabic text-sm">المعلومات الأساسية عن مشروعك</p>
            </div>

            <Input
              label="اسم المشروع"
              required
              placeholder="مثال: مشروع توسعة المبنى الإداري"
              value={form.name}
              onChange={e => set("name", e.target.value)}
            />

            <Textarea
              label="وصف المشروع"
              required
              placeholder="اشرح مشروعك بإيجاز"
              value={form.description}
              onChange={e => set("description", e.target.value)}
              rows={3}
            />

            <Input
              label="العميل / الجهة المستفيدة"
              placeholder="مثال: وزارة الإسكان"
              value={form.client_name ?? ""}
              onChange={e => set("client_name", e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="تاريخ البداية"
                type="date"
                required
                value={form.start_date}
                onChange={e => set("start_date", e.target.value)}
              />
              <Input
                label="تاريخ النهاية المتوقع"
                type="date"
                required
                value={form.end_date}
                onChange={e => set("end_date", e.target.value)}
                min={form.start_date}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Input
                  label="الميزانية التقديرية"
                  type="number"
                  placeholder="0"
                  value={form.budget ?? ""}
                  onChange={e => set("budget", Number(e.target.value) || undefined)}
                />
              </div>
              <Select
                label="العملة"
                value={form.currency}
                onChange={e => set("currency", e.target.value)}
                options={[
                  { value: "SAR", label: "ريال سعودي" },
                  { value: "USD", label: "دولار أمريكي" },
                  { value: "EUR", label: "يورو" },
                ]}
              />
            </div>

            <Input
              label="عدد أعضاء الفريق"
              type="number"
              required
              min={1}
              value={form.team_size}
              onChange={e => set("team_size", Number(e.target.value))}
            />

            {/* PMBoK Edition */}
            <div>
              <label className="text-sm font-semibold text-slate-700 font-arabic block mb-2">
                إصدار PMBoK المرجعي
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(["7", "8"] as const).map((val) => {
                  const meta = {
                    "7": { title: "الإصدار السابع", desc: "12 مبدأ - 8 مجالات أداء - بدون عمليات محددة" },
                    "8": { title: "الإصدار الثامن", desc: "6 مبادئ - 7 مجالات - 40 عملية (2025)" },
                  }[val];
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => set("pmbok_edition", val)}
                      className={`text-right p-4 rounded-xl border-2 transition-all ${
                        form.pmbok_edition === val
                          ? "border-brand-blue bg-brand-blue/5"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="font-bold text-slate-900 font-arabic text-sm">{meta.title}</div>
                      <div className="text-xs text-slate-400 font-arabic mt-1">{meta.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button className="w-full" onClick={() => setStep(1)} disabled={!form.name || !form.start_date || !form.end_date}>
              التالي
            </Button>
          </div>
        )}

        {/* Step 1: Objectives */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-black text-slate-900 font-arabic mb-1">{steps[1]}</h2>
              <p className="text-slate-400 font-arabic text-sm">أهداف واضحة تساعد الذكاء الاصطناعي على بناء خطة دقيقة</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 font-arabic block mb-2">
                أهداف المشروع <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {form.objectives.map((obj, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      className="flex-1"
                      placeholder={`هدف ${i + 1} - مثال: إنجاز الهيكل الإنشائي قبل نهاية الربع الأول`}
                      value={obj}
                      onChange={e => updateObjective(i, e.target.value)}
                    />
                    {form.objectives.length > 1 && (
                      <button
                        onClick={() => removeObjective(i)}
                        className="p-2.5 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors text-slate-400"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addObjective}
                  className="flex items-center gap-2 text-sm text-brand-blue font-arabic hover:underline mt-1"
                >
                  <Plus size={16} />
                  إضافة هدف
                </button>
              </div>
            </div>

            <Textarea
              label="القيود والمحددات"
              placeholder="مثال: ميزانية محدودة، جدول زمني صارم..."
              value={form.constraints ?? ""}
              onChange={e => set("constraints", e.target.value)}
              rows={3}
              hint="اختياري - يساعد في بناء خطة أكثر واقعية"
            />

            <Textarea
              label="الافتراضات"
              placeholder="مثال: أن التصاريح ستكون جاهزة قبل بدء التنفيذ..."
              value={form.assumptions ?? ""}
              onChange={e => set("assumptions", e.target.value)}
              rows={3}
              hint="اختياري"
            />

            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setStep(0)}>رجوع</Button>
              <Button
                className="flex-1"
                onClick={() => setStep(2)}
                disabled={form.objectives.filter(o => o.trim()).length === 0}
              >
                التالي
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-black text-slate-900 font-arabic mb-1">{steps[2]}</h2>
              <p className="text-slate-400 font-arabic text-sm">راجع المعلومات قبل أن يبدأ وضوح في بناء الخطة</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 space-y-3">
              {[
                { label: "اسم المشروع", value: form.name },
                { label: "العميل", value: form.client_name || "غير محدد" },
                { label: "المدة", value: `${form.start_date} - ${form.end_date}` },
                { label: "الميزانية", value: form.budget ? `${form.budget.toLocaleString()} ${form.currency}` : "غير محددة" },
                { label: "حجم الفريق", value: `${form.team_size} شخص` },
                { label: "إصدار PMBoK", value: form.pmbok_edition === "8" ? "الثامن (2025)" : "السابع" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm font-arabic">
                  <span className="text-slate-400">{label}</span>
                  <span className="font-medium text-slate-800">{value}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-200">
                <div className="text-slate-400 text-sm font-arabic mb-2">الأهداف:</div>
                {form.objectives.filter(o => o.trim()).map((obj, i) => (
                  <div key={i} className="text-sm text-slate-700 font-arabic flex gap-2">
                    <span className="text-brand-blue">*</span>
                    {obj}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Sparkles size={18} className="text-brand-blue mt-0.5 flex-shrink-0" />
                <div className="font-arabic text-sm text-slate-700">
                  <strong className="text-brand-blue">سيقوم وضوح بـ:</strong> بناء أجندة كاملة تشمل المراحل والمهام وتحليل المخاطر والموارد وفق معايير PMI.
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setStep(1)}>رجوع</Button>
              <Button
                className="flex-1"
                loading={loading}
                icon={<Sparkles size={18} />}
                onClick={handleSubmit}
              >
                ابنِ الخطة الآن
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
