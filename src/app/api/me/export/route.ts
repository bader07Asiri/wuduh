import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

// PDPL — data subject right: export a copy of the user's personal data.
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });

  const supabase = createAdminClient();
  const [profile, projects, deliverables, membership] = await Promise.all([
    supabase.from("user_profiles").select("*").eq("clerk_id", userId).maybeSingle(),
    supabase.from("projects").select("*").eq("user_id", userId),
    supabase.from("deliverables").select("*").eq("user_id", userId),
    supabase.from("org_members").select("*").eq("user_id", userId),
  ]);

  const payload = {
    exported_at: new Date().toISOString(),
    account: profile.data ?? null,
    projects: projects.data ?? [],
    deliverables: deliverables.data ?? [],
    organization_memberships: membership.data ?? [],
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": 'attachment; filename="wuduh-data-export.json"',
    },
  });
}
