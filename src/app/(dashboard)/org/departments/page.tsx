"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { Plus, Trash2, Users, FolderOpen, Building2 } from "lucide-react";
import type { OrgDepartment } from "@/types";
import { cn } from "@/lib/utils";

const DEPT_COLORS = [
  "#1B4FD8","#D4A017","#10B981","#EF4444",
  "#8B5CF6","#F59E0B","#06B6D4","#EC4899",
];

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<OrgDepartment[]>([]);
  const [loading, setLoading]   = useState(true);
  const [myRole, setMyRole]     = useState<string>("member");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [form, setForm]         = useState({ name: "", description: "", color: "#1B4FD8" });

  useEffect(() => { fetchDepts(); }, []);

  async function fetchDepts() {
    try {
      const res  = await fetch("/api/org/departments");
      const data = await res.json();
      setDepartments(data.departments ?? []);
      setMyRole(data.role ?? "member");
    } catch { toast.error("تعذّر تحميل الأقسام"); }
    finally  { setLoading(false); }
  }

  async function createDept() {
    if (!form.name.trim()) { toast.error("اسم القسم مطلوب"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/org/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDepartments(d => [...d, { ...data.department, member_count: 0, project_count: 0 }]);
      setForm({ name: "", description: "", color: "#1B4FD8" });
      setShowForm(false);
      toast.success("تم إنشاء القسم!");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "خطأ");
    } finally { setSaving(false); }
  }

  async function deleteDept(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا القسم؟")) return;
    await fetch("/api/org/departments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deptId: id }),
    });
    setDepartments(d => d.filter(x => x.id !== id));
    toast.success("تم حذف القسم");
  }

  const isAdmin = ["owner", "admin"].includes(myRole);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Spinner size="lg" />
    </div>
  );

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-brand-blue/10 flex items-center justify-center">
            <Building2 size={22} className="text-brand-blue" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 font-arabic">الأقسام</h1>
            <p className="text-slate-400 text-sm font-arabic">{departments.length} قسم</p>
          </div>
        </div>
        {isAdmin && (
          <Button icon={<Plus size={18} />} onClick={() => setShowForm(s => !s)}>
            قسم جديد
          </Button>
        )}
      </div>

      {/* Create Form */}
      {showForm && isAdmin && (
        <Card className="mb-6 border-2 border-brand-blue/20 bg-blue-50/30">
          <h3 className="font-bold text-slate-900 font-arabic mb-4">إضافة قسم جديد</h3>
          <div className="space-y-4">
            <Input
              label="اسم القسم *"
              placeholder="مثال: قسم مشاريع البنية التحتية"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
            <Input
              label="الوصف (اختياري)"
              placeholder="وصف مختصر لمهام القسم"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
            {/* Color Picker */}
            <div>
              <label className="block text-sm font-medium text-slate-700 font-arabic mb-2">لون القسم</label>
              <div className="flex gap-2 flex-wrap">
                {DEPT_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setForm(f => ({ ...f, color: c }))}
                    className={cn(
                      "w-8 h-8 rounded-lg border-2 transition-all",
                      form.color === c ? "border-slate-900 scale-110" : "border-transparent"
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="ghost" onClick={() => setShowForm(false)}>إلغاء</Button>
              <Button loading={saving} onClick={createDept}>إنشاء القسم</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {departments.length === 0 && (
        <Card className="text-center py-16">
          <Building2 size={40} className="text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 font-arabic mb-1">لا توجد أقسام بعد</h3>
          <p className="text-slate-400 text-sm font-arabic">ابدأ بإنشاء أول قسم في مؤسستك</p>
        </Card>
      )}

      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {departments.map(dept => (
          <Card key={dept.id} padding="none" className="overflow-hidden">
            {/* Color bar */}
            <div className="h-1.5 w-full" style={{ backgroundColor: dept.color }} />
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg font-arabic"
                    style={{ backgroundColor: dept.color }}
                  >
                    {dept.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 font-arabic">{dept.name}</h3>
                    {dept.description && (
                      <p className="text-xs text-slate-400 font-arabic mt-0.5">{dept.description}</p>
                    )}
                  </div>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => deleteDept(dept.id)}
                    className="text-slate-300 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="flex gap-3 mt-4">
                <div className="flex items-center gap-1.5 text-sm text-slate-500 font-arabic">
                  <Users size={14} className="text-slate-400" />
                  <span>{dept.member_count ?? 0} عضو</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-500 font-arabic">
                  <FolderOpen size={14} className="text-slate-400" />
                  <span>{dept.project_count ?? 0} مشروع</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
