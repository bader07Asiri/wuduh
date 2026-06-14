"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import {
  Users, FolderOpen, FileText, Building2,
  TrendingUp, Crown, Zap, Star, Shield
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalProjects: number;
  totalDeliverables: number;
  totalOrgs: number;
  planCounts: Record<string, number>;
  estimatedMRR: number;
  recentUsers: {
    full_name: string;
    email: string;
    subscription_plan: string;
    subscription_status: string;
    created_at: string;
  }[];
}

const PLAN_LABELS: Record<string, string> = {
  free: "مجاني",
  starter: "مبتدئ",
  professional: "احترافي",
  enterprise: "مؤسسي",
};

const PLAN_PRICES: Record<string, number> = {
  starter: 149,
  professional: 399,
  enterprise: 999,
};

const PLAN_ICONS: Record<string, typeof Users> = {
  free: Users,
  starter: Star,
  professional: Zap,
  enterprise: Crown,
};

const PLAN_COLORS: Record<string, string> = {
  free: "text-slate-500 bg-slate-100",
  starter: "text-blue-600 bg-blue-50",
  professional: "text-brand-blue bg-blue-50",
  enterprise: "text-brand-cyan bg-brand-cyan/10",
};

export default function AdminPage() {
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
    (stats.planCounts.professional ?? 0) +
    (stats.planCounts.enterprise ?? 0);

  return (
    <div className="p-6 lg:p-8 max-w-6xl" dir="rtl">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-navy-950 flex items-center justify-center">
            <Shield size={22} className="text-brand-cyan" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 font-arabic">لوحة تحكم الأدمن</h1>
            <p className="text-slate-400 text-sm font-arabic">إحصائيات وضوح — نظرة شاملة</p>
          </div>
        </div>
      </div>

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
        {/* MRR */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-navy-950 to-slate-800 text-white">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-brand-cyan" />
            <span className="font-bold font-arabic text-white/80 text-sm">الإيراد الشهري التقديري (MRR)</span>
          </div>
          <div className="text-4xl font-black mb-1">
            {stats.estimatedMRR.toLocaleString("ar")} <span className="text-xl text-white/60">ر.س</span>
          </div>
          <div className="text-white/40 text-xs font-arabic mb-6">بناءً على الاشتراكات النشطة</div>

          {/* Breakdown */}
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

        {/* Orgs */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Building2 size={18} className="text-brand-blue" />
            <span className="font-bold font-arabic text-slate-700 text-sm">المؤسسات</span>
          </div>
          <div className="text-4xl font-black text-slate-900 mb-1">
            {stats.totalOrgs.toLocaleString("ar")}
          </div>
          <div className="text-slate-400 text-xs font-arabic">مؤسسة مسجّلة</div>
        </Card>
      </div>

      {/* Plan Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="font-bold text-slate-900 font-arabic mb-4 flex items-center gap-2">
            <Users size={16} className="text-brand-blue" />
            توزيع الخطط
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
                      <div
                        className="h-full bg-brand-blue rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 w-8 text-left">{pct}%</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Signups */}
        <Card>
          <h3 className="font-bold text-slate-900 font-arabic mb-4 flex items-center gap-2">
            <Users size={16} className="text-brand-blue" />
            آخر المسجّلين
          </h3>
          <div className="space-y-3">
            {stats.recentUsers.length === 0 ? (
              <p className="text-slate-400 text-sm font-arabic text-center py-4">لا يوجد مستخدمون بعد</p>
            ) : (
              stats.recentUsers.map((u, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-blue to-brand-cyan flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {(u.full_name || u.email)?.[0]?.toUpperCase() ?? "م"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-arabic text-slate-800 font-medium truncate">
                      {u.full_name || "—"}
                    </div>
                    <div className="text-xs text-slate-400 font-latin truncate">{u.email}</div>
                  </div>
                  <Badge
                    variant={
                      u.subscription_plan === "enterprise" ? "gold" :
                      u.subscription_plan === "professional" ? "success" :
                      u.subscription_plan === "starter" ? "info" : "default"
                    }
                    className="text-xs flex-shrink-0"
                  >
                    {PLAN_LABELS[u.subscription_plan] ?? u.subscription_plan}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

    </div>
  );
}
