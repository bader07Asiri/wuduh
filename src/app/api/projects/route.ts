import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import type { ProjectFormData } from "@/types";
import { rateLimit, LIMITS } from "@/lib/rate-limit";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/projects
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/projects
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Rate limiting
  const rl = rateLimit(`project:${userId}`, LIMITS.PROJECT_CREATE);
  if (!rl.success) {
    return NextResponse.json(
      { error: "تجاوزت الحد المسموح به لإنشاء المشاريع. حاول لاحقاً." },
      { status: 429 }
    );
  }

  // Auto-create user profile if it doesn't exist (prevents FK constraint failure)
  const clerkUser = await currentUser();
  await supabase.from("user_profiles").upsert(
    {
      clerk_id: userId,
      email: clerkUser?.emailAddresses?.[0]?.emailAddress ?? null,
      full_name: clerkUser?.fullName ?? null,
      subscription_plan: "free",
      subscription_status: "trialing",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "clerk_id", ignoreDuplicates: true }
  );

  const body: ProjectFormData = await req.json();

  // Sanitize
  if (body.name) body.name = body.name.trim().slice(0, 200);
  if (body.description) body.description = body.description.trim().slice(0, 2000);
  if (body.client_name) body.client_name = body.client_name.trim().slice(0, 200);

  // Validate
  if (!body.name || !body.start_date || !body.end_date) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (new Date(body.end_date) <= new Date(body.start_date)) {
    return NextResponse.json({ error: "End date must be after start date" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: userId,
      name: body.name,
      description: body.description,
      client_name: body.client_name,
      start_date: body.start_date,
      end_date: body.end_date,
      budget: body.budget,
      currency: body.currency ?? "SAR",
      team_size: body.team_size,
      objectives: body.objectives,
      constraints: body.constraints,
      assumptions: body.assumptions,
      status: "planning",
      agenda_approved: false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id, project: data }, { status: 201 });
}
