import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { PlusCircle, FolderOpen, TrendingUp, Clock, CheckCircle, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { createAdminClient } from "@/lib/supabase/admin";

async function getProjects(userId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[dashboard] failed to fetch projects:", error.message);
    return [];
  }
  return data ?? [];
}

const PLAN_LIMITS: Record<string, number> = { free: 5, starter: 30, professional: 150, enterprise: -1 };
const PLAN_LABELS: Record<string, string> = { free: "المجانية", starter: "المبتدئ", professional: "الاحترافي", enterprise: "المؤسسي" };

async function getPlanUsage(userId: string) {
  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("subscription_plan")
    .eq("clerk_id", userId)
    .maybeSingle();

  const plan = profile?.subscription_plan ?? "free";
  const limit = PLAN_LIMITS[plan] ?? 5;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("deliverables")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth.toISOString());

  return { plan, limit, used: count ?? 0 };
}

const statusConfig = {
  draft:     { label: "مسودة",     variant: "default"  as const },
  planning:  { label: "تخطيط",    variant: "info"     as const },
  active:    { label: "نشط",      variant: "success"  as const },
  on_hold:   { label: "موقوف",    variant: "warning"  as const },
  completed: { label: "مكتمل",    variant: "success"  as const },
  cancelled: { label: "ملغى",     variant: "danger"   as const },
};

export default async function DashboardPage() {
  const { userId } = await auth();
  const [projects, planUsage] = await Promise.all([
    getProjects(userId!),
    getPlanUsage(userId!),
  ]);

  const { plan, limit, used } = planUsage;
  const isUnlimited = limit === -1;
  const remaining = isUnlimited ? Infinity : Math.max(0, limit - used);
  const usedPct = isUnlimited ? 0 : Math.min(100, Math.round((used / limit) * 100));
  const showUpgrade = plan !== "enterprise";

  const countByStatus = (statuses: string[]) =>
    projects.filter((p: any) => statuses.includes(p.status)).length;

  const stats = [
    { label: "إجمالي المشاريع", value: projects.length, icon: FolderOpen, color: "text-brand-blue bg-blue-50" },
    { label: "مشاريع نشطة", value: countByStatus(["active"]), icon: TrendingUp, color: "text-emerald-500 bg-emerald-50" },
    { label: "قيد الإنجاز", value: countByStatus(["draft", "planning", "on_hold"]), icon: Clock, color: "text-brand-cyan bg-brand-cyan/10" },
    { label: "مكتملة", value: countByStatus(["completed"]), icon: CheckCircle, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-arabic">لوحة التحكم</h1>
          <p className="text-slate-400 font-arabic text-sm mt-1">
            {formatDate(new Date().toISOString())}
          </p>
        </div>
        <Link href="/projects/new">
          <Button icon={<PlusCircle size={18} />}>مشروع جديد</Button>
        </Link>
      </div>

      {showUpgrade && (
        <div className="mb-8 rounded-2xl border border-brand-blue/15 bg-gradient-to-l from-navy-950 to-brand-royal p-5 text-white overflow-hidden relative">
          <div className="absolute -left-16 -top-16 w-48 h-48 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles size={16} className="text-brand-cyan" />
                <span className="font-bold font-arabic">باقتك الحالية: {PLAN_LABELS[plan] ?? plan}</span>
              </div>
              {isUnlimited ? (
                <p className="text-white/70 font-arabic text-sm">مخرجات غير محدودة — استمتع بكامل إمكانيات وضوح.</p>
              ) : (
                <>
                  <p className="text-white/70 font-arabic text-sm mb-2">
                    استخدمت <span className="font-bold text-white">{used}</span> من{" "}
                    <span className="font-bold text-white">{limit}</span> مخرجة هذا الشهر
                    {remaining <= 2 && remaining > 0 && (
                      <span className="text-brand-cyan"> — تبقّى لك {remaining} فقط!</span>
                    )}
                    {remaining === 0 && (
                      <span className="text-amber-300"> — وصلت للحد، رقّ باقتك للمتابعة</span>
                    )}
                  </p>
                  <div className="h-2 w-full max-w-md bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-l from-brand-cyan to-brand-blue rounded-full transition-all" style={{ width: `${usedPct}%` }} />
                  </div>
                </>
              )}
            </div>
            <Link href="/pricing" className="flex-shrink-0">
              <Button variant="cyan" icon={<ArrowLeft size={18} />}>
                {plan === "free" ? "رقّ باقتك" : "رقّ لباقة أعلى"}
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} padding="md">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon size={20} />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 font-arabic">{value}</div>
                <div className="text-xs text-slate-400 font-arabic">{label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Projects List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 font-arabic">المشاريع الأخيرة</h2>
          <Link href="/projects" className="text-sm text-brand-blue font-arabic hover:underline">
            عرض الكل
          </Link>
        </div>

        {projects.length === 0 ? (
          <Card className="text-center py-16">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-lg font-bold text-slate-900 font-arabic mb-2">لا توجد مشاريع بعد</h3>
            <p className="text-slate-400 font-arabic text-sm mb-6">
              ابدأ بإنشاء مشروعك الأول وسيبني وضوح خطته الكاملة
            </p>
            <Link href="/projects/new">
              <Button icon={<PlusCircle size={18} />}>أنشئ مشروعك الأول</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {(projects as any[]).slice(0, 5).map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card hover className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue font-black text-lg font-arabic">
                      {project.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 font-arabic">{project.name}</div>
                      <div className="text-xs text-slate-400 font-arabic mt-0.5">
                        {formatDate(project.start_date)} — {formatDate(project.end_date)}
                      </div>
                    </div>
                  </div>
                  <Badge variant={statusConfig[project.status as keyof typeof statusConfig]?.variant}>
                    {statusConfig[project.status as keyof typeof statusConfig]?.label}
                  </Badge>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
