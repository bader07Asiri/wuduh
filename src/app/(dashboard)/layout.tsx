import { Sidebar } from "@/components/layout/Sidebar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  return (
    <div className="min-h-screen flex relative overflow-hidden" dir="rtl">
      {/* decorative focus-rings watermark (brand signature) */}
      <div aria-hidden className="pointer-events-none fixed -top-48 left-[8%] -z-10 opacity-70">
        <svg width="560" height="560" viewBox="0 0 560 560" fill="none">
          <circle cx="280" cy="280" r="86" stroke="#CFDDF1" strokeWidth="1" />
          <circle cx="280" cy="280" r="150" stroke="#D9E4F4" strokeWidth="1" />
          <circle cx="280" cy="280" r="214" stroke="#E4EDF8" strokeWidth="1" />
          <circle cx="280" cy="280" r="278" stroke="#EDF2FB" strokeWidth="1" />
          <circle cx="280" cy="280" r="5" fill="#00B4D8" opacity="0.5" />
        </svg>
      </div>
      <Sidebar />
      {/* Main content — offset for sidebar */}
      <main className="flex-1 lg:mr-64 min-h-screen relative">
        {children}
      </main>
    </div>
  );
}
