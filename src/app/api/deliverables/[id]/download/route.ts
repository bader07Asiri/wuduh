// ============================
// وضوح | Wuduh — Deliverable Download API
// يتحقق من الصلاحيات ويعيد توجيه التحميل
// ============================

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { rateLimit, LIMITS } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Rate limiting
    const rl = rateLimit(`download:${userId}`, LIMITS.DELIVERABLE_DOWNLOAD);
    if (!rl.success) {
      return NextResponse.json({ error: "تجاوزت حد التحميل. حاول بعد دقيقة." }, { status: 429 });
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(params.id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Fetch the deliverable record
    const { data: deliverable, error } = await supabase
      .from("deliverables")
      .select("*, projects(name, user_id)")
      .eq("id", params.id)
      .single();

    if (error || !deliverable) {
      return NextResponse.json({ error: "Deliverable not found" }, { status: 404 });
    }

    // Check ownership
    const projectUserId = (deliverable.projects as { user_id: string })?.user_id;
    if (projectUserId !== userId && deliverable.user_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (deliverable.status !== "ready" || !deliverable.storage_path) {
      return NextResponse.json(
        { error: "File not ready yet" },
        { status: 422 }
      );
    }

    // Create a signed URL (valid for 60 seconds — enough to initiate download)
    const { data: signedData, error: signError } = await supabase.storage
      .from("deliverables")
      .createSignedUrl(deliverable.storage_path, 60);

    if (signError || !signedData?.signedUrl) {
      return NextResponse.json({ error: "Could not generate download link" }, { status: 500 });
    }

    // Determine filename
    const ext = deliverable.format || "pdf";
    const typeName = (deliverable.type as string).replace(/_/g, "-");
    const projectName = ((deliverable.projects as { name: string })?.name || "project")
      .replace(/\s+/g, "-")
      .toLowerCase();
    const filename = `wuduh-${projectName}-${typeName}.${ext}`;

    // Log the download
    await supabase.from("ai_logs").insert({
      user_id: userId,
      project_id: deliverable.project_id,
      prompt_type: `download_${deliverable.type}`,
      tokens_used: 0,
      response_quality: "good",
    }).single();

    // Redirect to the signed URL — browser will download
    return NextResponse.redirect(signedData.signedUrl, {
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
