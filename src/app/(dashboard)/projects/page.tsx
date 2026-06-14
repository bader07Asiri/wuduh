import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const statusConfig = {
  draft:     { label: "مسودة",  variant: "default"  as const },
  planning:  { label: "تخطيط", variant: "info"     as const },
  active:    { label: "نشط",   variant: "success"  as const },
  on_hold:   { label: "موقوف", variant: "warning"  as const },
  completed: { label: "مكتمل", variant: "success"  as const },
  cancelled: { label: "ملغى",  variant: "danger"   as const },
};

export default async function ProjectsPage() {
  const { userId } = await auth();

  const { data: projectsRaw } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId!)
    .order("created_at", { ascending: false });
  const projects = projectsRaw ?? [];

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-arabic">مشاريعي</h1>
          <p className="text-slate-400 font-arabic text-sm mt-1">{projects.length} مشروع</p>
        </div>
        <Link href="/projects/new">
          <Button icon={<PlusCircle size={18} />}>مشروع جديد</Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card className="text-center py-20">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-black text-slate-900 font-arabic mb-2">لا توجد مشاريع بعد</h3>
          <p className="text-slate-400 font-arabic text-sm mb-6 max-w-sm mx-auto">
            أنشئ مشروعك الأول وسيبني وضوح خطته الكاملة وفق معايير PMI
          </p>
          <Link href="/projects/new">
            <Button icon={<PlusCircle size={18} />}>أنشئ مشروعك الأول</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {(projects as any[]).map((p) => {
            const config = statusConfig[p.status as keyof typeof statusConfig] ?? statusConfig.draft;
            return (
              <Link key={p.id} href={`/projects/${p.id}`}>
                <Card hover className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-blue/10 to-brand-light/10 flex items-center justify-center text-brand-blue font-black text-xl font-arabic flex-shrink-0">
                    {p.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 font-arabic truncate">{p.name}</div>
                    <div className="text-xs text-slate-400 font-arabic mt-0.5 flex items-center gap-3">
                      <span>{p.client_name ?? "—"}</span>
                      <span>•</span>
                      <span>{formatDate(p.start_date)} — {formatDate(p.end_date)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {p.agenda_approved && (
                      <Badge variant="success" dot>أجندة معتمدة</Badge>
                    )}
                    <Badge variant={config.variant}>{config.label}</Badge>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
