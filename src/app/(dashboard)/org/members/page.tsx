"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { UserPlus, Trash2, Shield, User, Users } from "lucide-react";
import type { OrgMember, OrgDepartment } from "@/types";

const ROLE_LABELS: Record<string, string> = {
  owner: "مالك",
  admin: "مدير",
  member: "عضو",
};

const ROLE_VARIANT: Record<string, "gold" | "success" | "info"> = {
  owner: "gold",
  admin: "success",
  member: "info",
};

const STATUS_LABELS: Record<string, string> = {
  active: "نشط",
  invited: "دعوة مُرسلة",
  suspended: "موقوف",
};

export default function MembersPage() {
  const [members, setMembers]       = useState<OrgMember[]>([]);
  const [departments, setDepts]     = useState<OrgDepartment[]>([]);
  const [loading, setLoading]       = useState(true);
  const [myRole, setMyRole]         = useState<string>("member");
  const [showForm, setShowForm]     = useState(false);
  const [saving, setSaving]         = useState(false);
  const [form, setForm]             = useState({ email: "", full_name: "", dept_id: "", role: "member" });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const [mRes, dRes] = await Promise.all([
        fetch("/api/org/members"),
        fetch("/api/org/departments"),
      ]);
      const [mData, dData] = await Promise.all([mRes.json(), dRes.json()]);
      setMembers(mData.members ?? []);
      setMyRole(mData.myRole ?? "member");
      setDepts(dData.departments ?? []);
    } catch { toast.error("تعذّر تحميل الأعضاء"); }
    finally  { setLoading(false); }
  }

  async function addMember() {
    if (!form.email.trim()) { toast.error("البريد الإلكتروني مطلوب"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/org/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMembers(m => [...m, data.member]);
      setForm({ email: "", full_name: "", dept_id: "", role: "member" });
      setShowForm(false);
      toast.success(data.alreadyRegistered ? "تم إضافة العضو!" : "تم إرسال الدعوة!");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "خطأ");
    } finally { setSaving(false); }
  }

  async function removeMember(id: string) {
    if (!confirm("هل تريد إزالة هذا العضو؟")) return;
    await fetch("/api/org/members", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId: id }),
    });
    setMembers(m => m.filter(x => x.id !== id));
    toast.success("تم إزالة العضو");
  }

  async function changeRole(memberId: string, role: string) {
    await fetch("/api/org/members", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId, role }),
    });
    setMembers(m => m.map(x => x.id === memberId ? { ...x, role: role as OrgMember["role"] } : x));
    toast.success("تم تحديث الدور");
  }

  async function changeDept(memberId: string, dept_id: string) {
    await fetch("/api/org/members", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId, dept_id: dept_id || null }),
    });
    const dept = departments.find(d => d.id === dept_id);
    setMembers(m => m.map(x => x.id === memberId ? { ...x, dept_id, department: dept } : x));
    toast.success("تم تحديث القسم");
  }

  const isAdmin = ["owner", "admin"].includes(myRole);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Spinner size="lg" />
    </div>
  );

  const deptOptions = [
    { value: "", label: "بدون قسم" },
    ...departments.map(d => ({ value: d.id, label: d.name })),
  ];

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-brand-blue/10 flex items-center justify-center">
            <Users size={22} className="text-brand-blue" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 font-arabic">الأعضاء</h1>
            <p className="text-slate-400 text-sm font-arabic">{members.length} عضو</p>
          </div>
        </div>
        {isAdmin && (
          <Button icon={<UserPlus size={18} />} onClick={() => setShowForm(s => !s)}>
            إضافة عضو
          </Button>
        )}
      </div>

      {/* Add Form */}
      {showForm && isAdmin && (
        <Card className="mb-6 border-2 border-brand-blue/20 bg-blue-50/30">
          <h3 className="font-bold text-slate-900 font-arabic mb-4 flex items-center gap-2">
            <UserPlus size={18} className="text-brand-blue" />
            إضافة عضو جديد
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label="البريد الإلكتروني *"
              placeholder="name@company.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
            <Input
              label="الاسم الكامل"
              placeholder="محمد العتيبي"
              value={form.full_name}
              onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
            />
            <Select
              label="القسم"
              value={form.dept_id}
              onChange={e => setForm(f => ({ ...f, dept_id: e.target.value }))}
              options={deptOptions}
            />
            <Select
              label="الدور"
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              options={[
                { value: "member", label: "عضو" },
                { value: "admin",  label: "مدير" },
              ]}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setShowForm(false)}>إلغاء</Button>
            <Button loading={saving} onClick={addMember} icon={<UserPlus size={16} />}>
              إضافة / دعوة
            </Button>
          </div>
          <p className="text-xs text-slate-400 font-arabic mt-3">
            إذا كان العضو مسجلاً في وضوح سيُضاف فوراً، وإلا ستُرسل له دعوة.
          </p>
        </Card>
      )}

      {/* Members Table */}
      <Card padding="none">
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
          <div className="grid grid-cols-12 text-xs font-bold text-slate-400 font-arabic uppercase">
            <span className="col-span-4">العضو</span>
            <span className="col-span-3">القسم</span>
            <span className="col-span-2">الدور</span>
            <span className="col-span-2">الحالة</span>
            <span className="col-span-1"></span>
          </div>
        </div>

        {members.length === 0 ? (
          <div className="text-center py-12">
            <Users size={36} className="text-slate-200 mx-auto mb-2" />
            <p className="text-slate-400 font-arabic text-sm">لا يوجد أعضاء بعد</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {members.map(member => (
              <div key={member.id} className="grid grid-cols-12 items-center px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
                {/* Avatar + Name */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-blue to-brand-cyan flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {(member.full_name || member.email)?.[0]?.toUpperCase() ?? "م"}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-slate-900 font-arabic text-sm truncate">
                      {member.full_name || "—"}
                    </div>
                    <div className="text-xs text-slate-400 font-latin truncate">{member.email}</div>
                  </div>
                </div>

                {/* Department */}
                <div className="col-span-3">
                  {isAdmin ? (
                    <select
                      value={member.dept_id ?? ""}
                      onChange={e => changeDept(member.id, e.target.value)}
                      className="text-sm font-arabic text-slate-700 bg-transparent border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-brand-blue"
                    >
                      {deptOptions.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-sm font-arabic text-slate-600">
                      {member.department?.name ?? "—"}
                    </span>
                  )}
                </div>

                {/* Role */}
                <div className="col-span-2">
                  {isAdmin && member.role !== "owner" ? (
                    <select
                      value={member.role}
                      onChange={e => changeRole(member.id, e.target.value)}
                      className="text-xs font-arabic bg-transparent border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-brand-blue"
                    >
                      <option value="member">عضو</option>
                      <option value="admin">مدير</option>
                    </select>
                  ) : (
                    <Badge variant={ROLE_VARIANT[member.role] ?? "info"} className="text-xs">
                      {member.role === "owner" ? <Shield size={11} className="inline mr-1" /> : null}
                      {ROLE_LABELS[member.role]}
                    </Badge>
                  )}
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <span className={`text-xs font-arabic px-2 py-0.5 rounded-full ${
                    member.status === "active" ? "bg-emerald-50 text-emerald-600" :
                    member.status === "invited" ? "bg-brand-cyan/10 text-amber-600" :
                    "bg-red-50 text-red-500"
                  }`}>
                    {STATUS_LABELS[member.status]}
                  </span>
                </div>

                {/* Delete */}
                <div className="col-span-1 flex justify-end">
                  {isAdmin && member.role !== "owner" && (
                    <button
                      onClick={() => removeMember(member.id)}
                      className="text-slate-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
