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
import { docxToPdf } from "@/lib/pdf/docx-to-pdf";
import { generateCharterDOCX, generateProjectPlanDOCX, generateRiskRegisterDOCX, generateGenericDOCX } from "@/lib/generators/docx";
import { generateWBSXLSX, generateRiskRegisterXLSX, generateGanttXLSX, generateBudgetXLSX } from "@/lib/generators/xlsx";
import { generateKickoffPPTX, generateStakeholderPPTX, generateProgressReportPPTX } from "@/lib/generators/pptx";
import { getTheme, themeFromColor, isValidHex, type DocTheme } from "@/lib/themes";
import { docTitle } from "@/lib/generators/labels";
import { resolveBranding, type Plan, type OrgBranding } from "@/lib/branding";
import type { GenOptions, DocLang } from "@/lib/generators/types";
import { getAccessibleProject, getEffectivePlan, getMembership } from "@/lib/org-access";
import { checkAIUsage } from "@/lib/ai/usage-guard";

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

  // يبني مستند Word للنوع المطلوب (يُعاد استخدامه لـDOCX ولـPDF عبر LibreOffice)
  const buildDocx = async (): Promise<Uint8Array> => {
    if (type === "project_charter") return generateCharterDOCX(aiData, projectName, opts);
    if (type === "project_plan") return generateProjectPlanDOCX(agendaData, projectName, opts);
    if (type === "risk_register") return generateRiskRegisterDOCX(aiData, projectName, opts);
    return generateGenericDOCX(aiData, projectName, docTitle(type, lang), opts);
  };

  if (format === "pdf") {
    ext = "pdf";
    contentType = "application/pdf";
    // PDF عربي سليم = DOCX ثم تحويله عبر LibreOffice
    const docxBuf = await buildDocx();
    buffer = await docxToPdf(docxBuf);
  } else if (format === "docx") {
    ext = "docx";
    contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    buffer = await buildDocx();
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

  // حارس التوليد: يمنع المشرف الرقابي ويطبّق الحد الشهري حسب المستوى الفعّال
  const usage = await checkAIUsage(userId);
  if (!usage.allowed) {
    return NextResponse.json(
      { error: usage.error, usage: { used: usage.used, limit: usage.limit, plan: usage.plan } },
      { status: 402 }
    );
  }

  // المشروع بصلاحية المؤسسة (مالكه أو نفس القسم أو مُشارَك أو المالك/المشرف)
  const project = await getAccessibleProject(userId, projectId);
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

  // المستوى الفعّال + هوية المؤسسة (للثيم والعلامة المائية والهوية)
  const membership = await getMembership(userId);
  const effective = await getEffectivePlan(userId, membership);
  const plan = effective.plan as Plan;

  let org: OrgBranding | null = null;
  if (membership?.org_id) {
    const { data: orgRow } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", membership.org_id)
      .maybeSingle();
    if (orgRow) org = orgRow as OrgBranding;
  }

  const branding = resolveBranding(plan, org, { themeId, useOrgIdentity, includeSignature });

  // ===== Brand System: منصة ← هوية المؤسسة ← تخصيص صريح =====
  // الطبقة 1: افتراضيات المنصة (وضوح)
  const platform = getTheme(themeId);
  // الطبقة 2: هوية المؤسسة — عند تفعيلها ولها لون صالح، نشتقّ ثيماً كاملاً من لون المؤسسة
  const orgBase: DocTheme = branding.org && isValidHex(branding.org.primary_color)
    ? themeFromColor(branding.org.primary_color, platform)
    : platform;
  // الطبقة 3: تخصيص صريح — يتقدّم فقط إذا اختار المستخدم ألواناً غير الافتراضية
  const DEFAULT_PALETTE: Record<string, string> = { dark: "#0F2057", primary: "#2563EB", accent: "#0EA5E9", light: "#F8FAFC" };
  const eqHex = (a?: string, b?: string) => (a ?? "").replace("#", "").toLowerCase() === (b ?? "").replace("#", "").toLowerCase();
  const isDefaultCustom =
    !customColors ||
    (["dark", "primary", "accent", "light"] as const).every(k => !customColors[k] || eqHex(customColors[k], DEFAULT_PALETTE[k]));
  const hasExplicitCustom = !!customColors && !isDefaultCustom;
  const theme: DocTheme = hasExplicitCustom
    ? {
        id: "custom", name: "ألوان مخصصة", nameEn: "Custom",
        dark: hex(customColors!.dark, orgBase.dark)!,
        primary: hex(customColors!.primary, orgBase.primary)!,
        accent: hex(customColors!.accent, orgBase.accent)!,
        light: hex(customColors!.light, orgBase.light)!,
      }
    : orgBase;

  // جلب بايتات شعار المؤسسة (عند تفعيل الهوية ووجود رابط صورة صالح) لتضمينه في الغلاف
  if (branding.org?.logo_url) {
    const url = branding.org.logo_url.trim();
    if (/^https?:\/\//i.test(url)) {
      try {
        const resp = await fetch(url);
        const ct = (resp.headers.get("content-type") || "").toLowerCase();
        if (resp.ok && (ct.includes("png") || ct.includes("jpeg") || ct.includes("jpg"))) {
          const ab = await resp.arrayBuffer();
          if (ab.byteLength > 0 && ab.byteLength < 5 * 1024 * 1024) {
            branding.orgLogoData = new Uint8Array(ab);
          }
        }
      } catch {
        /* رابط غير صالح — نتجاهل ونُبقي شعار وضوح */
      }
    }
  }

  const genOptions: GenOptions = { theme, branding, lang, fontArabic: "Noto Sans Arabic" };

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
          const callAI = (extra = "") =>
            generateWithClaude({
              system: built.system,
              user: built.user + langDirective + extra,
              maxTokens: 8000,
              model: "claude-haiku-4-5-20251001",
              onUsage: (u) => logAiUsage(supabase, { userId, projectId, promptType: type, model: u.model }, u),
            }) as Promise<Record<string, unknown>>;
          try {
            aiData = await callAI();
          } catch {
            // إعادة محاولة واحدة باختصار أشد لتفادي بتر الاستجابة
            try {
              aiData = await callAI(
                "\n\nمهم جداً: اختصر أكثر — 4 أقسام كحد أقصى، كل قائمة ≤4 عناصر، كل جدول ≤5 صفوف، كل فقرة جملة واحدة. أخرج JSON مكتملاً وقصيراً."
              );
            } catch (aiErr2) {
              // لا نُخرج مستنداً فاضياً بصمت — نُظهر السبب الحقيقي للمستخدم
              throw new Error(
                `تعذّر توليد محتوى «${type}» عبر الذكاء: ${aiErr2 instanceof Error ? aiErr2.message : "خطأ غير معروف"}`
              );
            }
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
