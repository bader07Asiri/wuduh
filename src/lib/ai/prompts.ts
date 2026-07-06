// ============================
// وضوح | Wuduh — AI Prompts
// مبنية على PMBOK Guide 7th Edition + PMI Standards
// ============================

import type { Industry, UserType, ProjectFormData, UserProfile } from "@/types";

// ============================
// Industry Context — تخصيص المحتوى حسب القطاع
// ============================
const INDUSTRY_CONTEXT: Record<Industry, string> = {
  construction:   "قطاع البناء والإنشاءات: راعِ معايير السلامة (OSHA/SBC)، تصاريح البناء، الجداول الزمنية للأعمال المدنية، وإدارة المقاولين من الباطن. استخدم مصطلحات هندسية دقيقة.",
  technology:     "قطاع التقنية والبرمجيات: طبّق Agile/Scrum حيثما أمكن، راعِ دورات Sprint، مراجعات الكود، اختبارات QA، ونشر CI/CD. استخدم مصطلحات تقنية دقيقة.",
  healthcare:     "قطاع الصحة والطب: راعِ اشتراطات HIPAA/CBAHI، موافقات الجهات التنظيمية، معايير سلامة المرضى، والاعتمادات الطبية. الامتثال التنظيمي أولوية قصوى.",
  manufacturing:  "قطاع التصنيع: طبّق منهجيات Lean/Six Sigma، إدارة سلاسل التوريد، معايير ISO، والتحكم في الجودة. راعِ أوقات التوقف وكفاءة الإنتاج.",
  education:      "قطاع التعليم: راعِ السنوات الأكاديمية والفصول الدراسية، اعتمادات الجهات التعليمية، مشاركة أولياء الأمور، ومعايير المناهج الوطنية.",
  retail:         "قطاع التجزئة: راعِ مواسم البيع والذروات، إدارة المخزون، تجربة العملاء، وأنظمة نقاط البيع. التوقيت التجاري عامل حرج.",
  finance:        "قطاع المالية والبنوك: راعِ الامتثال التنظيمي (SAMA/CMA)، متطلبات التدقيق، الحوكمة، وإدارة المخاطر المالية. الدقة والتوثيق أساسيان.",
  government:     "القطاع الحكومي: راعِ اشتراطات المنافسات والمشتريات الحكومية، لوائح نظام المالية العامة، آليات الموافقة متعددة المستويات، والمساءلة العامة.",
  energy:         "قطاع الطاقة والكهرباء: راعِ اشتراطات الشبكة الكهربائية، معايير السلامة الكهربائية، التصاريح البيئية، ومعايير NERC/IEC.",
  oil_gas:        "قطاع النفط والغاز: راعِ معايير HSE الصارمة، تصاريح العمل، إدارة المقاولين في البيئات الخطرة، وضوابط أرامكو/سابك وجهات التنظيم.",
  transportation: "قطاع النقل: راعِ تصاريح الطرق والجسور، معايير هيئة النقل، السلامة المرورية، والتنسيق مع الجهات الحكومية المتعددة.",
  logistics:      "قطاع اللوجستيك: راعِ إدارة سلاسل التوريد، الجمارك والتخليص، تتبع الشحنات، وتحسين مسارات التوزيع. الوقت والتكلفة مؤشرات حرجة.",
  hospitality:    "قطاع الضيافة والفنادق: راعِ معايير الفئات الفندقية، تجربة النزيل، الاشتراطات الصحية، والمواسم السياحية. رضا العملاء مؤشر محوري.",
  tourism:        "قطاع السياحة: راعِ مواسم الذروة، تصاريح المناطق السياحية، التنسيق مع هيئة السياحة، والمواصفات الثقافية والتراثية.",
  real_estate:    "قطاع العقارات: راعِ تصاريح البناء، اشتراطات هيئة العقار، دراسات الجدوى، وخطط التسويق والبيع. التدفقات النقدية والتمويل عوامل حرجة.",
  telecom:        "قطاع الاتصالات: راعِ تراخيص هيئة الاتصالات (CITC)، متطلبات تغطية الشبكة، معايير جودة الخدمة، وإدارة البنية التحتية.",
  media:          "قطاع الإعلام والتسويق: راعِ الجداول الزمنية للإنتاج، معايير المحتوى الرقمي، الإيقاع التحريري، وقياس الأثر والوصول.",
  agriculture:    "قطاع الزراعة: راعِ المواسم الزراعية، اشتراطات وزارة البيئة والمياه والزراعة، سلاسل التبريد، ومعايير سلامة الغذاء.",
  defense:        "قطاع الدفاع: راعِ متطلبات السرية والتصاريح الأمنية، لوائح وزارة الدفاع، اشتراطات المواصفات العسكرية، وإجراءات الموافقة الخاصة.",
  legal:          "القطاع القانوني: راعِ المواعيد القضائية والتقادم، متطلبات التوثيق والتوثيق الرسمي، سرية المعلومات، ومعايير هيئة المحامين السعوديين.",
  consulting:     "قطاع الاستشارات: راعِ مراحل تقديم الخدمة، اتفاقيات مستوى الخدمة (SLA)، إدارة توقعات العميل، وقياس الأثر والقيمة المقدمة.",
  nonprofit:      "المنظمات غير الربحية: راعِ متطلبات الجهات المانحة، قياس الأثر الاجتماعي، الشفافية والحوكمة، والاشتراطات التنظيمية للمنظمات الخيرية.",
  other:          "قطاع عام: طبّق أفضل ممارسات PMBOK بشكل شامل مع مراعاة السياق المحدد للمشروع.",
};

function buildSystemContext(edition: "7" | "8" = "7"): string {
  const editionDetails = edition === "8"
    ? `إرشادات PMBOK Guide الإصدار الثامن (2025).
قواعدك الصارمة:
1. لا تخترع معلومات — كل مخرج يجب أن يكون مبنياً على المعطيات المُدخلة فقط
2. التزم بمصطلحات PMI الرسمية في كل مخرجاتك
3. طبّق المبادئ الستة للإصدار الثامن: Stewardship, Stakeholders, Team, Value, Systems, Leadership
4. طبّق مجالات الأداء السبعة: Stakeholders, Team, Development Approach & Life Cycle, Planning, Project Work, Delivery, Measurement, Uncertainty
5. طبّق العمليات الأربعين (40 Process) الموزعة على مجموعات العمليات الخمس
6. أجب دائماً بصيغة JSON نظيفة وصحيحة بدون أي نص خارجها
7. كل التواريخ بصيغة YYYY-MM-DD
8. الأرقام كـ numbers لا كـ strings
9. كن محدداً وقابلاً للتطبيق — لا عموميات`
    : `إرشادات PMBOK Guide الإصدار السابع.
قواعدك الصارمة:
1. لا تخترع معلومات — كل مخرج يجب أن يكون مبنياً على المعطيات المُدخلة فقط
2. التزم بمصطلحات PMI الرسمية في كل مخرجاتك
3. طبّق مجموعات العمليات الخمس: Initiating, Planning, Executing, Monitoring & Controlling, Closing
4. راعِ مجالات الأداء الثمانية في PMBOK 7: Stakeholders, Team, Development Approach, Planning, Project Work, Delivery, Measurement, Uncertainty
5. طبّق المبادئ الاثني عشر للإصدار السابع
6. أجب دائماً بصيغة JSON نظيفة وصحيحة بدون أي نص خارجها
7. كل التواريخ بصيغة YYYY-MM-DD
8. الأرقام كـ numbers لا كـ strings
9. كن محدداً وقابلاً للتطبيق — لا عموميات`;

  return `أنت مساعد إدارة مشاريع متخصص ومعتمد، تعمل وفق معايير PMI (Project Management Institute) و${editionDetails}`.trim();
}

// Keep backward-compatible constant for non-project prompts
const PMBOK_SYSTEM_CONTEXT = buildSystemContext("7");

// ============================
// 1. توليد الأجندة الكاملة
// ============================
export function buildAgendaPrompt(
  project: ProjectFormData,
  user: Pick<UserProfile, "user_type" | "industry" | "company_name" | "team_size">
): { system: string; user: string } {
  const durationDays = Math.ceil(
    (new Date(project.end_date).getTime() - new Date(project.start_date).getTime()) /
    (1000 * 60 * 60 * 24)
  );
  const durationWeeks = Math.ceil(durationDays / 7);

  const industryCtx = INDUSTRY_CONTEXT[user.industry ?? "other"] ?? INDUSTRY_CONTEXT.other;
  const edition = (project.pmbok_edition ?? "7") as "7" | "8";

  return {
    system: buildSystemContext(edition),
    user: `
قم ببناء أجندة إدارة مشروع كاملة وفق معايير PMI/PMBOK الإصدار ${edition === "8" ? "الثامن (2025)" : "السابع"} للمشروع التالي:

=== السياق القطاعي (مهم جداً) ===
${industryCtx}

=== بيانات المشروع ===
الاسم: ${project.name}
الوصف: ${project.description}
العميل/الجهة: ${project.client_name ?? "غير محدد"}
تاريخ البداية: ${project.start_date}
تاريخ النهاية: ${project.end_date}
المدة: ${durationWeeks} أسبوع (${durationDays} يوم)
الميزانية: ${project.budget ? project.budget + " " + project.currency : "غير محددة"}
حجم الفريق: ${project.team_size} شخص
الأهداف: ${project.objectives.join(" | ")}
القيود: ${project.constraints ?? "لا يوجد قيود محددة"}
الافتراضات: ${project.assumptions ?? "لا توجد افتراضات محددة"}

=== بيانات المنظمة ===
نوع المستخدم: ${user.user_type}
القطاع: ${user.industry}
الشركة: ${user.company_name ?? "غير محددة"}
حجم الفريق المعتاد: ${user.team_size ?? "غير محدد"}

=== المطلوب ===
أنشئ JSON كامل بالهيكل التالي بدقة:

{
  "project_overview": "نظرة عامة شاملة على المشروع في 3-4 جمل",
  "methodology": "Predictive (Waterfall) | Agile | Hybrid — اختر الأنسب مع تبرير موجز",
  "estimated_effort_hours": 0,
  "pmbok_processes": ["قائمة بعمليات PMBOK المطبقة"],
  "phases": [
    {
      "id": "phase_1",
      "name": "اسم المرحلة",
      "description": "وصف المرحلة",
      "start_week": 1,
      "end_week": 2,
      "deliverables": ["مخرج 1", "مخرج 2"],
      "tasks": [
        {
          "id": "t1",
          "name": "اسم المهمة",
          "description": "وصف المهمة",
          "duration_days": 5,
          "dependencies": [],
          "responsible": "المسمى الوظيفي",
          "priority": "critical | high | medium | low"
        }
      ]
    }
  ],
  "key_milestones": [
    {
      "name": "اسم المعلم",
      "week": 1,
      "description": "وصف",
      "success_criteria": "معيار النجاح"
    }
  ],
  "risk_summary": [
    {
      "id": "r1",
      "risk": "وصف الخطر",
      "category": "technical | schedule | cost | resource | external | quality",
      "probability": "very_high | high | medium | low | very_low",
      "impact": "very_high | high | medium | low | very_low",
      "risk_score": 0,
      "response_strategy": "avoid | mitigate | transfer | accept",
      "mitigation_action": "إجراء التخفيف",
      "owner": "المسؤول"
    }
  ],
  "resource_summary": [
    {
      "role": "المسمى الوظيفي",
      "count": 1,
      "allocation_percentage": 100,
      "notes": "ملاحظات"
    }
  ],
  "kpis": [
    {
      "name": "اسم المؤشر",
      "target": "الهدف",
      "measurement_method": "طريقة القياس",
      "frequency": "التكرار"
    }
  ],
  "recommendations": ["توصية 1", "توصية 2", "توصية 3"]
}

قيود صارمة على الحجم (إلزامية لتفادي انقطاع الإخراج):
- 3 مراحل بالضبط (لا أكثر)
- 3 مهام لكل مرحلة بالضبط (لا أكثر)
- 3 معالم رئيسية بالضبط
- 3 مخاطر بالضبط مع درجات خطر محسوبة (probability_score × impact_score)
- 3 KPIs بالضبط
- pmbok_processes: 5 عناصر كحد أقصى
- resource_summary: 3 عناصر كحد أقصى
- recommendations: 3 عناصر كحد أقصى
- الجدول الزمني يغطي ${durationWeeks} أسبوع بالكامل
- كل وصف/جملة: 8 كلمات كحد أقصى — اختصار شديد
- لا تكرّر معلومات بين الحقول
- أخرج JSON صالحاً فقط — لا نص قبله ولا بعده، ولا تعليقات
`.trim(),
  };
}

// ============================
// 2. توليد Project Charter
// ============================
export function buildCharterPrompt(project: ProjectFormData, agenda: object): { system: string; user: string } {
  return {
    system: PMBOK_SYSTEM_CONTEXT,
    user: `
بناءً على بيانات المشروع والأجندة المعتمدة التالية، أنشئ Project Charter رسمي وفق معايير PMI.

بيانات المشروع: ${JSON.stringify(project, null, 2)}
الأجندة المعتمدة: ${JSON.stringify(agenda, null, 2)}

أنشئ JSON بالهيكل التالي:
{
  "document_title": "ميثاق المشروع",
  "project_name": "",
  "project_number": "WUD-${Date.now().toString().slice(-6)}",
  "prepared_by": "وضوح | Wuduh AI",
  "preparation_date": "${new Date().toISOString().split("T")[0]}",
  "version": "1.0",
  "purpose": "غرض المشروع",
  "description": "وصف شامل",
  "objectives": ["هدف 1", "هدف 2"],
  "scope_included": ["ما يشمله المشروع"],
  "scope_excluded": ["ما لا يشمله المشروع"],
  "deliverables": ["مخرج 1"],
  "milestones": [{"name": "", "date": "YYYY-MM-DD"}],
  "budget_summary": {"total": 0, "currency": "SAR", "notes": ""},
  "resources": [{"role": "", "name": "TBD", "responsibility": ""}],
  "stakeholders": [{"name": "", "role": "", "influence": "high | medium | low", "interest": "high | medium | low"}],
  "risks_summary": ["خطر 1"],
  "assumptions": ["افتراض 1"],
  "constraints": ["قيد 1"],
  "dependencies": ["تبعية 1"],
  "success_criteria": ["معيار النجاح 1"],
  "authorization": {"sponsor": "اسم الراعي", "pm": "مدير المشروع", "notes": ""}
}
`.trim(),
  };
}

// ============================
// 3. توليد سجل المخاطر الكامل
// ============================
export function buildRiskRegisterPrompt(project: ProjectFormData, agenda: object): { system: string; user: string } {
  const industry = (project as { industry?: Industry }).industry ?? "other";
  const industryCtx = INDUSTRY_CONTEXT[industry] ?? INDUSTRY_CONTEXT.other;
  return {
    system: PMBOK_SYSTEM_CONTEXT,
    user: `
أنشئ سجل مخاطر شاملاً وفق معايير PMI Risk Management لمشروع: ${project.name}

=== السياق القطاعي ===
${industryCtx}

الأجندة: ${JSON.stringify(agenda, null, 2)}

أنشئ JSON بالهيكل:
{
  "risks": [
    {
      "id": "R001",
      "category": "تقنية | جدول زمني | تكاليف | موارد | خارجية | جودة",
      "risk_statement": "بسبب [سبب]، قد يحدث [حدث]، مما يؤدي إلى [أثر]",
      "probability_score": 1,
      "impact_score": 1,
      "risk_score": 1,
      "risk_level": "حرج | عالٍ | متوسط | منخفض",
      "response_strategy": "تجنب | تخفيف | نقل | قبول",
      "response_actions": ["إجراء 1", "إجراء 2"],
      "contingency_plan": "خطة الطوارئ",
      "trigger": "مؤشر تفعيل",
      "owner": "المسؤول",
      "review_date": "YYYY-MM-DD",
      "status": "مفتوح"
    }
  ],
  "summary": {
    "total_risks": 0,
    "critical": 0,
    "high": 0,
    "medium": 0,
    "low": 0,
    "overall_risk_level": "حرج | عالٍ | متوسط | منخفض"
  }
}

أدرج 10-15 مخطراً شاملاً يغطي كل الفئات. احسب risk_score = probability_score × impact_score.
`.trim(),
  };
}

// ============================
// 4. توليد WBS
// ============================
export function buildWBSPrompt(project: ProjectFormData, agenda: object): { system: string; user: string } {
  const industry = (project as { industry?: Industry }).industry ?? "other";
  const industryCtx = INDUSTRY_CONTEXT[industry] ?? INDUSTRY_CONTEXT.other;
  return {
    system: PMBOK_SYSTEM_CONTEXT,
    user: `
أنشئ Work Breakdown Structure (WBS) شاملاً وفق معايير PMI للمشروع: ${project.name}

=== السياق القطاعي ===
${industryCtx}

الأجندة: ${JSON.stringify(agenda, null, 2)}

أنشئ JSON بالهيكل:
{
  "project_name": "${project.name}",
  "wbs_code": "1.0",
  "levels": [
    {
      "code": "1.0",
      "level": 0,
      "name": "${project.name}",
      "description": "المشروع الكامل",
      "work_packages": [],
      "children": [
        {
          "code": "1.1",
          "level": 1,
          "name": "اسم المرحلة",
          "description": "وصف",
          "work_packages": [
            {
              "code": "1.1.1",
              "level": 2,
              "name": "حزمة العمل",
              "description": "وصف تفصيلي",
              "estimated_hours": 0,
              "responsible": "المسؤول",
              "acceptance_criteria": "معيار القبول"
            }
          ]
        }
      ]
    }
  ],
  "wbs_dictionary": [
    {
      "code": "1.1.1",
      "name": "اسم حزمة العمل",
      "description": "وصف تفصيلي",
      "responsible": "المسؤول",
      "estimated_hours": 0,
      "estimated_cost": 0,
      "acceptance_criteria": "معيار القبول",
      "assumptions": "الافتراضات",
      "constraints": "القيود"
    }
  ]
}
`.trim(),
  };
}

// ============================
// 5. توليد خطة الاتصالات
// ============================
export function buildCommunicationPlanPrompt(project: ProjectFormData, agenda: object): { system: string; user: string } {
  return {
    system: PMBOK_SYSTEM_CONTEXT,
    user: `
أنشئ خطة إدارة الاتصالات وفق PMBOK للمشروع: ${project.name}

أنشئ JSON بالهيكل:
{
  "stakeholders": [
    {
      "name": "الاسم أو الدور",
      "role": "الدور",
      "information_needs": ["ما يحتاج معرفته"],
      "communication_method": "بريد إلكتروني | اجتماع | تقرير | لوحة معلومات",
      "frequency": "يومي | أسبوعي | شهري | عند الحاجة",
      "responsible": "المسؤول عن التواصل",
      "format": "شكل التواصل"
    }
  ],
  "communication_matrix": [
    {
      "type": "نوع التواصل",
      "purpose": "الهدف",
      "audience": ["الجمهور"],
      "frequency": "التكرار",
      "method": "الطريقة",
      "responsible": "المسؤول",
      "format": "الصيغة"
    }
  ],
  "meeting_schedule": [
    {
      "meeting_type": "نوع الاجتماع",
      "frequency": "التكرار",
      "duration_minutes": 60,
      "attendees": ["الحضور"],
      "agenda_items": ["بنود جدول الأعمال"],
      "owner": "رئيس الاجتماع"
    }
  ],
  "reporting_schedule": [
    {
      "report_type": "نوع التقرير",
      "frequency": "التكرار",
      "audience": ["المستلمون"],
      "content": ["محتوى التقرير"],
      "responsible": "المسؤول"
    }
  ]
}
`.trim(),
  };
}

// ============================
// 6. توليد Gantt Chart Data
// ============================
export function buildGanttPrompt(project: ProjectFormData, agenda: object): { system: string; user: string } {
  return {
    system: PMBOK_SYSTEM_CONTEXT,
    user: `
أنشئ بيانات مخطط جانت (Gantt Chart) للمشروع: ${project.name}
تاريخ البداية: ${project.start_date}

بناءً على الأجندة: ${JSON.stringify(agenda, null, 2)}

أنشئ JSON بالهيكل:
{
  "project_name": "${project.name}",
  "start_date": "${project.start_date}",
  "end_date": "${project.end_date}",
  "tasks": [
    {
      "id": "T001",
      "name": "اسم المهمة",
      "phase": "اسم المرحلة",
      "start_date": "YYYY-MM-DD",
      "end_date": "YYYY-MM-DD",
      "duration_days": 5,
      "progress": 0,
      "dependencies": [],
      "responsible": "المسؤول",
      "is_milestone": false,
      "is_critical": false
    }
  ],
  "milestones": [
    {
      "id": "M001",
      "name": "اسم المعلم",
      "date": "YYYY-MM-DD",
      "description": "وصف"
    }
  ],
  "critical_path": ["T001", "T003"]
}

تأكد أن المهام متسلسلة منطقياً ضمن التواريخ المحددة للمشروع.
`.trim(),
  };
}

// ============================
// 7. توليد تقرير الحالة (Status Report)
// ============================
export function buildStatusReportPrompt(project: ProjectFormData, agenda: object): { system: string; user: string } {
  return {
    system: PMBOK_SYSTEM_CONTEXT,
    user: `
أنشئ قالب تقرير حالة أسبوعي وفق معايير PMI للمشروع: ${project.name}

أنشئ JSON بالهيكل:
{
  "report_template": {
    "header": {
      "project_name": "${project.name}",
      "report_period": "من YYYY-MM-DD إلى YYYY-MM-DD",
      "reporting_date": "${new Date().toISOString().split("T")[0]}",
      "prepared_by": "مدير المشروع",
      "version": "1.0"
    },
    "executive_summary": "ملخص تنفيذي...",
    "overall_status": {
      "status": "أخضر | أصفر | أحمر",
      "summary": "وصف الوضع العام"
    },
    "performance_indicators": {
      "schedule_variance": "SV = EV - PV",
      "cost_variance": "CV = EV - AC",
      "spi": "SPI = EV/PV",
      "cpi": "CPI = EV/AC"
    },
    "accomplishments": ["إنجاز 1 — [مثال]", "إنجاز 2"],
    "planned_next_period": ["مخطط 1", "مخطط 2"],
    "issues": [
      {
        "id": "I001",
        "description": "وصف المشكلة",
        "impact": "الأثر",
        "action_required": "الإجراء المطلوب",
        "owner": "المسؤول",
        "due_date": "YYYY-MM-DD",
        "status": "مفتوح | جارٍ | مغلق"
      }
    ],
    "risks_update": ["تحديث المخاطر"],
    "budget_status": {
      "planned": 0,
      "actual": 0,
      "variance": 0,
      "forecast": 0
    },
    "decisions_needed": ["قرار 1 — [مثال]"]
  }
}
`.trim(),
  };
}

// ============================
// 8. توليد خطة الجودة
// ============================
export function buildQualityPlanPrompt(project: ProjectFormData): { system: string; user: string } {
  return {
    system: PMBOK_SYSTEM_CONTEXT,
    user: `
أنشئ خطة إدارة الجودة الكاملة وفق معايير PMI/ISO 21500 للمشروع: ${project.name}

الوصف: ${project.description}
الأهداف: ${project.objectives?.join(" | ") ?? ""}

أنشئ JSON بالهيكل:
{
  "quality_policy": "سياسة الجودة للمشروع",
  "quality_objectives": ["هدف جودة 1", "هدف جودة 2"],
  "quality_standards": [
    {
      "standard": "اسم المعيار",
      "description": "وصف المعيار",
      "applicability": "مجال التطبيق"
    }
  ],
  "quality_metrics": [
    {
      "metric": "اسم المقياس",
      "measurement_method": "طريقة القياس",
      "target": "الهدف المستهدف",
      "frequency": "تكرار القياس"
    }
  ],
  "quality_assurance_activities": [
    {
      "activity": "نشاط ضمان الجودة",
      "responsible": "المسؤول",
      "timing": "التوقيت",
      "tools": ["أداة 1", "أداة 2"]
    }
  ],
  "quality_control_activities": [
    {
      "activity": "نشاط ضبط الجودة",
      "responsible": "المسؤول",
      "timing": "التوقيت",
      "acceptance_criteria": "معايير القبول"
    }
  ],
  "quality_checklists": [
    {
      "phase": "المرحلة",
      "checklist_items": ["بند مراجعة 1", "بند مراجعة 2"]
    }
  ],
  "roles_responsibilities": [
    {
      "role": "الدور",
      "responsibilities": ["مسؤولية 1", "مسؤولية 2"]
    }
  ],
  "improvement_process": "وصف عملية التحسين المستمر"
}
`.trim(),
  };
}
