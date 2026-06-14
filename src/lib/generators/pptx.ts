// ============================
// وضوح | Wuduh — PPTX Generator
// يولّد عروض PowerPoint من بيانات AI
// ============================

import PptxGenJS from "pptxgenjs";

// Brand colors
const NAVY    = "0F2057";
const PRIMARY = "2563EB";
const ACCENT  = "0EA5E9";
const GOLD    = "F59E0B";
const SUCCESS = "10B981";
const DANGER  = "EF4444";
const BG_LIGHT = "F8FAFC";
const BORDER  = "E2E8F0";
const TEXT    = "0F172A";
const TEXT_MID = "334155";
const TEXT_LIGHT = "64748B";
const WHITE   = "FFFFFF";

// ============================
// Helpers
// ============================
function createPptx(): PptxGenJS {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.title = "Wuduh AI | وضوح";
  pptx.subject = "PMI/PMBOK Project Document";
  pptx.author = "Wuduh AI Platform";
  return pptx;
}

function addCoverSlide(pptx: PptxGenJS, title: string, subtitle: string, projectName: string) {
  const slide = pptx.addSlide();

  // Background
  slide.background = { color: NAVY };

  // Accent stripe left
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.08, h: "100%", fill: { color: ACCENT } });

  // Brand mark
  slide.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 0.4, w: 1.2, h: 1.2, fill: { color: PRIMARY }, line: { color: ACCENT, width: 2 } });
  slide.addText("و", { x: 0.5, y: 0.4, w: 1.2, h: 1.2, fontSize: 36, bold: true, color: WHITE, align: "center", valign: "middle" });

  // Brand name
  slide.addText("Wuduh | وضوح", { x: 2, y: 0.4, w: 5, h: 0.6, fontSize: 22, bold: true, color: ACCENT });
  slide.addText("PMI/PMBOK Guide 7th Edition AI Platform", { x: 2, y: 0.95, w: 6, h: 0.4, fontSize: 11, italic: true, color: TEXT_LIGHT });

  // Main title
  slide.addText(title, {
    x: 0.5, y: 2.2, w: 12.5, h: 1.2,
    fontSize: 40, bold: true, color: WHITE, align: "center",
  });

  // Project name
  slide.addText(projectName, {
    x: 0.5, y: 3.5, w: 12.5, h: 0.7,
    fontSize: 22, color: ACCENT, align: "center",
  });

  // Subtitle
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.5, y: 4.3, w: 12.5, h: 0.5,
      fontSize: 14, italic: true, color: TEXT_LIGHT, align: "center",
    });
  }

  // Date
  slide.addText(new Date().toLocaleDateString("en-GB"), {
    x: 0.5, y: 6.5, w: 12.5, h: 0.4,
    fontSize: 11, color: TEXT_LIGHT, align: "center",
  });

  // Divider line
  slide.addShape(pptx.ShapeType.line, { x: 3, y: 6.0, w: 7.5, h: 0, line: { color: PRIMARY, width: 1.5 } });
}

function addSectionHeader(pptx: PptxGenJS, title: string, icon?: string): PptxGenJS["addSlide"] {
  const slide = pptx.addSlide();
  slide.background = { color: PRIMARY };

  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.08, h: "100%", fill: { color: ACCENT } });

  if (icon) {
    slide.addText(icon, { x: 5, y: 1.5, w: 3, h: 2, fontSize: 72, align: "center", color: WHITE, transparency: 20 });
  }

  slide.addText(title, {
    x: 0.5, y: 2.8, w: 12.5, h: 1.5,
    fontSize: 44, bold: true, color: WHITE, align: "center",
  });

  return slide as unknown as PptxGenJS["addSlide"];
}

function addSlideHeader(slide: PptxGenJS["addSlide"] & {addText: Function; addShape: Function; background: object}, pptx: PptxGenJS, title: string) {
  (slide as any).background = { color: WHITE };

  // Top bar
  (slide as any).addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.7, fill: { color: NAVY } });
  (slide as any).addShape(pptx.ShapeType.rect, { x: 0, y: 0.7, w: "100%", h: 0.05, fill: { color: ACCENT } });

  // Title
  (slide as any).addText("Wuduh | وضوح", { x: 0.2, y: 0.05, w: 3, h: 0.5, fontSize: 12, color: ACCENT, bold: true });
  (slide as any).addText(title, { x: 3.5, y: 0.08, w: 8.5, h: 0.55, fontSize: 18, bold: true, color: WHITE, align: "right" });
}

// ============================
// 1. Project Kickoff Presentation
// ============================
export async function generateKickoffPPTX(agendaData: Record<string, unknown>, projectName: string): Promise<Uint8Array> {
  const pptx = createPptx();

  // Slide 1: Cover
  addCoverSlide(pptx, "Project Kickoff Meeting", "بدء المشروع", projectName);

  // Slide 2: Agenda
  const agendaSlide = pptx.addSlide();
  addSlideHeader(agendaSlide as any, pptx, "Meeting Agenda");

  agendaSlide.addText("Today's Agenda", { x: 0.5, y: 0.9, w: 12.5, h: 0.6, fontSize: 24, bold: true, color: NAVY });

  const agendaItems = [
    "1. Project Overview & Objectives",
    "2. Scope & Deliverables",
    "3. Project Timeline",
    "4. Team & Responsibilities",
    "5. Budget Overview",
    "6. Risks & Mitigation",
    "7. Communication Plan",
    "8. Next Steps & Q&A",
  ];

  agendaItems.forEach((item, i) => {
    agendaSlide.addShape(pptx.ShapeType.roundRect, {
      x: 0.5 + (i % 2) * 6.5, y: 1.6 + Math.floor(i / 2) * 1.2, w: 6, h: 1.0,
      fill: { color: i % 2 === 0 ? "EFF6FF" : "F0FDF4" },
      line: { color: i % 2 === 0 ? PRIMARY : SUCCESS, width: 2 },
    });
    agendaSlide.addText(item, {
      x: 0.7 + (i % 2) * 6.5, y: 1.65 + Math.floor(i / 2) * 1.2, w: 5.6, h: 0.9,
      fontSize: 12, color: TEXT, valign: "middle",
    });
  });

  // Slide 3: Project Overview
  const overviewSlide = pptx.addSlide();
  addSlideHeader(overviewSlide as any, pptx, "Project Overview");

  overviewSlide.addText("Project Overview", { x: 0.5, y: 0.9, w: 12.5, h: 0.6, fontSize: 24, bold: true, color: NAVY });

  const overview = (agendaData.project_overview as string) || "";
  overviewSlide.addText(overview, {
    x: 0.5, y: 1.6, w: 12.5, h: 2.0,
    fontSize: 13, color: TEXT_MID, wrap: true,
  });

  // Info boxes
  const infoBoxes = [
    { label: "Methodology", value: String(agendaData.methodology || "Predictive"), color: PRIMARY },
    { label: "Duration", value: `${agendaData.duration_weeks || 0} Weeks`, color: SUCCESS },
    { label: "Team Size", value: `${agendaData.team_size_recommended || 0} Members`, color: ACCENT },
    { label: "Effort", value: `${agendaData.estimated_effort_hours || 0} Hrs`, color: GOLD },
  ];
  infoBoxes.forEach((box, i) => {
    overviewSlide.addShape(pptx.ShapeType.roundRect, {
      x: 0.5 + i * 3.2, y: 3.8, w: 3.0, h: 1.6,
      fill: { color: "FFFFFF" }, line: { color: box.color, width: 3 },
    });
    overviewSlide.addShape(pptx.ShapeType.rect, {
      x: 0.5 + i * 3.2, y: 3.8, w: 3.0, h: 0.4,
      fill: { color: box.color },
    });
    overviewSlide.addText(box.label, {
      x: 0.5 + i * 3.2, y: 3.82, w: 3.0, h: 0.36,
      fontSize: 10, bold: true, color: WHITE, align: "center",
    });
    overviewSlide.addText(box.value, {
      x: 0.5 + i * 3.2, y: 4.3, w: 3.0, h: 1.0,
      fontSize: 18, bold: true, color: box.color, align: "center", valign: "middle",
    });
  });

  // Slide 4: Objectives
  const objSlide = pptx.addSlide();
  addSlideHeader(objSlide as any, pptx, "Project Objectives");

  objSlide.addText("Project Objectives", { x: 0.5, y: 0.9, w: 12.5, h: 0.6, fontSize: 24, bold: true, color: NAVY });

  const phases = (agendaData.phases as Array<{name:string;description:string}>) || [];
  phases.slice(0, 6).forEach((phase, i) => {
    objSlide.addShape(pptx.ShapeType.roundRect, {
      x: 0.5 + (i % 3) * 4.4, y: 1.7 + Math.floor(i / 3) * 2.0, w: 4.1, h: 1.8,
      fill: { color: BG_LIGHT }, line: { color: ACCENT, width: 1.5 },
    });
    objSlide.addShape(pptx.ShapeType.roundRect, {
      x: 0.5 + (i % 3) * 4.4, y: 1.7 + Math.floor(i / 3) * 2.0, w: 4.1, h: 0.45,
      fill: { color: PRIMARY },
    });
    objSlide.addText(`Phase ${i + 1}: ${phase.name}`, {
      x: 0.6 + (i % 3) * 4.4, y: 1.72 + Math.floor(i / 3) * 2.0, w: 3.9, h: 0.4,
      fontSize: 10, bold: true, color: WHITE,
    });
    objSlide.addText(phase.description.substring(0, 100), {
      x: 0.6 + (i % 3) * 4.4, y: 2.2 + Math.floor(i / 3) * 2.0, w: 3.9, h: 1.2,
      fontSize: 9, color: TEXT_MID, wrap: true,
    });
  });

  // Slide 5: Timeline
  const timelineSlide = pptx.addSlide();
  addSlideHeader(timelineSlide as any, pptx, "Project Timeline");

  timelineSlide.addText("Project Timeline", { x: 0.5, y: 0.9, w: 12.5, h: 0.6, fontSize: 24, bold: true, color: NAVY });

  const allPhases = (agendaData.phases as Array<{name:string;start_week:number;end_week:number}>) || [];
  const totalWeeks = Number(agendaData.duration_weeks) || 12;
  const barWidth = 11.5;
  const barX = 0.8;
  const barY = 1.7;
  const phaseHeight = 0.55;
  const colors = [PRIMARY, SUCCESS, ACCENT, GOLD, "8B5CF6", DANGER];

  allPhases.forEach((phase, i) => {
    const x = barX + ((phase.start_week - 1) / totalWeeks) * barWidth;
    const w = ((phase.end_week - phase.start_week + 1) / totalWeeks) * barWidth;
    const y = barY + i * (phaseHeight + 0.15);

    timelineSlide.addShape(pptx.ShapeType.roundRect, {
      x, y, w, h: phaseHeight,
      fill: { color: colors[i % colors.length] },
      line: { color: colors[i % colors.length], width: 0 },
    });
    timelineSlide.addText(phase.name, {
      x, y, w, h: phaseHeight,
      fontSize: 9, bold: true, color: WHITE, align: "center", valign: "middle",
    });
  });

  // Week markers
  for (let w = 1; w <= totalWeeks; w += 2) {
    timelineSlide.addText(`W${w}`, {
      x: barX + ((w - 1) / totalWeeks) * barWidth - 0.1, y: 1.4, w: 0.5, h: 0.3,
      fontSize: 8, color: TEXT_LIGHT, align: "center",
    });
  }

  // Slide 6: Team & Risks
  const teamSlide = pptx.addSlide();
  addSlideHeader(teamSlide as any, pptx, "Team & Risks");

  teamSlide.addText("Key Risks", { x: 0.5, y: 0.9, w: 12.5, h: 0.6, fontSize: 24, bold: true, color: NAVY });

  const risks = (agendaData.risks as Array<{name:string;probability:string;impact:string;response:string}>) || [];
  risks.slice(0, 6).forEach((risk, i) => {
    teamSlide.addShape(pptx.ShapeType.rect, {
      x: 0.5, y: 1.7 + i * 0.75, w: 0.2, h: 0.55,
      fill: { color: risk.probability === "High" || risk.impact === "High" ? DANGER : risk.probability === "Medium" ? GOLD : SUCCESS },
    });
    teamSlide.addText(`${risk.name} — Response: ${risk.response}`, {
      x: 0.85, y: 1.75 + i * 0.75, w: 12, h: 0.5,
      fontSize: 11, color: TEXT,
    });
  });

  // Slide 7: Next Steps
  const nextSlide = pptx.addSlide();
  addSlideHeader(nextSlide as any, pptx, "Next Steps");

  nextSlide.addText("Immediate Next Steps", { x: 0.5, y: 0.9, w: 12.5, h: 0.6, fontSize: 24, bold: true, color: NAVY });

  const steps = (agendaData.next_steps as string[]) || [
    "Review and approve Project Charter",
    "Finalize team assignments and RACI matrix",
    "Set up project management tools and communication channels",
    "Conduct detailed planning sessions with all stakeholders",
    "Begin Phase 1 activities per the approved schedule",
  ];

  steps.slice(0, 5).forEach((step, i) => {
    nextSlide.addShape(pptx.ShapeType.roundRect, {
      x: 0.5, y: 1.7 + i * 0.95, w: 12.5, h: 0.8,
      fill: { color: i === 0 ? "EFF6FF" : BG_LIGHT },
      line: { color: i === 0 ? PRIMARY : BORDER, width: i === 0 ? 2 : 1 },
    });
    nextSlide.addShape(pptx.ShapeType.ellipse, {
      x: 0.6, y: 1.77 + i * 0.95, w: 0.55, h: 0.55,
      fill: { color: i === 0 ? PRIMARY : TEXT_LIGHT },
    });
    nextSlide.addText(String(i + 1), {
      x: 0.6, y: 1.77 + i * 0.95, w: 0.55, h: 0.55,
      fontSize: 12, bold: true, color: WHITE, align: "center", valign: "middle",
    });
    nextSlide.addText(step, {
      x: 1.3, y: 1.77 + i * 0.95, w: 11.5, h: 0.6,
      fontSize: 12, color: i === 0 ? PRIMARY : TEXT, valign: "middle",
    });
  });

  // Slide 8: Thank You
  const endSlide = pptx.addSlide();
  endSlide.background = { color: NAVY };
  endSlide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.08, h: "100%", fill: { color: ACCENT } });
  endSlide.addText("Thank You", { x: 0.5, y: 2.5, w: 12.5, h: 1.5, fontSize: 52, bold: true, color: WHITE, align: "center" });
  endSlide.addText("Questions & Discussion", { x: 0.5, y: 4.1, w: 12.5, h: 0.6, fontSize: 22, color: ACCENT, align: "center" });
  endSlide.addText("Powered by Wuduh | وضوح  •  PMI/PMBOK Guide 7th Edition", {
    x: 0.5, y: 5.8, w: 12.5, h: 0.4, fontSize: 11, italic: true, color: TEXT_LIGHT, align: "center",
  });

  return pptx.write({ outputType: "arraybuffer" }) as Promise<Uint8Array>;
}

// ============================
// 2. Stakeholder Presentation
// ============================
export async function generateStakeholderPPTX(agendaData: Record<string, unknown>, projectName: string): Promise<Uint8Array> {
  const pptx = createPptx();

  addCoverSlide(pptx, "Stakeholder Briefing", "إحاطة أصحاب المصلحة", projectName);

  // Slide: Executive Summary
  const execSlide = pptx.addSlide();
  addSlideHeader(execSlide as any, pptx, "Executive Summary");
  execSlide.addText("Executive Summary", { x: 0.5, y: 0.9, w: 12.5, h: 0.6, fontSize: 24, bold: true, color: NAVY });

  const kpis = (agendaData.kpis as Array<{name:string;target:string}>) || [];
  kpis.slice(0, 4).forEach((kpi, i) => {
    execSlide.addShape(pptx.ShapeType.roundRect, {
      x: 0.5 + (i % 2) * 6.5, y: 1.7 + Math.floor(i / 2) * 2.0, w: 6.0, h: 1.8,
      fill: { color: "EFF6FF" }, line: { color: PRIMARY, width: 2 },
    });
    execSlide.addText(kpi.name, {
      x: 0.7 + (i % 2) * 6.5, y: 1.8 + Math.floor(i / 2) * 2.0, w: 5.6, h: 0.5,
      fontSize: 11, bold: true, color: NAVY,
    });
    execSlide.addText(kpi.target, {
      x: 0.7 + (i % 2) * 6.5, y: 2.3 + Math.floor(i / 2) * 2.0, w: 5.6, h: 0.9,
      fontSize: 20, bold: true, color: PRIMARY, align: "center", valign: "middle",
    });
  });

  // Slide: Value & Benefits
  const valueSlide = pptx.addSlide();
  addSlideHeader(valueSlide as any, pptx, "Value & Benefits");
  valueSlide.addText("Business Value & Benefits", { x: 0.5, y: 0.9, w: 12.5, h: 0.6, fontSize: 24, bold: true, color: NAVY });

  const factors = (agendaData.critical_success_factors as string[]) || [];
  factors.slice(0, 6).forEach((factor, i) => {
    valueSlide.addShape(pptx.ShapeType.ellipse, {
      x: 0.5, y: 1.7 + i * 0.75, w: 0.5, h: 0.5,
      fill: { color: SUCCESS },
    });
    valueSlide.addText("✓", { x: 0.5, y: 1.7 + i * 0.75, w: 0.5, h: 0.5, fontSize: 14, bold: true, color: WHITE, align: "center", valign: "middle" });
    valueSlide.addText(factor, {
      x: 1.2, y: 1.72 + i * 0.75, w: 12, h: 0.55, fontSize: 12, color: TEXT,
    });
  });

  // Thank you
  const endSlide = pptx.addSlide();
  endSlide.background = { color: NAVY };
  endSlide.addText("Questions?", { x: 0.5, y: 2.8, w: 12.5, h: 1.5, fontSize: 52, bold: true, color: WHITE, align: "center" });
  endSlide.addText("Powered by Wuduh | وضوح  •  PMI/PMBOK Guide 7th Edition", {
    x: 0.5, y: 6.0, w: 12.5, h: 0.4, fontSize: 11, italic: true, color: TEXT_LIGHT, align: "center",
  });

  return pptx.write({ outputType: "arraybuffer" }) as Promise<Uint8Array>;
}

// ============================
// 3. Progress Report Presentation
// ============================
export async function generateProgressReportPPTX(reportData: Record<string, unknown>, projectName: string): Promise<Uint8Array> {
  const pptx = createPptx();

  addCoverSlide(pptx, "Progress Report", "تقرير التقدم", projectName);

  // Slide: Status Dashboard
  const dashSlide = pptx.addSlide();
  addSlideHeader(dashSlide as any, pptx, "Status Dashboard");
  dashSlide.addText("Project Status Dashboard", { x: 0.5, y: 0.9, w: 12.5, h: 0.6, fontSize: 24, bold: true, color: NAVY });

  const statusItems = [
    { label: "Schedule", status: (reportData.schedule_status as string) || "On Track", color: SUCCESS },
    { label: "Budget", status: (reportData.budget_status as string) || "On Budget", color: SUCCESS },
    { label: "Scope", status: (reportData.scope_status as string) || "Controlled", color: ACCENT },
    { label: "Quality", status: (reportData.quality_status as string) || "Meeting Standards", color: PRIMARY },
  ];

  statusItems.forEach((item, i) => {
    dashSlide.addShape(pptx.ShapeType.roundRect, {
      x: 0.5 + i * 3.2, y: 1.7, w: 3.0, h: 2.0,
      fill: { color: "FFFFFF" }, line: { color: item.color, width: 3 },
    });
    dashSlide.addShape(pptx.ShapeType.rect, {
      x: 0.5 + i * 3.2, y: 1.7, w: 3.0, h: 0.45,
      fill: { color: item.color },
    });
    dashSlide.addText(item.label, {
      x: 0.5 + i * 3.2, y: 1.72, w: 3.0, h: 0.4,
      fontSize: 11, bold: true, color: WHITE, align: "center",
    });
    dashSlide.addText("●", {
      x: 0.5 + i * 3.2, y: 2.2, w: 3.0, h: 0.8,
      fontSize: 28, color: item.color, align: "center",
    });
    dashSlide.addText(item.status, {
      x: 0.5 + i * 3.2, y: 3.0, w: 3.0, h: 0.6,
      fontSize: 10, color: TEXT_MID, align: "center",
    });
  });

  // Summary text
  const summary = (reportData.executive_summary as string) || "";
  if (summary) {
    dashSlide.addText(summary, {
      x: 0.5, y: 4.0, w: 12.5, h: 1.5,
      fontSize: 12, color: TEXT_MID, wrap: true,
    });
  }

  // Slide: Accomplishments & Next
  const accompSlide = pptx.addSlide();
  addSlideHeader(accompSlide as any, pptx, "Accomplishments & Next Steps");
  accompSlide.addText("This Period Highlights", { x: 0.5, y: 0.9, w: 12.5, h: 0.6, fontSize: 24, bold: true, color: NAVY });

  const accomplishments = (reportData.accomplishments as string[]) || [];
  accomplishments.slice(0, 4).forEach((item, i) => {
    accompSlide.addShape(pptx.ShapeType.roundRect, {
      x: 0.5, y: 1.7 + i * 1.1, w: 12.5, h: 0.9,
      fill: { color: BG_LIGHT }, line: { color: SUCCESS, width: 1.5 },
    });
    accompSlide.addText("✓", { x: 0.6, y: 1.75 + i * 1.1, w: 0.5, h: 0.8, fontSize: 14, bold: true, color: SUCCESS, valign: "middle" });
    accompSlide.addText(item, {
      x: 1.2, y: 1.75 + i * 1.1, w: 11.6, h: 0.8,
      fontSize: 12, color: TEXT, valign: "middle",
    });
  });

  const endSlide = pptx.addSlide();
  endSlide.background = { color: NAVY };
  endSlide.addText("Progress Report", { x: 0.5, y: 2.5, w: 12.5, h: 1.5, fontSize: 48, bold: true, color: WHITE, align: "center" });
  endSlide.addText(projectName, { x: 0.5, y: 4.1, w: 12.5, h: 0.6, fontSize: 22, color: ACCENT, align: "center" });
  endSlide.addText("Powered by Wuduh | وضوح  •  PMI/PMBOK Guide 7th Edition", {
    x: 0.5, y: 6.0, w: 12.5, h: 0.4, fontSize: 11, italic: true, color: TEXT_LIGHT, align: "center",
  });

  return pptx.write({ outputType: "arraybuffer" }) as Promise<Uint8Array>;
}
