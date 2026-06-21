"use client";
import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Users, FolderOpen, FileText, Building2,
  TrendingUp, Crown, Zap, Star, Shield,
  Search, Palette, RotateCcw, Save, ChevronDown, Upload, ImageIcon
} from "lucide-react";
import { toast } from "sonner";

// =================== Types ===================
interface AdminStats {
  totalUsers: number;
  totalProjects: number;
  totalDeliverables: number;
  totalOrgs: number;
  planCounts: Record<string, number>;
  estimatedMRR: number;
  recentUsers: UserRow[];
}

interface UserRow {
  id: string;
  clerk_id: string;
  email: string;
  full_name: string;
  subscription_plan: string;
  subscription_status: string;
  is_admin: boolean;
  created_at: string;
  onboarding_completed: boolean;
}

interface SiteSettings {
  color_primary: string;
  color_secondary: string;
  color_accent: string;
  color_bg: string;
  font_arabic: string;
  font_latin: string;
  logo_url: string;
  site_name_ar: string;
  site_name_en: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  color_primary:   "#2563EB",
  color_secondary: "#0F172A",
  color_accent:    "#00D4FF",
  color_bg:        "#F8FAFC",
  font_arabic:     "Tajawal",
  font_latin:      "Montserrat",
  logo_url:        "",
  site_name_ar:    "وضوح",
  site_name_en:    "Wuduh",
};

const PLAN_LABELS: Record<string, string> = {
  free: "مجاني", starter: "مبتدئ", professional: "احترافي", enterprise: "مؤسسي",
};
const STATUS_LABELS: Record<string, string> = {
  active: "نشط", cancelled: "ملغي", past_due: "متأخر", trialing: "تجريبي",
};
const PLAN_PRICES: Record<string, number> = { starter: 149, professional: 399, enterprise: 999 };
const PLAN_ICONS: Record<string, typeof Users> = {
  free: Users, starter: Star, professional: Zap, enterprise: Crown,
};
const PLAN_COLORS: Record<string, string> = {
  free:         "text-slate-500 bg-slate-100",
  starter:      "text-blue-600 bg-blue-50",
  professional: "text-brand-blue bg-blue-50",
  enterprise:   "text-brand-cyan bg-brand-cyan/10",
};
const STATUS_COLORS: Record<string, string> = {
  active:   "success",
  trialing: "info",
  past_due: "warning",
  cancelled: "default",
};

// =================== Main Page ===================
export default function AdminPage() {
  const [tab, setTab] = useState<"stats" | "users" | "theme">("stats");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(r => {
        if (r.status === 403) throw new Error("غير مصرح");
        return r.json();
      })
      .then(setStats)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner size="lg" />
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Shield size={40} className="text-red-300 mx-auto mb-3" />
        <p className="text-slate-500 font-arabic">{error}</p>
      </div>
    </div>
  );

  if (!stats) return null;

  const totalPaid = (stats.planCounts.starter ?? 0) +
    (stats.planCounts.professional ?? 0) + (stats.planCounts.enterprise ?? 0);

  const tabs = [
    { key: "stats", label: "الإحصائيات", icon: TrendingUp },
    { key: "users", label: "إدارة المستخدمين", icon: Users },
    { key: "theme", label: "التصميم والثيم", icon: Palette },
  ] as const;

  return (
    <div className="p-6 lg:p-8 max-w-6xl" dir="rtl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-navy-950 flex items-center justify-center">
            <Shield size={22} className="text-brand-cyan" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 font-arabic">لوحة تحكم الأدمن</h1>
            <p className="text-slate-400 text-sm font-arabic">إدارة شاملة لمنصة وضوح</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-slate-100 p-1 rounded-2xl w-fit">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-arabic font-semibold transition-all ${
              tab === key
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {tab === "stats" && <StatsTab stats={stats} totalPaid={totalPaid} />}
      {tab === "users" && <UsersTab />}
      {tab === "theme" && <ThemeTab />}
    </div>
  );
}

// =================== Stats Tab ===================
function StatsTab({ stats, totalPaid }: { stats: AdminStats; totalPaid: number }) {
  return (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "إجمالي المستخدمين", value: stats.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "المشتركون المدفوعون", value: totalPaid, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "إجمالي المشاريع", value: stats.totalProjects, icon: FolderOpen, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "المخرجات المولّدة", value: stats.totalDeliverables, icon: FileText, color: "text-brand-blue", bg: "bg-blue-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={22} className={color} />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{value.toLocaleString("ar")}</div>
              <div className="text-xs text-slate-400 font-arabic">{label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* MRR + Orgs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <Card className="lg:col-span-2 bg-gradient-to-br from-navy-950 to-slate-800 text-white">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-brand-cyan" />
            <span className="font-bold font-arabic text-white/80 text-sm">الإيراد الشهري التقديري (MRR)</span>
          </div>
          <div className="text-4xl font-black mb-1">
            {stats.estimatedMRR.toLocaleString("ar")} <span className="text-xl text-white/60">ر.س</span>
          </div>
          <div className="text-white/40 text-xs font-arabic mb-6">بناءً على الاشتراكات النشطة</div>
          <div className="grid grid-cols-3 gap-3">
            {["starter", "professional", "enterprise"].map(plan => {
              const count = stats.planCounts[plan] ?? 0;
              const revenue = count * PLAN_PRICES[plan];
              return (
                <div key={plan} className="bg-white/10 rounded-xl p-3">
                  <div className="text-white/60 text-xs font-arabic mb-1">{PLAN_LABELS[plan]}</div>
                  <div className="text-white font-black text-lg">{count}</div>
                  <div className="text-brand-cyan text-xs">{revenue.toLocaleString("ar")} ر.س</div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Building2 size={18} className="text-brand-blue" />
            <span className="font-bold font-arabic text-slate-700 text-sm">المؤسسات</span>
          </div>
          <div className="text-4xl font-black text-slate-900 mb-1">{stats.totalOrgs.toLocaleString("ar")}</div>
          <div className="text-slate-400 text-xs font-arabic">مؤسسة مسجّلة</div>
        </Card>
      </div>

      {/* Plan Distribution + Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-bold text-slate-900 font-arabic mb-4 flex items-center gap-2">
            <Users size={16} className="text-brand-blue" /> توزيع الخطط
          </h3>
          <div className="space-y-3">
            {["enterprise", "professional", "starter", "free"].map(plan => {
              const count = stats.planCounts[plan] ?? 0;
              const pct = stats.totalUsers > 0 ? Math.round((count / stats.totalUsers) * 100) : 0;
              const Icon = PLAN_ICONS[plan] ?? Users;
              return (
                <div key={plan} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${PLAN_COLORS[plan]}`}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-arabic text-slate-700">{PLAN_LABELS[plan]}</span>
                      <span className="text-sm font-bold text-slate-900">{count}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-blue rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 w-8 text-left">{pct}%</span>
                </div>
              );
            })}
          </div>
        </Card>
        <Card>
          <h3 className="font-bold text-slate-900 font-arabic mb-4 flex items-center gap-2">
            <Users size={16} className="text-brand-blue" /> آخر المسجّلين
          </h3>
          <div className="space-y-3">
            {stats.recentUsers.length === 0 ? (
              <p className="text-slate-400 text-sm font-arabic text-center py-4">لا يوجد مستخدمون بعد</p>
            ) : stats.recentUsers.map((u, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-blue to-brand-cyan flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {(u.full_name || u.email)?.[0]?.toUpperCase() ?? "م"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-arabic text-slate-800 font-medium truncate">{u.full_name || "—"}</div>
                  <div className="text-xs text-slate-400 font-latin truncate">{u.email}</div>
                </div>
                <Badge variant={STATUS_COLORS[u.subscription_plan] as "success" | "info" | "warning" | "default" ?? "default"} className="text-xs flex-shrink-0">
                  {PLAN_LABELS[u.subscription_plan] ?? u.subscription_plan}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

// =================== Users Tab ===================
function UsersTab() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [saving, setSaving] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<UserRow | null>(null);

  const fetchUsers = useCallback(async (q: string, p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?search=${encodeURIComponent(q)}&page=${p}&limit=15`);
      const data = await res.json();
      setUsers(data.users ?? []);
      setTotal(data.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(search, page);
  }, [fetchUsers, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers(search, 1);
  };

  const updateUser = async (clerk_id: string, updates: Partial<Pick<UserRow, "subscription_plan" | "subscription_status" | "is_admin">>) => {
    setSaving(clerk_id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerk_id, ...updates }),
      });
      if (!res.ok) throw new Error();
      const { user } = await res.json();
      setUsers(prev => prev.map(u => u.clerk_id === clerk_id ? { ...u, ...user } : u));
      setEditUser(prev => prev?.clerk_id === clerk_id ? { ...prev, ...user } : prev);
      toast.success("تم التحديث");
    } catch {
      toast.error("حدث خطأ");
    } finally {
      setSaving(null);
    }
  };

  const totalPages = Math.ceil(total / 15);

  return (
    <div className="space-y-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="ابحث بالإيميل أو الاسم..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" icon={<Search size={16} />} loading={loading}>بحث</Button>
      </form>

      {/* Total */}
      <div className="text-sm text-slate-400 font-arabic">{total.toLocaleString("ar")} مستخدم</div>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-arabic">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-right p-4 font-semibold text-slate-600">المستخدم</th>
                <th className="text-right p-4 font-semibold text-slate-600">الخطة</th>
                <th className="text-right p-4 font-semibold text-slate-600">الحالة</th>
                <th className="text-right p-4 font-semibold text-slate-600">أدمن</th>
                <th className="text-right p-4 font-semibold text-slate-600">تاريخ التسجيل</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="text-center py-8"><Spinner /></td></tr>
              )}
              {!loading && users.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-slate-400">لا توجد نتائج</td></tr>
              )}
              {!loading && users.map(user => (
                <tr key={user.clerk_id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-blue to-brand-cyan flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {(user.full_name || user.email)?.[0]?.toUpperCase() ?? "م"}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">{user.full_name || "—"}</div>
                        <div className="text-xs text-slate-400 font-latin">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <select
                      value={user.subscription_plan}
                      onChange={e => updateUser(user.clerk_id, { subscription_plan: e.target.value })}
                      disabled={saving === user.clerk_id}
                      className="text-sm border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-brand-blue"
                    >
                      {["free", "starter", "professional", "enterprise"].map(p => (
                        <option key={p} value={p}>{PLAN_LABELS[p]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">
                    <select
                      value={user.subscription_status}
                      onChange={e => updateUser(user.clerk_id, { subscription_status: e.target.value })}
                      disabled={saving === user.clerk_id}
                      className="text-sm border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-brand-blue"
                    >
                      {["active", "trialing", "past_due", "cancelled"].map(s => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={user.is_admin ?? false}
                        onChange={e => updateUser(user.clerk_id, { is_admin: e.target.checked })}
                        disabled={saving === user.clerk_id}
                        className="w-4 h-4 accent-brand-blue"
                      />
                      <span className="text-xs text-slate-500">{user.is_admin ? "نعم" : "لا"}</span>
                    </label>
                  </td>
                  <td className="p-4 text-slate-400 text-xs">
                    {new Date(user.created_at).toLocaleDateString("ar-SA")}
                  </td>
                  <td className="p-4">
                    {saving === user.clerk_id && <Spinner size="sm" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>السابق</Button>
          <span className="text-sm text-slate-500 font-arabic">{page} / {totalPages}</span>
          <Button variant="ghost" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>التالي</Button>
        </div>
      )}
    </div>
  );
}

// =================== Theme Tab ===================
function ThemeTab() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(r => r.json())
      .then(data => setSettings({ ...DEFAULT_SETTINGS, ...data }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (key: keyof SiteSettings, value: string) =>
    setSettings(prev => ({ ...prev, [key]: value }));

  const uploadLogo = async (file: File) => {
    setUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "فشل الرفع");
      set("logo_url", data.url);
      toast.success("تم رفع الشعار بنجاح");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "فشل رفع الشعار");
    } finally {
      setUploadingLogo(false);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error();
      toast.success("تم حفظ الإعدادات");
    } catch {
      toast.error("حدث خطأ في الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const reset = () => setSettings(DEFAULT_SETTINGS);

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>;

  return (
    <div className="space-y-6">
      {/* Preview */}
      <Card className="overflow-hidden p-0">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
          <Palette size={15} className="text-slate-400" />
          <span className="text-sm font-arabic font-semibold text-slate-600">معاينة الثيم</span>
        </div>
        <div className="p-6 flex items-center gap-6" style={{ backgroundColor: settings.color_bg }}>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-black"
            style={{ background: `linear-gradient(135deg, ${settings.color_primary}, ${settings.color_accent})` }}
          >
            {settings.site_name_en?.[0] ?? "W"}
          </div>
          <div>
            <div
              className="text-xl font-black"
              style={{ color: settings.color_secondary, fontFamily: settings.font_arabic }}
            >
              {settings.site_name_ar}
            </div>
            <div className="text-sm" style={{ color: settings.color_primary, fontFamily: settings.font_latin }}>
              {settings.site_name_en}
            </div>
          </div>
          <div className="flex gap-2 mr-auto">
            <div className="w-8 h-8 rounded-full border-2" style={{ backgroundColor: settings.color_primary, borderColor: settings.color_primary }}></div>
            <div className="w-8 h-8 rounded-full border-2" style={{ backgroundColor: settings.color_secondary, borderColor: settings.color_secondary }}></div>
            <div className="w-8 h-8 rounded-full border-2" style={{ backgroundColor: settings.color_accent, borderColor: settings.color_accent }}></div>
            <div className="w-8 h-8 rounded-full border-2" style={{ backgroundColor: settings.color_bg, borderColor: "#e2e8f0" }}></div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colors */}
        <Card>
          <h3 className="font-bold text-slate-900 font-arabic mb-4 flex items-center gap-2">
            <Palette size={16} className="text-brand-blue" /> الألوان
          </h3>
          <div className="space-y-4">
            {[
              { key: "color_primary",   label: "اللون الرئيسي" },
              { key: "color_secondary", label: "اللون الثانوي" },
              { key: "color_accent",    label: "لون التمييز" },
              { key: "color_bg",        label: "لون الخلفية" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings[key as keyof SiteSettings]}
                  onChange={e => set(key as keyof SiteSettings, e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5"
                />
                <div className="flex-1">
                  <div className="text-sm font-arabic text-slate-700 font-medium">{label}</div>
                  <div className="text-xs text-slate-400 font-latin">{settings[key as keyof SiteSettings]}</div>
                </div>
                <Input
                  value={settings[key as keyof SiteSettings]}
                  onChange={e => set(key as keyof SiteSettings, e.target.value)}
                  className="w-28 text-xs font-latin"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Branding */}
        <Card>
          <h3 className="font-bold text-slate-900 font-arabic mb-4 flex items-center gap-2">
            <Shield size={16} className="text-brand-blue" /> الهوية والخطوط
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-arabic font-semibold text-slate-700 block mb-1">اسم الموقع (عربي)</label>
              <Input value={settings.site_name_ar} onChange={e => set("site_name_ar", e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-arabic font-semibold text-slate-700 block mb-1">اسم الموقع (إنجليزي)</label>
              <Input value={settings.site_name_en} onChange={e => set("site_name_en", e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-arabic font-semibold text-slate-700 block mb-1">شعار الموقع</label>
              <div className="flex flex-col gap-2">
                {settings.logo_url && (
                  <div className="flex items-center gap-2 p-2 border border-slate-200 rounded-xl bg-slate-50">
                    <img src={settings.logo_url} alt="Logo" className="h-10 w-auto object-contain" />
                    <span className="text-xs text-slate-500 truncate flex-1">{settings.logo_url}</span>
                  </div>
                )}
                <label className={`flex items-center gap-2 cursor-pointer border-2 border-dashed rounded-xl px-4 py-3 transition-colors ${uploadingLogo ? "border-brand-blue bg-blue-50" : "border-slate-300 hover:border-brand-blue hover:bg-blue-50"}`}>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                    className="hidden"
                    disabled={uploadingLogo}
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) uploadLogo(file);
                      e.target.value = "";
                    }}
                  />
                  {uploadingLogo ? (
                    <span className="text-sm font-arabic tex