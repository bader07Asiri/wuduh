import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProjectListItem } from "@/components/projects/ProjectListItem";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
          {(projects as any[]).map((p) => (
            <ProjectListItem
              key={p.id}
              project={{
                id: p.id, name: p.name, client_name: p.client_name,
                start_date: p.start_date, end_date: p.end_date,
                status: p.status, agenda_approved: p.agenda_approved,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
