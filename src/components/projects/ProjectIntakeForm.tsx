"use client";
import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import {
  ArrowLeft, Plus, X, Sparkles, ChevronDown, Gauge, Save,
  Target, Users, Layers, Calendar, Wallet, AlertTriangle, ShieldCheck,
  Upload, FileSpreadsheet, Loader2, Download,
} from "lucide-react";
import type {
  ProjectFormData, IntakeDetails, StakeholderInput,
  TeamRoleInput, MilestoneInput, CostLineInput, InfluenceLevel, ProjectMethodology,
} from "@/types";

const steps = ["الأساسيات", "الأهداف والتفاصيل", "المراجعة والإرسال"];

// ============ Data-strength scoring ============
function scoreIntake(intake: IntakeDetails): number {
  const has = (v: unknown) =>
    Array.isArray(v) ? v.some((x) => (typeof x === "string" ? x.trim() : x)) : !!(typeof v === "string" ? v.trim() : v);
  const checks: [boolean, number][] = [
    [has(intake.deliverables), 14], [has(intake.out_of_scope), 7], [has(intake.acceptance_criteria), 7],
    [has(intake.sponsor), 8], [has(intake.stakeholders), 14], [has(intake.team_roles), 12],
    [has(intake.methodology), 5], [has(intake.milestones), 10], [has(intake.budget_breakdown), 6],
    [has(intake.funding_source), 4], [has(intake.known_risks), 7], [has(intake.quality_standards), 3], [has(intake.kpis), 3],
  ];
  return checks.reduce((s, [ok, w]) => s + (ok ? w : 0), 0);
}
function strengthMeta(score: number) {
  if (score < 25) return { label: "ضعيفة", color: "#EF4444", hint: "بهذا القدر ستكون المستندات عامة — الذكاء سيفترض معظم التفاصيل." };
  if (score < 50) return { label: "متوسطة", color: "#F59E0B", hint: "جيدة كبداية، لكن أضف أصحاب المصلحة والمخرجات لدقّة أعلى." };
  if (score < 80) return { label: "جيدة", color: "#2563EB", hint: "مستندات قوية ومحددة. أكمل الأقسام الباقية للوصول للامتياز." };
  return { label: "ممتازة", color: "#10B981", hint: "بيانات وافية — المستندات ستكون خاصة بمشروعك ودقيقة." };
}

function StrengthMeter({ score }: { score: number }) {
  const m = strengthMeta(score);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Gauge size={16} style={{ color: m.color }} />
          <span className="text-sm font-bold font-arabic text-slate-700">قوة البيانات</span>
        </div>
        <span className="text-sm font-black font-arabic" style={{ color: m.color }}>{m.label} · {score}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${score}%`, backgroundColor: m.color }} />
      </div>
      <p className="text-xs font-arabic text-slate-400 mt-2 leading-relaxed">{m.hint}</p>
    </div>
  );
}

function Section({
  title, subtitle, icon, filled, open, onToggle, children,
}: {
  id?: string; title: string; subtitle: string; icon: React.ReactNode; filled: boolean;
  open: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden">
      <button type="button" onClick={onToggle} className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-right">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${filled ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>{icon}</div>
        <div className="flex-1">
          <div className="font-bold text-slate-800 font-arabic text-sm flex items-center gap-2">
            {title}
            {filled && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-arabic">تمّت</span>}
          </div>
          <div className="text-xs text-slate-400 font-arabic">{subtitle}</div>
        </div>
        <ChevronDown size={18} className={`text-slate-400 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="p-4 pt-0 space-y-3">{children}</div>}
    </div>
  );
}

function StringRepeater({
  values, onChange, placeholder, addLabel,
}: { values?: string[]; onChange: (v: string[]) => void; placeholder: (i: number) => string; addLabel: string }) {
  const list = values && values.length ? values : [""];
  const update = (i: number, val: string) => { const a = [...list]; a[i] = val; onChange(a); };
  const remove = (i: number) => onChange(list.filter((_, idx) => idx !== i));
  const add = () => onChange([...list, ""]);
  return (
    <div className="space-y-2">
      {list.map((v, i) => (
        <div key={i} className="flex gap-2">
          <Input className="flex-1" placeholder={placeholder(i)} value={v} onChange={(e) => update(i, e.target.value)} />
          {list.length > 1 && (
            <button type="button" onClick={() => remove(i)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"><X size={18} /></button>
          )}
        </div>
      ))}
      <button type="button" onClick={add} className="flex items-center gap-2 text-sm text-brand-blue font-arabic hover:underline"><Plus size={16} /> {addLabel}</button>
    </div>
  );
}

const LEVELS: { value: InfluenceLevel; label: string }[] = [
  { value: "high", label: "عالٍ" }, { value: "medium", label: "متوسط" }, { value: "low", label: "منخفض" },
];

const DEFAULT_FORM: ProjectFormData = {
  name: "", description: "", client_name: "",
  start_date: "", end_date: "", budget: undefined, currency: "SAR",
  team_size: 1, objectives: [""], constraints: "", assumptions: "",
  pmbok_edition: "7", intake: {},
};

// ============ المكوّن المشترك (إنشاء / تعديل) ============
export function ProjectIntakeForm({
  mode = "create", projectId, initial,
}: { mode?: "create" | "edit"; projectId?: string; initial?: ProjectFormData }) {
  const router = useRouter();
  const isEdit = mode === "edit";
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ scope: true });
  const [form, setForm] = useState<ProjectFormData>(initial ?? DEFAULT_FORM);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof ProjectFormData, value: unknown) => setForm((f) => ({ ...f, [field]: value }));
  const intake = form.intake ?? {};
  const setIntake = (key: keyof IntakeDetails, value: unknown) =>
    setForm((f) => ({ ...f, intake: { ...(f.intake ?? {}), [key]: value } }));
  const toggle = (id: string) => setOpenSections((s) => ({ ...s, [id]: !s[id] }));
  const strength = useMemo(() => scoreIntake(intake), [intake]);

  // رفع قالب Excel وتعبئة الحقول تلقائياً (يُقرأ على السيرفر)
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/projects/parse-template", { method: "POST", body: fd });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "");
      const { form: p } = await res.json();
      setForm(prev => ({
        ...prev,
        name: p.name || prev.name,
        description: p.description || prev.description,
        client_name: p.client_name || prev.client_name,
        start_date: p.start_date || prev.start_date,
        end_date: p.end_date || prev.end_date,
        budget: p.budget ?? prev.budget,
        currency: p.currency || prev.currency,
        team_size: p.team_size || prev.team_size,
        objectives: (p.objectives && p.objectives.length) ? p.objectives : prev.objectives,
        constraints: p.constraints || prev.constraints,
        assumptions: p.assumptions || prev.assumptions,
        pmbok_edition: (p.pmbok_edition as "7" | "8") || prev.pmbok_edition,
        intake: { ...(prev.intake ?? {}), ...(p.intake ?? {}) },
      }));
      toast.success("تمت تعبئة الحقول من الملف — راجعها قبل الاعتماد.");
    } catch (err) {
      toast.error("تعذّر قراءة الملف. تأكد أنه القالب الصحيح.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const addObjective = () => set("objectives", [...form.objectives, ""]);
  const removeObjective = (i: number) => set("objectives", form.objectives.filter((_, idx) => idx !== i));
  const updateObjective = (i: number, val: string) => { const arr = [...form.objectives]; arr[i] = val; set("objectives", arr); };

  const stakeholders = intake.stakeholders ?? [];
  const addStakeholder = () => setIntake("stakeholders", [...stakeholders, { name: "", role: "", influence: "medium", interest: "medium" }]);
  const updateStakeholder = (i: number, patch: Partial<StakeholderInput>) => { const a = [...stakeholders]; a[i] = { ...a[i], ...patch }; setIntake("stakeholders", a); };
  const removeStakeholder = (i: number) => setIntake("stakeholders", stakeholders.filter((_, idx) => idx !== i));

  const roles = intake.team_roles ?? [];
  const addRole = () => setIntake("team_roles", [...roles, { role: "", count: 1 }]);
  const updateRole = (i: number, patch: Partial<TeamRoleInput>) => { const a = [...roles]; a[i] = { ...a[i], ...patch }; setIntake("team_roles", a); };
  const removeRole = (i: number) => setIntake("team_roles", roles.filter((_, idx) => idx !== i));

  const milestones = intake.milestones ?? [];
  const addMilestone = () => setIntake("milestones", [...milestones, { name: "", date: "" }]);
  const updateMilestone = (i: number, patch: Partial<MilestoneInput>) => { const a = [...milestones]; a[i] = { ...a[i], ...patch }; setIntake("milestones", a); };
  const removeMilestone = (i: number) => setIntake("milestones", milestones.filter((_, idx) => idx !== i));

  const costs = intake.budget_breakdown ?? [];
  const addCost = () => setIntake("budget_breakdown", [...costs, { category: "", amount: undefined }]);
  const updateCost = (i: number, patch: Partial<CostLineInput>) => { const a = [...costs]; a[i] = { ...a[i], ...patch }; setIntake("budget_breakdown", a); };
  const removeCost = (i: number) => setIntake("budget_breakdown", costs.filter((_, idx) => idx !== i));

  const cleanIntake = (): IntakeDetails => {
    const s = (arr?: string[]) => (arr ?? []).map((x) => x.trim()).filter(Boolean);
    const out: IntakeDetails = {};
    if (s(intake.deliverables).length) out.deliverables = s(intake.deliverables);
    if (s(intake.out_of_scope).length) out.out_of_scope = s(intake.out_of_scope);
    if (intake.acceptance_criteria?.trim()) out.acceptance_criteria = intake.acceptance_criteria.trim();
    if (intake.sponsor?.trim()) out.sponsor = intake.sponsor.trim();
    const sh = (intake.stakeholders ?? []).filter((x) => x.name.trim() || x.role.trim());
    if (sh.length) out.stakeholders = sh;
    const tr = (intake.team_roles ?? []).filter((x) => x.role.trim());
    if (tr.length) out.team_roles = tr;
    if (intake.methodology) out.methodology = intake.methodology;
    const ms = (intake.milestones ?? []).filter((x) => x.name.trim());
    if (ms.length) out.milestones = ms;
    const bb = (intake.budget_breakdown ?? []).filter((x) => x.category.trim());
    if (bb.length) out.budget_breakdown = bb;
    if (intake.funding_source?.trim()) out.funding_source = intake.funding_source.trim();
    if (s(intake.known_risks).length) out.known_risks = s(intake.known_risks);
    if (intake.quality_standards?.trim()) out.quality_standards = intake.quality_standards.trim();
    if (s(intake.kpis).length) out.kpis = s(intake.kpis);
    return out;
  };

  const handleSubmit = async () => {
    const validObjectives = form.objectives.filter((o) => o.trim());
    if (!form.name || !form.start_date || !form.end_date || validObjectives.length === 0) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }
    setLoading(true);
    try {
      if (isEdit && projectId) {
        const res = await fetch(`/api/projects/${projectId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name, description: form.description, client_name: form.client_name,
            start_date: form.start_date, end_date: form.end_date, budget: form.budget,
            currency: form.currency, team_size: form.team_size, objectives: validObjectives,
            constraints: form.constraints, assumptions: form.assumptions, pmbok_edition: form.pmbok_edition,
            intake_details: cleanIntake(),
          }),
        });
        if (!res.ok) throw new Error();
        toast.success("تم حفظ التعديلات");
        router.push(`/projects/${projectId}`);
      } else {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, objectives: validObjectives, intake: cleanIntake() }),
        });
        if (!res.ok) throw new Error();
        const { id } = await res.json();
        toast.success("تم إنشاء المشروع، وضوح يبني أجندتك الآن...");
        router.push(`/projects/${id}`);
      }
    } catch {
      toast.error("حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => (step > 0 ? setStep((s) => s - 1) : router.push(isEdit && projectId ? `/projects/${projectId}` : "/dashboard"))}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <ArrowLeft size={20} className="text-slate-500" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-arabic">{isEdit ? "تعديل المشروع" : "مشروع جديد"}</h1>
          <p className="text-slate-400 font-arabic text-sm">الخطوة {step + 1} من {steps.length}</p>
        </div>
      </div>

      {isEdit && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5">
          <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="font-arabic text-xs text-amber-800 leading-relaxed">
            بعد حفظ التعديلات، ارجع لصفحة المشروع وأعد بناء الخطة (الأجندة) ثم ولّد المستندات من جديد لتعكس التغييرات.
          </p>
        </div>
      )}

      <div className="flex gap-2 mb-8">
        {steps.map((s, i) => (<div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${i <= step ? "bg-brand-blue" : "bg-slate-200"}`} />))}
      </div>

      <Card>
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-black text-slate-900 font-arabic mb-1">{steps[0]}</h2>
              <p className="text-slate-400 font-arabic text-sm">المعلومات الأساسية عن مشروعك</p>
            </div>

            {/* تعبئة سريعة عبر رفع قالب Excel */}
            <div className="rounded-2xl border border-brand-blue/20 bg-brand-blue/5 p-4">
              <div className="flex items-center gap-2 mb-1">
                <FileSpreadsheet size={18} className="text-brand-blue" />
                <span className="font-bold text-slate-800 font-arabic text-sm">عندك بيانات كثيرة؟ عبّها في ملف وارفعه</span>
              </div>
              <p className="text-xs text-slate-500 font-arabic mb-3 leading-relaxed">
                حمّل القالب، اكتب فيه بياناتك بأريحية، ثم ارفعه لتتعبأ كل الحقول تلقائياً — وتراجعها قبل الاعتماد.
              </p>
              <div className="flex flex-wrap gap-2">
                <a href="/templates/قالب-بيانات-المشروع.xlsx" download
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-arabic font-bold text-slate-700 hover:border-brand-blue/40 transition">
                  <Download size={15} /> تحميل القالب
                </a>
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-3 py-2 text-sm font-arabic font-bold text-white hover:bg-blue-700 transition disabled:opacity-70">
                  {uploading ? <><Loader2 size={15} className="animate-spin" /> جارٍ القراءة…</> : <><Upload size={15} /> رفع ملف معبّأ</>}
                </button>
                <input ref={fileRef} type="file" accept=".xlsx,.xls" onChange={handleUpload} className="hidden" />
              </div>
            </div>

            <Input label="اسم المشروع" required placeholder="مثال: مشروع توسعة المبنى الإداري" value={form.name} onChange={(e) => set("name", e.target.value)} />
            <Textarea label="وصف المشروع" required placeholder="اشرح مشروعك بإيجاز — السياق، لماذا يُنفّذ، والنتيجة المرجوّة" value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} />
            <Input label="العميل / الجهة المستفيدة" placeholder="مثال: وزارة الإسكان" value={form.client_name ?? ""} onChange={(e) => set("client_name", e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="تاريخ البداية" type="date" required value={form.start_date} onChange={(e) => set("start_date", e.target.value)} />
              <Input label="تاريخ النهاية المتوقع" type="date" required value={form.end_date} onChange={(e) => set("end_date", e.target.value)} min={form.start_date} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Input label="الميزانية التقديرية" type="number" placeholder="0" value={form.budget ?? ""} onChange={(e) => set("budget", Number(e.target.value) || undefined)} />
              </div>
              <Select label="العملة" value={form.currency} onChange={(e) => set("currency", e.target.value)}
                options={[{ value: "SAR", label: "ريال سعودي" }, { value: "USD", label: "دولار أمريكي" }, { value: "EUR", label: "يورو" }]} />
            </div>
            <Input label="عدد أعضاء الفريق" type="number" required min={1} value={form.team_size} onChange={(e) => set("team_size", Number(e.target.value))} />
            <div>
              <label className="text-sm font-semibold text-slate-700 font-arabic block mb-2">إصدار PMBoK المرجعي</label>
              <div className="grid grid-cols-2 gap-3">
                {(["7", "8"] as const).map((val) => {
                  const meta = {
                    "7": { title: "الإصدار السابع", desc: "12 مبدأ - 8 مجالات أداء - بدون عمليات محددة" },
                    "8": { title: "الإصدار الثامن", desc: "6 مبادئ - 7 مجالات - 40 عملية (2025)" },
                  }[val];
                  return (
                    <button key={val} type="button" onClick={() => set("pmbok_edition", val)}
                      className={`text-right p-4 rounded-xl border-2 transition-all ${form.pmbok_edition === val ? "border-brand-blue bg-brand-blue/5" : "border-slate-200 hover:border-slate-300"}`}>
                      <div className="font-bold text-slate-900 font-arabic text-sm">{meta.title}</div>
                      <div className="text-xs text-slate-400 font-arabic mt-1">{meta.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
            <Button className="w-full" onClick={() => setStep(1)} disabled={!form.name || !form.description || !form.start_date || !form.end_date}>التالي</Button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-black text-slate-900 font-arabic mb-1">{steps[1]}</h2>
              <p className="text-slate-400 font-arabic text-sm">كل ما أضفت تفاصيل أدق، بنى وضوح مستندات أقوى وأخصّ بمشروعك.</p>
            </div>
            <StrengthMeter score={strength} />
            <div>
              <label className="text-sm font-semibold text-slate-700 font-arabic block mb-2">أهداف المشروع <span className="text-red-500">*</span></label>
              <div className="space-y-2">
                {form.objectives.map((obj, i) => (
                  <div key={i} className="flex gap-2">
                    <Input className="flex-1" placeholder={`هدف ${i + 1} - مثال: إنجاز الهيكل الإنشائي قبل نهاية الربع الأول`} value={obj} onChange={(e) => updateObjective(i, e.target.value)} />
                    {form.objectives.length > 1 && (<button onClick={() => removeObjective(i)} className="p-2.5 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors text-slate-400"><X size={18} /></button>)}
                  </div>
                ))}
                <button onClick={addObjective} className="flex items-center gap-2 text-sm text-brand-blue font-arabic hover:underline mt-1"><Plus size={16} /> إضافة هدف</button>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-sm font-bold text-slate-700 font-arabic mb-3">تفاصيل إضافية (اختيارية — لكنها ترفع جودة المستندات)</p>
              <div className="space-y-3">
                <Section id="scope" title="النطاق والمخرجات" subtitle="بيان النطاق · WBS · معايير القبول"
                  icon={<Target size={16} />} filled={!!(intake.deliverables?.some((x) => x.trim()) || intake.out_of_scope?.some((x) => x.trim()) || intake.acceptance_criteria?.trim())}
                  open={!!openSections.scope} onToggle={() => toggle("scope")}>
                  <label className="text-xs font-semibold text-slate-500 font-arabic block">المخرجات الرئيسية</label>
                  <StringRepeater values={intake.deliverables} onChange={(v) => setIntake("deliverables", v)} placeholder={(i) => `مخرج ${i + 1} - مثال: التصميم الإنشائي المعتمد`} addLabel="إضافة مخرج" />
                  <label className="text-xs font-semibold text-slate-500 font-arabic block pt-2">خارج النطاق (ما لا يشمله المشروع)</label>
                  <StringRepeater values={intake.out_of_scope} onChange={(v) => setIntake("out_of_scope", v)} placeholder={() => "مثال: أعمال التشغيل والصيانة بعد التسليم"} addLabel="إضافة بند" />
                  <Textarea label="معايير القبول" placeholder="متى نعتبر المخرج مقبولاً؟ مثال: اجتياز اختبار الحمولة وموافقة الاستشاري" value={intake.acceptance_criteria ?? ""} onChange={(e) => setIntake("acceptance_criteria", e.target.value)} rows={2} />
                </Section>
                <Section id="stake" title="أصحاب المصلحة" subtitle="سجل أصحاب المصلحة · خطة التواصل"
                  icon={<Users size={16} />} filled={!!(intake.sponsor?.trim() || stakeholders.some((s) => s.name.trim() || s.role.trim()))}
                  open={!!openSections.stake} onToggle={() => toggle("stake")}>
                  <Input label="راعي المشروع (Sponsor)" placeholder="الاسم أو الجهة الراعية" value={intake.sponsor ?? ""} onChange={(e) => setIntake("sponsor", e.target.value)} />
                  <label className="text-xs font-semibold text-slate-500 font-arabic block pt-1">أصحاب المصلحة الرئيسيون</label>
                  {stakeholders.map((s, i) => (
                    <div key={i} className="border border-slate-100 rounded-xl p-3 space-y-2 bg-slate-50/50">
                      <div className="flex gap-2">
                        <Input className="flex-1" placeholder="الاسم / الجهة" value={s.name} onChange={(e) => updateStakeholder(i, { name: e.target.value })} />
                        <Input className="flex-1" placeholder="الدور" value={s.role} onChange={(e) => updateStakeholder(i, { role: e.target.value })} />
                        <button type="button" onClick={() => removeStakeholder(i)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl"><X size={16} /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Select label="التأثير" value={s.influence} onChange={(e) => updateStakeholder(i, { influence: e.target.value as InfluenceLevel })} options={LEVELS} />
                        <Select label="الاهتمام" value={s.interest} onChange={(e) => updateStakeholder(i, { interest: e.target.value as InfluenceLevel })} options={LEVELS} />
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={addStakeholder} className="flex items-center gap-2 text-sm text-brand-blue font-arabic hover:underline"><Plus size={16} /> إضافة صاحب مصلحة</button>
                </Section>
                <Section id="team" title="الفريق والموارد" subtitle="خطة الموارد · مصفوفة المسؤوليات"
                  icon={<Layers size={16} />} filled={roles.some((r) => r.role.trim())}
                  open={!!openSections.team} onToggle={() => toggle("team")}>
                  <label className="text-xs font-semibold text-slate-500 font-arabic block">الأدوار المطلوبة وأعدادها</label>
                  {roles.map((r, i) => (
                    <div key={i} className="flex gap-2">
                      <Input className="flex-1" placeholder="الدور - مثال: مهندس موقع" value={r.role} onChange={(e) => updateRole(i, { role: e.target.value })} />
                      <Input type="number" min={1} className="w-24" placeholder="العدد" value={r.count} onChange={(e) => updateRole(i, { count: Number(e.target.value) || 1 })} />
                      <button type="button" onClick={() => removeRole(i)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl"><X size={16} /></button>
                    </div>
                  ))}
                  <button type="button" onClick={addRole} className="flex items-center gap-2 text-sm text-brand-blue font-arabic hover:underline"><Plus size={16} /> إضافة دور</button>
                </Section>
                <Section id="schedule" title="الجدول والمنهجية" subtitle="الجدول الزمني · مخطط المعالم"
                  icon={<Calendar size={16} />} filled={!!(intake.methodology || milestones.some((m) => m.name.trim()))}
                  open={!!openSections.schedule} onToggle={() => toggle("schedule")}>
                  <Select label="منهجية إدارة المشروع" value={intake.methodology ?? ""} onChange={(e) => setIntake("methodology", (e.target.value || undefined) as ProjectMethodology | undefined)}
                    options={[{ value: "", label: "— اترك للذكاء أن يقترح —" }, { value: "predictive", label: "تنبؤية (Waterfall) — تخطيط كامل ومراحل متسلسلة" }, { value: "agile", label: "رشيقة (Agile) — تطوير تدريجي مرن على دفعات" }, { value: "hybrid", label: "هجينة (Hybrid) — تخطيط صارم + مرونة" }]} />
                  <p className="text-[11px] text-slate-400 font-arabic leading-relaxed -mt-1">
                    تنبؤية: تخطّط كل شيء مقدّماً (للمشاريع الثابتة). رشيقة: تنفّذ على دفعات قصيرة مع مرونة للتغيير. هجينة: مزيج بينهما.
                  </p>
                  <label className="text-xs font-semibold text-slate-500 font-arabic block pt-1">المعالم والمواعيد الحرجة</label>
                  {milestones.map((m, i) => (
                    <div key={i} className="flex gap-2">
                      <Input className="flex-1" placeholder="اسم المعلم - مثال: اعتماد التصميم" value={m.name} onChange={(e) => updateMilestone(i, { name: e.target.value })} />
                      <Input type="date" className="w-44" value={m.date} onChange={(e) => updateMilestone(i, { date: e.target.value })} />
                      <button type="button" onClick={() => removeMilestone(i)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl"><X size={16} /></button>
                    </div>
                  ))}
                  <button type="button" onClick={addMilestone} className="flex items-center gap-2 text-sm text-brand-blue font-arabic hover:underline"><Plus size={16} /> إضافة معلم</button>
                </Section>
                <Section id="cost" title="التكلفة والتمويل" subtitle="الميزانية التفصيلية · تقديرات التكاليف"
                  icon={<Wallet size={16} />} filled={!!(intake.funding_source?.trim() || costs.some((c) => c.category.trim()))}
                  open={!!openSections.cost} onToggle={() => toggle("cost")}>
                  <label className="text-xs font-semibold text-slate-500 font-arabic block">بنود التكلفة الرئيسية</label>
                  {costs.map((c, i) => (
                    <div key={i} className="flex gap-2">
                      <Input className="flex-1" placeholder="البند - مثال: المواد الإنشائية" value={c.category} onChange={(e) => updateCost(i, { category: e.target.value })} />
                      <Input type="number" className="w-32" placeholder="المبلغ" value={c.amount ?? ""} onChange={(e) => updateCost(i, { amount: Number(e.target.value) || undefined })} />
                      <button type="button" onClick={() => removeCost(i)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl"><X size={16} /></button>
                    </div>
                  ))}
                  <button type="button" onClick={addCost} className="flex items-center gap-2 text-sm text-brand-blue font-arabic hover:underline"><Plus size={16} /> إضافة بند</button>
                  <Input label="مصدر التمويل" placeholder="مثال: تمويل ذاتي · جهة حكومية · مستثمر" value={intake.funding_source ?? ""} onChange={(e) => setIntake("funding_source", e.target.value)} />
                </Section>
                <Section id="risks" title="المخاطر المعروفة" subtitle="سجل المخاطر · خطة الاستجابة"
                  icon={<AlertTriangle size={16} />} filled={!!intake.known_risks?.some((x) => x.trim())}
                  open={!!openSections.risks} onToggle={() => toggle("risks")}>
                  <StringRepeater values={intake.known_risks} onChange={(v) => setIntake("known_risks", v)} placeholder={() => "مثال: تأخر توريد المواد بسبب الجمارك"} addLabel="إضافة خطر" />
                </Section>
                <Section id="quality" title="الجودة والامتثال" subtitle="خطة الجودة · مؤشرات النجاح"
                  icon={<ShieldCheck size={16} />} filled={!!(intake.quality_standards?.trim() || intake.kpis?.some((x) => x.trim()))}
                  open={!!openSections.quality} onToggle={() => toggle("quality")}>
                  <Textarea label="معايير الجودة والامتثال" placeholder="مثال: كود البناء السعودي، ISO 9001، متطلبات NDMO لتصنيف البيانات" value={intake.quality_standards ?? ""} onChange={(e) => setIntake("quality_standards", e.target.value)} rows={2} />
                  <label className="text-xs font-semibold text-slate-500 font-arabic block pt-1">مؤشرات النجاح (KPIs)</label>
                  <StringRepeater values={intake.kpis} onChange={(v) => setIntake("kpis", v)} placeholder={(i) => `مؤشر ${i + 1} - مثال: إنجاز 100% من المعالم في مواعيدها`} addLabel="إضافة مؤشر" />
                </Section>
              </div>
            </div>
            <Textarea label="القيود والمحددات" placeholder="مثال: ميزانية محدودة، جدول زمني صارم..." value={form.constraints ?? ""} onChange={(e) => set("constraints", e.target.value)} rows={2} hint="اختياري" />
            <Textarea label="الافتراضات" placeholder="مثال: أن التصاريح ستكون جاهزة قبل بدء التنفيذ..." value={form.assumptions ?? ""} onChange={(e) => set("assumptions", e.target.value)} rows={2} hint="اختياري" />
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setStep(0)}>رجوع</Button>
              <Button className="flex-1" onClick={() => setStep(2)} disabled={form.objectives.filter((o) => o.trim()).length === 0}>التالي</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-black text-slate-900 font-arabic mb-1">{steps[2]}</h2>
              <p className="text-slate-400 font-arabic text-sm">{isEdit ? "راجع تعديلاتك قبل الحفظ" : "راجع المعلومات قبل أن يبدأ وضوح في بناء الخطة"}</p>
            </div>
            <StrengthMeter score={strength} />
            <div className="bg-slate-50 rounded-xl p-5 space-y-3">
              {[
                { label: "اسم المشروع", value: form.name },
                { label: "العميل", value: form.client_name || "غير محدد" },
                { label: "المدة", value: `${form.start_date} - ${form.end_date}` },
                { label: "الميزانية", value: form.budget ? `${form.budget.toLocaleString()} ${form.currency}` : "غير محددة" },
                { label: "حجم الفريق", value: `${form.team_size} شخص` },
                { label: "إصدار PMBoK", value: form.pmbok_edition === "8" ? "الثامن (2025)" : "السابع" },
                { label: "أصحاب المصلحة", value: (intake.stakeholders?.filter((s) => s.name.trim() || s.role.trim()).length || 0) + " مُدخل" },
                { label: "المخرجات", value: (intake.deliverables?.filter((x) => x.trim()).length || 0) + " مخرج" },
                { label: "المعالم", value: (intake.milestones?.filter((m) => m.name.trim()).length || 0) + " معلم" },
                { label: "مخاطر معروفة", value: (intake.known_risks?.filter((x) => x.trim()).length || 0) + " خطر" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm font-arabic">
                  <span className="text-slate-400">{label}</span>
                  <span className="font-medium text-slate-800">{value}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-200">
                <div className="text-slate-400 text-sm font-arabic mb-2">الأهداف:</div>
                {form.objectives.filter((o) => o.trim()).map((obj, i) => (
                  <div key={i} className="text-sm text-slate-700 font-arabic flex gap-2"><span className="text-brand-blue">*</span>{obj}</div>
                ))}
              </div>
            </div>
            {!isEdit && strength < 40 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="font-arabic text-sm text-amber-800">بياناتك الحالية محدودة، فالذكاء سيفترض كثيراً من التفاصيل. تقدر ترجع وتضيف أصحاب المصلحة والمخرجات لمستندات أدق.</div>
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setStep(1)}>رجوع</Button>
              <Button className="flex-1" loading={loading} icon={isEdit ? <Save size={18} /> : <Sparkles size={18} />} onClick={handleSubmit}>
                {isEdit ? "حفظ التعديلات" : "ابنِ الخطة الآن"}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
