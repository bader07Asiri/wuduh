import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ProjectIntakeForm } from "@/components/projects/ProjectIntakeForm";
import type { ProjectFormData } from "@/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const { data: p } = await supabase
    .from("projects").select("*").eq("id", params.id).eq("user_id", userId).single();

  if (!p) notFound();

  const d = (v: string | null | undefined) => (v ? String(v).slice(0, 10) : "");
  const initial: ProjectFormData = {
    name: p.name ?? "",
    description: p.description ?? "",
    client_name: p.client_name ?? "",
    start_date: d(p.start_date),
    end_date: d(p.end_date),
    budget: p.budget ?? undefined,
    currency: p.currency ?? "SAR",
    team_size: p.team_size ?? 1,
    objectives: Array.isArray(p.objectives) && p.objectives.length ? p.objectives : [""],
    constraints: p.constraints ?? "",
    assumptions: p.assumptions ?? "",
    pmbok_edition: String(p.pmbok_edition ?? "7") as "7" | "8",
    intake: p.intake_details ?? {},
  };

  return <ProjectIntakeForm mode="edit" projectId={params.id} initial={initial} />;
}
