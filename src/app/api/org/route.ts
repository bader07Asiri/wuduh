import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  await supabase.rpc("set_config", { key: "app.user_id", value: userId });

  const { data: membership } = await supabase
    .from("org_members")
    .select("org_id, role, dept_id, department:org_departments(id,name,color)")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  if (!membership) return NextResponse.json({ org: null });

  const { data: org } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", membership.org_id)
    .single();

  return NextResponse.json({ org, membership });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, name_en, industry, cr_number } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "اسم المؤسسة مطلوب" }, { status: 400 });
  }

  const supabase = await createClient();
  await supabase.rpc("set_config", { key: "app.user_id", value: userId });

  const { data: existing } = await supabase
    .from("org_members")
    .select("org_id")
    .eq("user_id", userId)
    .single();

  if (existing) {
    return NextResponse.json({ error: "انت بالفعل عضو في مؤسسة" }, { status: 400 });
  }

  const { data: org, error: orgErr } = await supabase
    .from("organizations")
    .insert({ owner_id: userId, name: name.trim(), name_en, industry, cr_number })
    .select()
    .single();

  if (orgErr || !org) {
    return NextResponse.json({ error: "فشل انشاء المؤسسة" }, { status: 500 });
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("email, full_name")
    .eq("clerk_id", userId)
    .single();

  await supabase.from("org_members").insert({
    org_id: org.id,
    user_id: userId,
    email: profile?.email ?? "",
    full_name: profile?.full_name ?? "",
    role: "owner",
    status: "active",
    joined_at: new Date().toISOString(),
  });

  return NextResponse.json({ org });
}
