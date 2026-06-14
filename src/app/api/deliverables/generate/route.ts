// ============================
// وضوح | Wuduh — Deliverables Generate API
// يولّد الملفات الفعلية ويرفعها لـ Supabase Storage
// ============================

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { generateWithClaude } from "@/lib/ai/client";
import {
  buildCharterPrompt,
  buildRiskRegisterPrompt,
  buildWBSPrompt,
  buildCommunicationPlanPrompt,
  buildGanttPrompt,
  buildStatusReportPrompt,
  buildQualityPlanPrompt,
} from "@/lib/ai/prompts";
import type { DeliverableType, DeliverableFormat } from "@/types";

// File generators
import { generateCharterPDF, generateRiskRegisterPDF, generateProjectPlanPDF } from "@/lib/generators/pdf";
import { generateCharterDOCX, generateProjectPlanDOCX, generateRiskRegisterDOCX } from "@/lib/generators/docx";
import { generateWBSXLSX, generateRiskRegisterXLSX, generateGanttXLSX, generateBudgetXLSX } from "@/lib/generators/xlsx";
import { generateKickoffPPTX, generateStakeholderPPTX, generateProgressReportPPTX } from "@/lib/generators/pptx";

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
  projectName: string
): Promise<{ buffer: Uint8Array; contentType: string; ext: string }> {
  let buffer: Uint8Array;
  let contentType: string;
  let ext: string;

  if (format === "pdf") {
    ext = "pdf";
    contentType = "application/pdf";
    if (type === "project_charter") buffer = await generateCharterPDF(aiData, projectName);
    else if (type === "risk_register") buffer = await generateRiskRegisterPDF(aiData, projectName);
    else buffer = await generateProjectPlanPDF(agendaData, projectName);
  } else if (format === "docx") {
    ext = "docx";
    contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    if (type === "project_charter") buffer = await generateCharterDOCX(aiData, projectName);
    else if (type === "risk_register") buffer = await generateRiskRegisterDOCX(aiData, projectName);
    else buffer = await generateProjectPlanDOCX(agendaData, projectName);
  } else if (format === "xlsx") {
    ext = "xlsx";
    contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    if (type === "wbs") buffer = await generateWBSXLSX(agendaData, projectName);
    else if (type === "risk_register") buffer = await generateRiskRegisterXLSX(aiData, projectName);
    else if (type === "gantt_chart") buffer = await generateGanttXLSX(agendaData, projectName);
    else buffer = await generateBudgetXLSX(agendaData, projectName);
  } else {
    // pptx
    ext = "pptx";
    contentType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    if (type === "stakeholder_register") {
      buffer = await generateStakeholderPPTX(agendaData, projectName);
    } else if (type === "status_report") {
      buffer = await generateProgressReportPPTX(aiData, projectName);
    } else {
      buffer = await generateKickoffPPTX(agendaData, projectName);
    }
  }

  return { buffer, contentType, ext };
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId, deliverables }: { projectId: string; deliverables: DeliverableRequest[] } =
    await req.json();

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

  const { data: userProfile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

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

  // AI prompt builders
  const promptBuilders: Partial<Record<DeliverableType, () => { system: string; user: string }>> = {
    project_charter:      () => buildCharterPrompt(projectForm, agendaData),
    risk_register:        () => buildRiskRegisterPrompt(projectForm, agendaData),
    wbs:                  () => buildWBSPrompt(projectForm, agendaData),
    communication_plan:   () => buildCommunicationPlanPrompt(projectForm, agendaData),
    gantt_chart:          () => buildGanttPrompt(projectForm, agendaData),
    status_report:        () => buildStatusReportPrompt(projectForm, agendaData),
    quality_plan:         () => buildQualityPlanPrompt(projectForm),
  };

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
        const builder = promptBuilders[type];
        if (builder) {
          try {
            aiData = (await generateWithClaude({ ...builder(), maxTokens: 6000 })) as Record<string, unknown>;
          } catch {
            // Fall back to agenda data if AI call fails
            aiData = agendaData;
          }
        } else {
          aiData = agendaData;
        }

        // Generate the actual file
        const { buffer, contentType, ext } = await generateFile(
          type,
          format,
          aiData,
          agendaData,
          projectName
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

        throw err;
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
