import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "غير مصرّح — سجّل الدخول أولاً" }, { status: 401 });

  const supabase = createAdminClient();

  const { data: membership } = await supabase
    .from("org_members")
    .select("org_id, role, dept_id, department:org_departments(id,name,color)")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

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
  if (!userId) return NextResponse.json({ error: "غير مصرّح — سجّل الدخول أولاً" }, { status: 401 });

  let body: {
    name?: string; name_en?: string; industry?: string; cr_number?: string;
    logo_url?: string; primary_color?: string; letterhead_text?: string;
    signatory_name?: string; signatory_title?: string; department?: string;
    website?: string; phone?: string; email?: string; address?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "البيانات المرسلة غير صحيحة" }, { status: 400 });
  }

  const {
    name, name_en, industry, cr_number,
    logo_url, primary_color, letterhead_text,
    signatory_name, signatory_title, department,
    website, phone, email: contactEmail, address,
  } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "اسم المؤسسة مطلوب" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("org_members")
    .select("org_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "لديك مؤسسة بالفعل — لا يمكن إنشاء أكثر من مؤسسة بنفس الحساب." },
      { status: 409 }
    );
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? null;
  const fullName = clerkUser?.fullName ?? null;

  const { error: profileErr } = await supabase.from("user_profiles").upsert(
    {
      clerk_id: userId,
      email,
      full_name: fullName,
      subscription_plan: "free",
      subscription_status: "active",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "clerk_id", ignoreDuplicates: true }
  );

  if (profileErr) {
    return NextResponse.json({ error: `تعذّر تجهيز حسابك: ${profileErr.message}` }, { status: 500 });
  }

  const { data: org, error: orgErr } = await supabase
    .from("organizations")
    .insert({
      owner_id: userId,
      name: name.trim(),
      name_en: name_en?.trim() || null,
      industry: industry || null,
      cr_number: cr_number?.trim() || null,
      logo_url: logo_url?.trim() || null,
      primary_color: primary_color?.trim() || null,
      letterhead_text: letterhead_text?.trim() || null,
      signatory_name: signatory_name?.trim() || null,
      signatory_title: signatory_title?.trim() || null,
      department: department?.trim() || null,
      website: website?.trim() || null,
      phone: phone?.trim() || null,
      email: contactEmail?.trim() || null,
      address: address?.trim() || null,
    })
    .select()
    .single();

  if (orgErr || !org) {
    return NextResponse.json(
      { error: `تعذّر إنشاء المؤسسة: ${orgErr?.message ?? "خطأ غير معروف"}` },
      { status: 500 }
    );
  }

  const { error: memberErr } = await supabase.from("org_members").insert({
    org_id: org.id,
    user_id: userId,
    email: email ?? "",
    full_name: fullName ?? "",
    role: "owner",
    status: "active",
    joined_at: new Date().toISOString(),
  });

  if (memberErr) {
    await supabase.from("organizations").delete().eq("id", org.id);
    return NextResponse.json({ error: `تعذّر ربط حسابك بالمؤسسة: ${memberErr.message}` }, { status: 500 });
  }

  return NextResponse.json({ org });
}
