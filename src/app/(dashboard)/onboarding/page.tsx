"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { INDUSTRY_LABELS, USER_TYPE_LABELS, type UserType, type Industry, type OnboardingData } from "@/types";
import { Building2, User, Building } from "lucide-react";
import { cn } from "@/lib/utils";

const userTypeOptions = [
  { value: "individual",    label: USER_TYPE_LABELS.individual,    icon: User,      desc: "مستشار، فريلانسر، مقاول مستقل" },
  { value: "small_company", label: USER_TYPE_LABELS.small_company, icon: Building2, desc: "شركة حتى 50 موظف" },
  { value: "enterprise",    label: USER_TYPE_LABELS.enterprise,    icon: Building,  desc: "مؤسسة أو شركة كبيرة" },
] as const;

const industryOptions = Object.entries(INDUSTRY_LABELS).map(([value, label]) => ({ value, label }));

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<Partial<OnboardingData>>({
    user_type: undefined,
    industry: undefined,
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, clerk_id: user?.id }),
      });
      if (!res.ok) throw new Error();
      toast.success("تم إعداد حسابك بنجاح!");
      router.push("/dashboard");
    } catch {
      toast.error("حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-brand-cyan flex items-center justify-center text-white font-black text-lg font-arabic">
              و
            </div>
            <span className="text-2xl font-black text-slate-900 font-arabic">وضوح</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 font-arabic mb-2">مرحباً، {user?.firstName}! 👋</h1>
          <p className="text-slate-500 font-arabic">سؤالان بسيطان لنخصص تجربتك</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-slate-400 font-arabic mb-2">
            <span>الخطوة {step} من {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-blue rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-card p-8">
          {/* Step 1: User Type */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-black text-slate-900 font-arabic mb-2">ما أفضل وصف لك؟</h2>
              <p className="text-slate-400 font-arabic text-sm mb-6">هذا يساعدنا نبني تجربة مناسبة لاحتياجاتك</p>
              <div className="grid gap-3">
                {userTypeOptions.map(({ value, label, icon: Icon, desc }) => (
                  <button
                    key={value}
                    onClick={() => { setData(d => ({ ...d, user_type: value as UserType })); setStep(2); }}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border-2 text-right transition-all",
                      data.user_type === value
                        ? "border-brand-blue bg-blue-50"
                        : "border-slate-100 hover:border-brand-blue/40 hover:bg-slate-50"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                      data.user_type === value ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-500"
                    )}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 font-arabic">{label}</div>
                      <div className="text-xs text-slate-400 font-arabic mt-0.5">{desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Industry */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-black text-slate-900 font-arabic mb-2">ما قطاعك الرئيسي؟</h2>
              <p className="text-slate-400 font-arabic text-sm mb-6">سنخصص أسئلة المشروع وفق هذا القطاع</p>
              <div className="grid grid-cols-2 gap-2 mb-6 max-h-80 overflow-y-auto pr-1">
                {industryOptions.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setData(d => ({ ...d, industry: value as Industry }))}
                    className={cn(
                      "p-3 rounded-xl border-2 text-sm font-arabic font-medium transition-all text-right",
                      data.industry === value
                        ? "border-brand-blue bg-blue-50 text-brand-blue"
                        : "border-slate-100 hover:border-slate-200 text-slate-700"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep(1)}>رجوع</Button>
                <Button
                  className="flex-1"
                  disabled={!data.industry}
                  onClick={() => setStep(3)}
                >
                  التالي
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-black text-slate-900 font-arabic mb-2">تفاصيل إضافية</h2>
              <p className="text-slate-400 font-arabic text-sm mb-6">اختياري — تساعد على تجربة أفضل</p>
              <div className="space-y-4 mb-6">
                {data.user_type !== "individual" && (
                  <Input
                    label="اسم الشركة / المؤسسة"
                    placeholder="مثال: شركة الإنشاءات السعودية"
                    value={data.company_name ?? ""}
                    onChange={e => setData(d => ({ ...d, company_name: e.target.value }))}
                  />
                )}
                <Select
                  label="عدد أعضاء الفريق المعتاد"
                  value={String(data.team_size ?? "")}
                  onChange={e => setData(d => ({ ...d, team_size: Number(e.target.value) }))}
                  options={[
                    { value: "", label: "اختر..." },
                    { value: "1", label: "1 شخص (أنا وحدي)" },
                    { value: "5", label: "2-5 أشخاص" },
                    { value: "15", label: "6-15 شخص" },
                    { value: "30", label: "16-30 شخص" },
                    { value: "50", label: "31-50 شخص" },
                    { value: "100", label: "أكثر من 50 شخص" },
                  ]}
                />
                <Select
                  label="كم مشروعاً تدير في السنة؟"
                  value={String(data.projects_per_year ?? "")}
                  onChange={e => setData(d => ({ ...d, projects_per_year: Number(e.target.value) }))}
                  options={[
                    { value: "", label: "اختر..." },
                    { value: "1", label: "1-3 مشاريع" },
                    { value: "5", label: "4-10 مشاريع" },
                    { value: "15", label: "11-25 مشروع" },
                    { value: "30", label: "أكثر من 25 مشروع" },
                  ]}
                />
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep(2)}>رجوع</Button>
                <Button className="flex-1" loading={loading} onClick={handleSubmit}>
                  ابدأ استخدام وضوح 🚀
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
