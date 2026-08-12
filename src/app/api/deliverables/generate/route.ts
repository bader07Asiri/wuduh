// ============================
// وضوح | Wuduh — Deliverables Generate API
// يولّد الملفات الفعلية ويرفعها لـ Supabase Storage
// ============================

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { generateWithClaude } from "@/lib/ai/client";
import { logAiUsage } from "@/lib/ai/usage-log";
import {
  buildCharterPrompt,
  buildRiskRegisterPrompt,
  buildStatusReportPrompt,
  buildDocumentPrompt,
} from "@/lib/ai/prompts";
import type { DeliverableType, DeliverableFormat } from "@/types";

// File generators
import { generateCharterPDF, generateRiskRegisterPDF, generateProjectPlanPDF } from "@/lib/generators/pdf";
import { generateCharterDOCX, generateProjectPlanDOCX, generateRiskRegisterDOCX, generateGenericDOCX } from "@/lib/generators/docx";
import { generateWBSXLSX, generateRiskRegisterXLSX, generateGanttXLSX, generateBudgetXLSX } from "@/lib/generators/xlsx";
import { generateKickoffPPTX, generateStakeholderPPTX, generateProgressReportPPTX } from "@/lib/generators/pptx";
import { getTheme, type DocTheme } from "@/lib/themes";
import { docTitle } from "@/lib/generators/labels";
import { resolveBranding, type Plan, type OrgBranding } from "@/lib/branding";
import type { GenOptions, DocLang } from "@/lib/generators/types";

// أنواع المستندات النصية التي تُبنى عبر المولّد العام (Word)
const GENERIC_DOC_TYPES = new Set<DeliverableType>([
  "scope_statement", "resource_plan", "risk_response", "quality_plan",
  "communication_plan", "status_report", "closure_report", "lessons_learned",
  "meeting_minutes", "stakeholder_register", "earned_value",
  "milestone_chart", "quality_checklist", "closure_checklist",
]);

interface DeliverableRequest {
  type: DeliverableType;
  format: DeliverableFormat;
}

// Generate the actual file binary from AI data
async function generateFile(
  type: DeliverableType,
  format: DeliverableFormat,
  aiData: Record<string, unknown>,
  agendaData: Record<string, unknown>,
  projectName: string,
  opts?: GenOptions
): Promise<{ buffer: Uint8Array; contentType: string; ext: string }> {
  let buffer: Uint8Array;
  let contentType: string;
  let ext: string;

  const lang: DocLang = opts?.lang ?? "ar";

  if (format === "pdf") {
    ext = "pdf";
    contentType = "application/pdf";
    if (type === "project_charter") buffer = await generateCharterPDF(aiData, projectName, opts);
    else if (type === "risk_register") buffer = await generateRiskRegisterPDF(aiData, projectName, opts);
    else buffer = await generateProjectPlanPDF(agendaData, projectName, opts);
  } else if (format === "docx") {
    ext = "docx";
    contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    if (type === "project_charter") buffer = await generateCharterDOCX(aiData, projectName, opts);
    else if (type === "project_plan") buffer = await generateProjectPlanDOCX(agendaData, projectName, opts);
    else if (type === "risk_register") buffer = await generateRiskRegisterDOCX(aiData, projectName, opts);
    else buffer = await generateGenericDOCX(aiData, projectName, docTitle(type, lang), opts);
  } else if (format === "xlsx") {
    ext = "xlsx";
    contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    if (type === "wbs") buffer = await generateWBSXLSX(agendaData, projectName, opts);
    else if (type === "risk_register") buffer = await generateRiskRegisterXLSX(aiData, projectName, opts);
    else if (type === "gantt_chart" || type === "schedule") buffer = await generateGanttXLSX(agendaData, projectName, opts);
    else buffer = await generateBudgetXLSX(agendaData, projectName, opts);
  } else {
    // pptx
    ext = "pptx";
    contentType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    if (type === "stakeholder_presentation") {
      buffer = await generateStakeholderPPTX(agendaData, projectName, opts);
    } else if (type === "progress_presentation" || type === "status_report") {
      buffer = await generateProgressReportPPTX(aiData, projectName, opts);
    } else {
      buffer = await generateKickoffPPTX(agendaData, projectName, opts);
    }
  }

  return { buffer, contentType, ext };
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const {
    projectId,
    deliverables,
    themeId,
    customColors,
    useOrgIdentity,
    includeSignature,
    outputLang,
  }: {
    projectId: string;
    deliverables: DeliverableRequest[];
    themeId?: string;
    customColors?: { dark?: string; primary?: string; accent?: string; light?: string };
    useOrgIdentity?: boolean;
    includeSignature?: boolean;
    outputLang?: "ar" | "en";
  } = await req.json();

  const lang: DocLang = outputLang === "en" ? "en" : "ar";
  const hex = (v?: string, fb?: string) => (v && /^#?[0-9a-fA-F]{6}$/.test(v) ? (v.startsWith("#") ? v : `#${v}`) : fb);

  const langDirective =
    outputLang === "en"
      ? "\n\n=== LANGUAGE ===\nWrite ALL output content in professional English. Keep the JSON keys exactly as specified in English, and write every value in English."
      : "\n\n=== اللغة ===\nاكتب كل المحتوى باللغة العربية الفصحى الاحترافية. أبقِ مفاتيح JSON كما هي بالإنجليزية، واكتب كل القيم بالعربية.";

  const supabase = createAdminClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .eq("user_id", userId)
    .single();

  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
  if (!project.agenda_approved)
    return NextResponse.json({ error: "Agenda not approved yet" }, { status: 400 });

  const projectForm = {
    name: project.name,
    description: project.description,
    client_name: project.client_name,
    start_date: project.start_date,
    end_date: project.end_date,
    budget: project.budget,
    currency: project.currency,
    team_size: project.team_size,
    objectives: project.objectives,
    constraints: project.constraints,
    assumptions: project.assumptions,
  };

  const agendaData = (project.ai_agenda as Record<string, unknown>) || {};
  const projectName: string = project.name;

  // خطة المستخدم + هوية المؤسسة (للثيم والعلامة المائية والهوية)
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("subscription_plan")
    .eq("clerk_id", userId)
    .maybeSingle();
  const plan = (profile?.subscription_plan ?? "free") as Plan;

  let org: OrgBranding | null = null;
  const { data: membership } = await supabase
    .from("org_members")
    .select("org_id")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();
  if (membership?.org_id) {
    const { data: orgRow } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", membership.org_id)
      .maybeSingle();
    if (orgRow) org = orgRow as OrgBranding;
  }

  const branding = resolveBranding(plan, org, { themeId, useOrgIdentity, includeSignature });

  // ثيم مخصّص بألوان المستخدم إن وُجدت، وإلا الثيم الجاهز
  const base = getTheme(themeId);
  const customTheme: DocTheme | null = customColors
    ? {
        id: "custom",
        name: "ألوان مخصصة",
        nameEn: "Custom",
        dark: hex(customColors.dark, base.dark)!,
        primary: hex(customColors.primary, base.primary)!,
        accent: hex(customColors.accent, base.accent)!,
        light: hex(customColors.light, base.light)!,
      }
    : null;
  const genOptions: GenOptions = { theme: customTheme ?? base, branding, lang };

  // إذا اختار الإنجليزية: ترجم بيانات الأجندة مرة واحدة لتخرج كل المستندات إنجليزية
  let effectiveAgenda = agendaData;
  if (outputLang === "en" && Object.keys(agendaData).length > 0) {
    try {
      effectiveAgenda = (await generateWithClaude({
        system:
          "You are a precise JSON translator. Translate every Arabic string VALUE in the provided JSON to professional English. Keep all keys, numbers, and structure identical. Return ONLY the translated JSON object.",
        user: JSON.stringify(agendaData),
        maxTokens: 8000,
        model: "claude-haiku-4-5-20251001",
        onUsage: (u) => logAiUsage(supabase, { userId, projectId, promptType: "translate", model: u.model }, u),
      })) as Record<string, unknown>;
    } catch {
      effectiveAgenda = agendaData;
    }
  }

  // تمرير حجم الفريق والمدة الفعلية للمولّدات (تفادي 0 عضو / 0 أسبوع)
  const durWeeks = (() => {
    const s = new Date(project.start_date).getTime();
    const e = new Date(project.end_date).getTime();
    return Number.isFinite(s) && Number.isFinite(e) && e > s ? Math.ceil((e - s) / (7 * 86400000)) : 0;
  })();
  effectiveAgenda = {
    ...effectiveAgenda,
    duration_weeks: (effectiveAgenda.duration_weeks as number) || durWeeks || 12,
    team_size: project.team_size ?? 0,
    team_size_recommended: (effectiveAgenda.team_size_recommended as number) || project.team_size || 0,
  };

  // اختيار موجّه AI المناسب لكل (نوع، صيغة)
  function pickBuilder(type: DeliverableType, format: DeliverableFormat): (() => { system: string; user: string }) | null {
    if (format === "docx" || format === "pdf") {
      if (type === "project_charter") return () => buildCharterPrompt(projectForm, effectiveAgenda);
      if (type === "risk_register") return () => buildRiskRegisterPrompt(projectForm, effectiveAgenda);
      if (type === "project_plan") return null; // يُبنى من الأجندة
      if (GENERIC_DOC_TYPES.has(type)) return () => buildDocumentPrompt(type, projectForm, effectiveAgenda);
      return null;
    }
    if (format === "xlsx") {
      if (type === "risk_register") return () => buildRiskRegisterPrompt(projectForm, effectiveAgenda);
      return null; // wbs/gantt/schedule/budget/cost تُبنى من الأجندة
    }
    if (format === "pptx") {
      if (type === "progress_presentation" || type === "status_report") return () => buildStatusReportPrompt(projectForm, effectiveAgenda);
      return null; // kickoff/stakeholder تُبنى من الأجندة
    }
    return null;
  }

  const results = await Promise.allSettled(
    deliverables.map(async ({ type, format }) => {
      // Create deliverable record
      const { data: deliverable, error: insertErr } = await supabase
        .from("deliverables")
        .insert({
          project_id: projectId,
          user_id: userId,
          type,
          format,
          status: "generating",
          title: `${type.replace(/_/g, " ")} — ${projectName}`,
        })
        .select()
        .single();

      if (insertErr || !deliverable) {
        throw new Error("Failed to create deliverable record");
      }

      try {
        // Get AI data
        let aiData: Record<string, unknown> = {};
        const builder = pickBuilder(type, format);
        if (builder) {
          const built = builder();
          try {
            aiData = (await generateWithClaude({
              system: built.system,
              user: built.user + langDirective,
              maxTokens: 8000,
              model: "claude-haiku-4-5-20251001",
              onUsage: (u) => logAiUsage(supabase, { userId, projectId, promptType: type, model: u.model }, u),
            })) as Record<string, unknown>;
          } catch (aiErr) {
            // لا نُخرج مستنداً فاضياً بصمت — نُظهر السبب الحقيقي للمستخدم
            throw new Error(
              `تعذّر توليد محتوى «${type}» عبر الذكاء: ${aiErr instanceof Error ? aiErr.message : "خطأ غير معروف"}`
            );
          }
        } else {
          aiData = agendaData;
        }

        // حارس: مستندات تُبنى من الأجندة لكن الأجندة غير مولّدة → نُظهر سبباً واضحاً بدل ملف فاضٍ
        const agendaEmpty =
          !(effectiveAgenda.phases as unknown[] | undefined)?.length &&
          !effectiveAgenda.project_overview;
        if (!builder && agendaEmpty) {
          throw new Error(
            "الأجندة (الخطة) غير مكتملة لهذا المشروع — ارجع لخطوة الخطة، ولّدها واعتمدها، ثم أعد توليد المستندات."
          );
        }

        // Generate the actual file
        const { buffer, contentType, ext } = await generateFile(
          type,
          format,
          aiData,
          effectiveAgenda,
          projectName,
          genOptions
        );

        // Upload to Supabase Storage
        const storagePath = `${userId}/${projectId}/${deliverable.id}.${ext}`;

        const { error: uploadErr } = await supabase.storage
          .from("deliverables")
          .upload(storagePath, buffer, {
            contentType,
            upsert: true,
          });

        if (uploadErr) throw new Error(`Upload failed: ${uploadErr.message}`);

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("deliverables")
          .getPublicUrl(storagePath);

        const fileUrl = urlData.publicUrl;

        // Update record
        await supabase
          .from("deliverables")
          .update({
            status: "ready",
            file_url: fileUrl,
            storage_path: storagePath,
            file_size: buffer.byteLength,
            generated_at: new Date().toISOString(),
          })
          .eq("id", deliverable.id);

        return { id: deliverable.id, type, format, url: fileUrl, status: "ready" };
      } catch (err) {
        await supabase
          .from("deliverables")
          .update({ status: "error" })
          .eq("id", deliverable.id);

        // نُرجع الخطأ مع نوع المستند (بدل رفضه) عشان تظهر الرسالة الصحيحة في الواجهة
        return {
          id: deliverable.id,
          type,
          format,
          url: "",
          status: "error" as const,
          error: err instanceof Error ? err.message : "خطأ غير معروف",
        };
      }
    })
  );

  const files = results.map(r =>
    r.status === "fulfilled"
      ? r.value
      : { type: "unknown", format: "unknown", url: "", status: "error", error: (r.reason as Error)?.message }
  );

  const successCount = files.filter(f => f.status === "ready").length;

  return NextResponse.json({
    files,
    summary: { total: files.length, success: successCount, errors: files.length - successCount },
  });
}
