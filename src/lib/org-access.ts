// ============================
// وضوح | Wuduh — طبقة صلاحيات المؤسسة و«المستوى الفعّال»
// مصدر واحد للحقيقة: من يرى ماذا، ومن يقدر يولّد، وأي باقة تسري فعلاً.
// ============================
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createAdminClient } from "@/lib/supabase/server";

export type ProjectRecord = Record<string, any>;

export type OrgRole = "owner" | "admin" | "dept_manager" | "member";
export type Plan = "free" | "starter" | "professional" | "enterprise";

export interface Membership {
  org_id: string;
  role: OrgRole;
  dept_id: string | null;
  can_generate: boolean;
  status: string;
}

export interface EffectivePlan {
  plan: Plan;
  canGenerate: boolean;           // هل يُسمح له بتوليد المستندات (المشرف الرقابي = false)
  source: "org" | "personal";
  role?: OrgRole;
}

// عضوية المؤسسة النشطة للمستخدم (أو null لحساب فردي)
export async function getMembership(userId: string): Promise<Membership | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("org_members")
    .select("org_id, role, dept_id, can_generate, status")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();
  if (!data) return null;
  return {
    org_id: data.org_id,
    role: (data.role ?? "member") as OrgRole,
    dept_id: data.dept_id ?? null,
    can_generate: data.can_generate !== false,
    status: data.status,
  };
}

// المستوى الفعّال: عضو المؤسسة يرث مستوى الباقة حسب دوره/نوعه؛ وإلا باقته الشخصية
export async function getEffectivePlan(userId: string, membership?: Membership | null): Promise<EffectivePlan> {
  const m = membership !== undefined ? membership : await getMembership(userId);
  if (m) {
    if (m.role === "owner" || m.role === "admin") {
      return { plan: "enterprise", canGenerate: true, source: "org", role: m.role };
    }
    // مدير قسم / عضو: مستوى احترافي؛ التوليد حسب نوعه (منتِج/مشرف)
    return { plan: "professional", canGenerate: m.can_generate, source: "org", role: m.role };
  }
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("user_profiles")
    .select("subscription_plan")
    .eq("clerk_id", userId)
    .maybeSingle();
  return { plan: (data?.subscription_plan ?? "free") as Plan, canGenerate: true, source: "personal" };
}

// معرّفات المشاريع المشتركة مع المستخدم (مباشرة أو عبر قسمه)
async function sharedProjectIds(userId: string, deptId: string | null): Promise<string[]> {
  const supabase = createAdminClient();
  const ors = [`target_user_id.eq.${userId}`];
  if (deptId) ors.push(`target_dept_id.eq.${deptId}`);
  const { data } = await supabase.from("project_shares").select("project_id").or(ors.join(","));
  return Array.from(new Set((data ?? []).map((r: { project_id: string }) => r.project_id)));
}

// كل المشاريع التي يحق للمستخدم رؤيتها (حسب دوره في المؤسسة)
export async function listAccessibleProjects(userId: string): Promise<ProjectRecord[]> {
  const supabase = createAdminClient();
  const m = await getMembership(userId);

  // حساب فردي: مشاريعه فقط
  if (!m) {
    const { data } = await supabase.from("projects").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    return data ?? [];
  }

  // المالك/المشرف: كل مشاريع المؤسسة
  if (m.role === "owner" || m.role === "admin") {
    const { data } = await supabase.from("projects").select("*").eq("org_id", m.org_id).order("created_at", { ascending: false });
    return data ?? [];
  }

  // مدير القسم: مشاريع قسمه + مشاريعه
  // العضو: مشاريعه + مشاريع قسمه (قراءة) + المشترَك معه
  const byId = new Map<string, ProjectRecord>();
  const add = (rows: ProjectRecord[] | null) => (rows ?? []).forEach(r => byId.set(r.id as string, r));

  const [{ data: own }, dept, shared] = await Promise.all([
    supabase.from("projects").select("*").eq("user_id", userId),
    m.dept_id
      ? supabase.from("projects").select("*").eq("org_id", m.org_id).eq("dept_id", m.dept_id)
      : Promise.resolve({ data: [] as ProjectRecord[] }),
    (async () => {
      const ids = await sharedProjectIds(userId, m.dept_id);
      if (ids.length === 0) return { data: [] as ProjectRecord[] };
      return supabase.from("projects").select("*").in("id", ids);
    })(),
  ]);
  add(own as ProjectRecord[]);
  add((dept as { data: ProjectRecord[] }).data);
  add((shared as { data: ProjectRecord[] }).data);

  return Array.from(byId.values()).sort((a, b) =>
    String(b.created_at ?? "").localeCompare(String(a.created_at ?? "")));
}

// جلب مشروع واحد إن كان المستخدم يملك صلاحية الوصول إليه (وإلا null)
export async function getAccessibleProject(userId: string, projectId: string): Promise<ProjectRecord | null> {
  const supabase = createAdminClient();
  const { data: project } = await supabase.from("projects").select("*").eq("id", projectId).maybeSingle();
  if (!project) return null;

  // مالكه المباشر
  if (project.user_id === userId) return project;

  const m = await getMembership(userId);
  if (!m || !project.org_id || project.org_id !== m.org_id) return null;

  if (m.role === "owner" || m.role === "admin") return project;
  if ((m.role === "dept_manager" || m.role === "member") && m.dept_id && project.dept_id === m.dept_id) return project;

  // مشاركة صريحة
  const shared = await sharedProjectIds(userId, m.dept_id);
  if (shared.includes(projectId)) return project;

  return null;
}
