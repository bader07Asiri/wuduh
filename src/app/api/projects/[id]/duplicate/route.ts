import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/projects/[id]/duplicate — ينشئ نسخة جديدة من المشروع (المدخلات فقط، بدون الأجندة والمخرجات)
export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: src, error: getErr } = await supabase
    .from("projects").select("*").eq("id", params.id).eq("user_id", userId).single();

  if (getErr || !src) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const copy: Record<string, unknown> = {
    user_id: userId,
    name: `${src.name} (نسخة)`,
    description: src.description,
    client_name: src.client_name,
    start_date: src.start_date,
    end_date: src.end_date,
    budget: src.budget,
    currency: src.currency ?? "SAR",
    team_size: src.team_size,
    objectives: src.objectives,
    constraints: src.constraints,
    assumptions: src.assumptions,
    pmbok_edition: src.pmbok_edition ?? "7",
    // نسخة جديدة تبدأ من الصفر: بلا أجندة ولا اعتماد
    status: "planning",
    agenda_approved: false,
    ai_agenda: null,
  };
  if (src.intake_details) copy.intake_details = src.intake_details;

  let { data, error } = await supabase.from("projects").insert(copy).select("id").single();

  // مرونة لو عمود intake_details غير موجود
  if (error && /intake_details/i.test(error.message ?? "")) {
    delete copy.intake_details;
    ({ data, error } = await supabase.from("projects").insert(copy).select("id").single());
  }

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Failed to duplicate" }, { status: 500 });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
