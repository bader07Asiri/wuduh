import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getAccessibleProject } from "@/lib/org-access";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  if (!projectId) {
    return NextResponse.json({ error: "projectId required" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // صلاحية الوصول للمشروع (مالكه أو نفس القسم أو مُشارَك أو المالك/المشرف)
  const project = await getAccessibleProject(userId, projectId);
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const { data, error } = await supabase
    .from("deliverables")
    .select("id, type, format, status, file_size, generated_at, created_at")
    .eq("project_id", projectId)
    .eq("status", "ready")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const seen = new Set<string>();
  const deliverables = ((data ?? []) as { type: string; format: string }[]).filter((d) => {
    const key = `${d.type}:${d.format}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return NextResponse.json({ deliverables });
}
