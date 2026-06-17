import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const revalidate = 300; // 5 min cache

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from("site_settings").select("key, value");
    const settings: Record<string, string> = {};
    (data ?? []).forEach((row: { key: string; value: string | null }) => { settings[row.key] = row.value ?? ""; });
    return NextResponse.json(settings, {
      headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=60" },
    });
  } catch {
    return NextResponse.json({});
  }
}
