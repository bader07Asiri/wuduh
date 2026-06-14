import { Sidebar } from "@/components/layout/Sidebar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-50 flex" dir="rtl">
      <Sidebar />
      {/* Main content — offset for sidebar */}
      <main className="flex-1 lg:mr-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
