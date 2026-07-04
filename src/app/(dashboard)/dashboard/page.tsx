import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { PlusCircle, FolderOpen, TrendingUp, Clock, CheckCircle } from "lucide-react";
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
  const projects = await getProjects(userId!);

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
