import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

async function getOrgForUser(userId: string, supabase: SupabaseClient) {
  const { data } = await supabase
    .from("org_members")
    .select("org_id, role")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();
  return data;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  await supabase.rpc("set_config", { key: "app.user_id", value: userId });

  const membership = await getOrgForUser(userId, supabase);
  if (!membership) return NextResponse.json({ departments: [] });

  const { data: departments } = await supabase
    .from("org_departments")
    .select("*")
    .eq("org_id", membership.org_id)
    .order("created_at");

  const enriched = await Promise.all(
    (departments ?? []).map(async (dept: Record<string, unknown>) => {
      const [{ count: mc }, { count: pc }] = await Promise.all([
        supabase.from("org_members").select("*", { count: "exact", head: true }).eq("dept_id", dept.id),
        supabase.from("projects").select("*", { count: "exact", head: true }).eq("dept_id", dept.id),
      ]);
      return { ...dept, member_count: mc ?? 0, project_count: pc ?? 0 };
    })
  );

  return NextResponse.json({ departments: enriched, role: membership.role });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  await supabase.rpc("set_config", { key: "app.user_id", value: userId });

  const membership = await getOrgForUser(userId, supabase);
  if (!membership || !["owner", "admin"].includes(membership.role)) {
    return NextResponse.json({ error: "ليس لديك صلاحية" }, { status: 403 });
  }

  const body = await req.json();
  const { name, description, color } = body;
  if (!name?.trim()) return NextResponse.json({ error: "اسم القسم مطلوب" }, { status: 400 });

  const { data, error } = await supabase
    .from("org_departments")
    .insert({ org_id: membership.org_id, name: name.trim(), description, color: color ?? "#1B4FD8" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "فشل إنشاء القسم" }, { status: 500 });
  return NextResponse.json({ department: data });
}

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  await supabase.rpc("set_config", { key: "app.user_id", value: userId });

  const membership = await getOrgForUser(userId, supabase);
  if (!membership || !["owner", "admin"].includes(membership.role)) {
    return NextResponse.json({ error: "ليس لديك صلاحية" }, { status: 403 });
  }

  const { deptId } = await req.json();
  await supabase.from("org_departments").delete().eq("id", deptId).eq("org_id", membership.org_id);
  return NextResponse.json({ ok: true });
}
