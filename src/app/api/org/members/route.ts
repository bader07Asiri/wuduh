import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

async function getMembership(userId: string, supabase: SupabaseClient) {
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

  const membership = await getMembership(userId, supabase);
  if (!membership) return NextResponse.json({ members: [] });

  const { data: members } = await supabase
    .from("org_members")
    .select("*, department:org_departments(id,name,color)")
    .eq("org_id", membership.org_id)
    .order("role")
    .order("full_name");

  return NextResponse.json({ members: members ?? [], myRole: membership.role });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  await supabase.rpc("set_config", { key: "app.user_id", value: userId });

  const membership = await getMembership(userId, supabase);
  if (!membership || !["owner", "admin"].includes(membership.role)) {
    return NextResponse.json({ error: "ليس لديك صلاحية" }, { status: 403 });
  }

  const body = await req.json();
  const { email, full_name, dept_id, role = "member" } = body;

  if (!email?.trim()) return NextResponse.json({ error: "البريد الإلكتروني مطلوب" }, { status: 400 });

  const { data: existing } = await supabase
    .from("org_members")
    .select("id")
    .eq("org_id", membership.org_id)
    .eq("email", email.trim().toLowerCase())
    .single();

  if (existing) return NextResponse.json({ error: "هذا العضو موجود بالفعل" }, { status: 400 });

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("clerk_id, full_name")
    .eq("email", email.trim().toLowerCase())
    .single();

  const { data: member, error } = await supabase
    .from("org_members")
    .insert({
      org_id: membership.org_id,
      dept_id: dept_id || null,
      user_id: profile?.clerk_id ?? `pending_${Date.now()}`,
      email: email.trim().toLowerCase(),
      full_name: full_name || profile?.full_name || "",
      role: ["owner", "admin"].includes(membership.role) && role === "admin" ? "admin" : "member",
      status: profile ? "active" : "invited",
      joined_at: profile ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "فشل إضافة العضو" }, { status: 500 });
  return NextResponse.json({ member, alreadyRegistered: !!profile });
}

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  await supabase.rpc("set_config", { key: "app.user_id", value: userId });

  const membership = await getMembership(userId, supabase);
  if (!membership || !["owner", "admin"].includes(membership.role)) {
    return NextResponse.json({ error: "ليس لديك صلاحية" }, { status: 403 });
  }

  const body = await req.json();
  const { memberId, role, dept_id, status } = body;

  const update: Record<string, string | null> = {};
  if (role)    update.role    = role;
  if (dept_id !== undefined) update.dept_id = dept_id;
  if (status)  update.status  = status;

  const { data } = await supabase
    .from("org_members")
    .update(update)
    .eq("id", memberId)
    .eq("org_id", membership.org_id)
    .select()
    .single();

  return NextResponse.json({ member: data });
}

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  await supabase.rpc("set_config", { key: "app.user_id", value: userId });

  const membership = await getMembership(userId, supabase);
  if (!membership || !["owner", "admin"].includes(membership.role)) {
    return NextResponse.json({ error: "ليس لديك صلاحية" }, { status: 403 });
  }

  const { memberId } = await req.json();
  await supabase.from("org_members").delete().eq("id", memberId).eq("org_id", membership.org_id);
  return NextResponse.json({ ok: true });
}
