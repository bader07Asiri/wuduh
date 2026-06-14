"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { Textarea } from "@/components/ui/Input";
import {
  CheckCircle, AlertTriangle, Users, Target,
  Calendar, ChevronDown, ChevronUp, FileDown, Sparkles
} from "lucide-react";
import type { Project, AIAgenda, ProjectPhase, RiskItem } from "@/types";
import { getRiskColor, getRiskLabel, formatDate } from "@/lib/utils";

const probabilityLabels: Record<string, string> = {
  very_high: "عالية جداً", high: "عالية", medium: "متوسطة", low: "منخفضة", very_low: "منخفضة جداً"
};

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [approving, setApproving] = useState(false);
  const [notes, setNotes] = useState("");
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  async function fetchProject() {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProject(data);
      setNotes(data.user_notes ?? "");

      // If no agenda yet, generate it
      if (!data.ai_agenda && data.status === "planning") {
        await generateAgenda();
      }
    } catch {
      toast.error("تعذّر تحميل المشروع");
      router.push("/projects");
    } finally {
      setLoading(false);
    }
  }

  async function generateAgenda() {
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: id, type: "agenda" }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProject(data.project);
    } catch {
      toast.error("خطأ في توليد الأجندة، حاول مرة أخرى");
    } finally {
      setGenerating(false);
    }
  }

  async function approveAgenda() {
    setApproving(true);
    try {
      const res = await fetch(`/api/projects/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (!res.ok) throw new Error();
      toast.success("تم اعتماد الأجندة! يمكنك الآن توليد المخرجات.");
      router.push(`/projects/${id}/deliverables`);
    } catch {
      toast.error("حدث خطأ، حاول مرة أخرى");
    } finally {
      setApproving(false);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <p className="text-slate-400 font-arabic">جارٍ تحميل المشروع...</p>
      </div>
    </div>
  );

  if (!project) return null;

  const agenda = project.ai_agenda as AIAgenda | undefined;

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={project.agenda_approved ? "success" : "info"} dot>
              {project.agenda_approved ? "معتمد" : "قيد المراجعة"}
            </Badge>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-arabic">{project.name}</h1>
          <p className="text-slate-400 font-arabic text-sm mt-1">
            {formatDate(project.start_date)} — {formatDate(project.end_date)}
          </p>
        </div>
        {project.agenda_approved && (
          <Link href={`/projects/${id}/deliverables`}>
            <Button icon={<FileDown size={18} />}>توليد المخرجات</Button>
          </Link>
        )}
      </div>

      {/* Generating State */}
      {generating && (
        <Card className="text-center py-16 mb-6">
          <Sparkles size={40} className="text-brand-blue mx-auto mb-4 animate-pulse" />
          <h3 className="text-xl font-black text-slate-900 font-arabic mb-2">وضوح يبني أجندتك...</h3>
          <p className="text-slate-400 font-arabic text-sm mb-4">
            جارٍ تحليل معطيات مشروعك وبناء خطة PMI الكاملة
          </p>
          <Spinner className="mx-auto" />
        </Card>
      )}

      {/* Agenda */}
      {agenda && !generating && (
        <div className="space-y-6">

          {/* AI Disclaimer */}
          <div className="flex items-start gap-3 bg-brand-cyan/10 border border-amber-200 rounded-2xl px-5 py-4">
            <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-800 font-arabic">مخرج ذكاء اصطناعي — يتطلب مراجعة بشرية</p>
              <p className="text-xs text-amber-700 font-arabic mt-0.5 leading-relaxed">
                هذه الخطة مولّدة بالذكاء الاصطناعي وفق معايير PMBOK Guide 7th Edition. راجعها مع فريقك قبل الاعتماد الرسمي. وضوح لا يتحمل مسؤولية القرارات المبنية عليها دون مراجعة متخصص.
              </p>
            </div>
          </div>

          {/* Overview */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Target size={18} className="text-brand-blue" />
              <h2 className="font-bold text-slate-900 font-arabic">نظرة عامة</h2>
            </div>
            <p className="text-slate-600 font-arabic text-sm leading-relaxed">{agenda.project_overview}</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <div className="bg-blue-50 text-brand-blue text-xs px-3 py-1.5 rounded-full font-arabic font-medium">
                📐 المنهجية: {agenda.methodology}
              </div>
              <div className="bg-brand-cyan/10 text-brand-cyan text-xs px-3 py-1.5 rounded-full font-arabic font-medium">
                ⏱ الجهد: {agenda.estimated_effort_hours?.toLocaleString()} ساعة
              </div>
            </div>
          </Card>

          {/* Phases */}
          <Card padding="none">
            <div className="flex items-center gap-2 p-6 border-b border-slate-100">
              <Calendar size={18} className="text-brand-blue" />
              <h2 className="font-bold text-slate-900 font-arabic">مراحل المشروع ({agenda.phases?.length})</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {agenda.phases?.map((phase: ProjectPhase) => (
                <div key={phase.id}>
                  <button
                    className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
                    onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                  >
                    <div className="flex items-center gap-3 text-right">
                      <div className="w-8 h-8 rounded-lg bg-brand-blue/10 text-brand-blue text-xs font-bold flex items-center justify-center font-latin">
                        {phase.id.replace("phase_", "")}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 font-arabic text-sm">{phase.name}</div>
                        <div className="text-xs text-slate-400 font-arabic">
                          الأسبوع {phase.start_week} — {phase.end_week} • {phase.tasks?.length} مهمة
                        </div>
                      </div>
                    </div>
                    {expandedPhase === phase.id ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </button>

                  {expandedPhase === phase.id && (
                    <div className="px-5 pb-5 bg-slate-50/50">
                      <p className="text-sm text-slate-500 font-arabic mb-4">{phase.description}</p>
                      <div className="grid gap-2">
                        {phase.tasks?.map((task) => (
                          <div key={task.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              task.priority === "critical" ? "bg-red-500" :
                              task.priority === "high" ? "bg-orange-500" :
                              task.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
                            }`} />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-slate-800 font-arabic">{task.name}</div>
                              <div className="text-xs text-slate-400 font-arabic">{task.responsible} • {task.duration_days} أيام</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Risks */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={18} className="text-brand-cyan" />
              <h2 className="font-bold text-slate-900 font-arabic">المخاطر الرئيسية ({agenda.risk_summary?.length})</h2>
            </div>
            <div className="space-y-2">
              {agenda.risk_summary?.map((risk: RiskItem) => (
                <div key={risk.id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-0.5 ${getRiskColor(risk.risk_score)}`}>
                    {getRiskLabel(risk.risk_score)}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-800 font-arabic">{risk.risk}</div>
                    <div className="text-xs text-slate-400 font-arabic mt-0.5">
                      الاحتمالية: {probabilityLabels[risk.probability]} • الأثر: {probabilityLabels[risk.impact]}
                    </div>
                    <div className="text-xs text-emerald-500 font-arabic mt-1">✓ {risk.mitigation_action}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* KPIs */}
          {agenda.kpis && (
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle size={18} className="text-emerald-500" />
                <h2 className="font-bold text-slate-900 font-arabic">مؤشرات النجاح (KPIs)</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {agenda.kpis.map((kpi) => (
                  <div key={kpi.name} className="p-3 bg-emerald-50 rounded-xl">
                    <div className="font-medium text-slate-800 font-arabic text-sm">{kpi.name}</div>
                    <div className="text-xs text-emerald-500 font-arabic mt-1">الهدف: {kpi.target}</div>
                    <div className="text-xs text-slate-400 font-arabic">{kpi.frequency}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Recommendations */}
          {agenda.recommendations && (
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-brand-blue" />
                <h2 className="font-bold text-slate-900 font-arabic">توصيات وضوح</h2>
              </div>
              <ul className="space-y-2">
                {agenda.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-arabic text-slate-600">
                    <span className="text-brand-blue mt-0.5">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Approval Section */}
          {!project.agenda_approved && (
            <Card className="border-2 border-brand-blue/20 bg-blue-50/50">
              <h2 className="font-bold text-slate-900 font-arabic mb-3 flex items-center gap-2">
                <Users size={18} className="text-brand-blue" />
                اعتماد الأجندة
              </h2>
              <Textarea
                label="ملاحظاتك (اختياري)"
                placeholder="أضف أي ملاحظات أو تعديلات تريد أن يراعيها وضوح عند توليد المخرجات..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
              />
              <div className="flex gap-3 mt-4">
                <Button variant="ghost" onClick={generateAgenda} icon={<Sparkles size={16} />}>
                  أعد التوليد
                </Button>
                <Button className="flex-1" loading={approving} onClick={approveAgenda} icon={<CheckCircle size={18} />}>
                  اعتمد الأجندة وانتقل للمخرجات
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
