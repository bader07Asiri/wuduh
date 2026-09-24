import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { rateLimit, LIMITS } from "@/lib/rate-limit";
import { getAccessibleProject } from "@/lib/org-access";
import { DELIVERABLE_LABELS, type DeliverableType } from "@/types";

const CONTENT_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "غير مصرّح — سجّل الدخول أولاً" }, { status: 401 });

    const rl = rateLimit(`download:${userId}`, LIMITS.DELIVERABLE_DOWNLOAD);
    if (!rl.success) {
      return NextResponse.json({ error: "تجاوزت حد التحميل. حاول بعد دقيقة." }, { status: 429 });
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(params.id)) {
      return NextResponse.json({ error: "معرّف غير صالح" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: deliverable, error } = await supabase
      .from("deliverables")
      .select("*, projects(name, user_id)")
      .eq("id", params.id)
      .single();

    if (error || !deliverable) {
      return NextResponse.json({ error: "الملف غير موجود" }, { status: 404 });
    }

    // صلاحية التحميل: منشئ المخرَج، أو من يملك وصولاً للمشروع (نفس القسم/مالك المؤسسة/مُشارَك)
    const canAccess = deliverable.user_id === userId ||
      (deliverable.project_id && !!(await getAccessibleProject(userId, deliverable.project_id as string)));
    if (!canAccess) {
      return NextResponse.json({ error: "ليس لديك صلاحية لتحميل هذا الملف" }, { status: 403 });
    }

    if (deliverable.status !== "ready" || !deliverable.storage_path) {
      return NextResponse.json({ error: "الملف غير جاهز بعد" }, { status: 422 });
    }

    const { data: blob, error: dlError } = await supabase.storage
      .from("deliverables")
      .download(deliverable.storage_path);

    if (dlError || !blob) {
      return NextResponse.json(
        { error: `تعذّر جلب الملف من التخزين: ${dlError?.message ?? "غير موجود"}` },
        { status: 500 }
      );
    }

    const arrayBuffer = await blob.arrayBuffer();

    try {
      await supabase.from("ai_logs").insert({
        user_id: userId,
        project_id: deliverable.project_id,
        prompt_type: `download_${deliverable.type}`,
        tokens_used: 0,
        response_quality: "good",
      });
    } catch {
      /* logging is non-critical */
    }

    const ext = (deliverable.format as string) || "pdf";
    // اسم الملف = اسم المستند (المسجّل بالموقع) ثم اسم المشروع
    const clean = (s: string) => s.replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim();
    const docName =
      clean(DELIVERABLE_LABELS[deliverable.type as DeliverableType] || (deliverable.type as string).replace(/_/g, " "))
        .slice(0, 60);
    const projectName = clean((deliverable.projects as { name?: string } | null)?.name || "مشروع").slice(0, 70);
    const filename = `${docName} - ${projectName}.${ext}`;
    const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
        "Content-Length": String(arrayBuffer.byteLength),
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    const msg = error instanceof Error ? error.message : "خطأ داخلي";
    return NextResponse.json({ error: `تعذّر التحميل: ${msg}` }, { status: 500 });
  }
}
