export const runtime = "nodejs";
export const maxDuration = 60;

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { generateWithClaude } from "@/lib/ai/client";
import { checkAIUsage } from "@/lib/ai/usage-guard";
import {
  buildAgendaPrompt,
  buildCharterPrompt,
  buildRiskRegisterPrompt,
  buildWBSPrompt,
  buildCommunicationPlanPrompt,
  buildGanttPrompt,
  buildStatusReportPrompt,
  buildQualityPlanPrompt,
} from "@/lib/ai/prompts";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Usage guard (حد الاستخدام الشهري حسب الخطة)
  const usage = await checkAIUsage(userId);
  if (!usage.allowed) {
    return NextResponse.json(
      { error: usage.error, usage: { used: usage.used, limit: usage.limit, plan: usage.plan } },
      { status: 402 }
    );
  }

  const { projectId, type } = await req.json();

  // Validate input
  if (!projectId || typeof projectId !== "string" || !type || typeof type !== "string") {
    return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 });
  }

  // Fetch project and user profile
  const [{ data: project }, { data: userProfile }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", projectId).eq("user_id", userId).single(),
    supabase.from("user_profiles").select("*").eq("clerk_id", userId).single(),
  ]);

  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

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

  const userSummary = {
    user_type: userProfile?.user_type ?? "individual",
    industry: userProfile?.industry ?? project.industry ?? "construction",
    company_name: userProfile?.company_name,
    team_size: userProfile?.team_size,
  };

  try {
    let prompt;
    switch (type) {
      case "agenda":         prompt = buildAgendaPrompt(projectForm, userSummary); break;
      case "charter":        prompt = buildCharterPrompt(projectForm, project.ai_agenda); break;
      case "risk_register":  prompt = buildRiskRegisterPrompt(projectForm, project.ai_agenda); break;
      case "wbs":            prompt = buildWBSPrompt(projectForm, project.ai_agenda); break;
      case "communication":  prompt = buildCommunicationPlanPrompt(projectForm, project.ai_agenda); break;
      case "gantt":          prompt = buildGanttPrompt(projectForm, project.ai_agenda); break;
      case "status_report":  prompt = buildStatusReportPrompt(projectForm, project.ai_agenda); break;
      case "quality_plan":   prompt = buildQualityPlanPrompt(projectForm); break;
      default: return NextResponse.json({ error: "Unknown generation type" }, { status: 400 });
    }

    // Haiku 4.5: fast + cheap. 8000 tokens gives full agendas (Arabic JSON is
    // token-heavy — 4000 was truncating long projects mid-JSON).
    const result = await generateWithClaude({
      ...prompt,
      maxTokens: 8000,
      model: "claude-haiku-4-5-20251001",
    });

    // Save agenda back to project
    if (type === "agenda") {
      await supabase
        .from("projects")
        .update({ ai_agenda: result, status: "planning" })
        .eq("id", projectId);

      const { data: updatedProject } = await supabase
        .from("projects").select("*").eq("id", projectId).single();

      return NextResponse.json({ project: updatedProject, data: result });
    }

    return NextResponse.json({ data: result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
