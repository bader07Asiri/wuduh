import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GATE_ENABLED, GATE_PASSWORD, GATE_COOKIE } from "@/lib/gate";

// المسارات المحمية — تحتاج تسجيل دخول
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/projects(.*)",
  "/settings(.*)",
  "/onboarding(.*)",
  "/admin(.*)",
  "/org(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // ===== جدار الدخول المؤقّت (ما قبل الإطلاق) =====
  if (GATE_ENABLED) {
    const gateOpen = req.cookies.get(GATE_COOKIE)?.value === GATE_PASSWORD;
    const isGatePath = pathname === "/gate" || pathname.startsWith("/api/gate");
    // مسارات يجب أن تبقى مفتوحة دائماً (أصول، فحوصات، webhooks الدفع)
    const isBypass =
      pathname.startsWith("/_next") ||
      pathname.startsWith("/wuduh-assets") ||
      pathname.startsWith("/fonts") ||
      pathname.startsWith("/templates") ||
      pathname === "/favicon.ico" ||
      pathname.startsWith("/api/stripe") ||
      pathname.startsWith("/api/webhooks");

    if (!gateOpen && !isGatePath && !isBypass) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "الموقع مغلق مؤقتاً" }, { status: 401 });
      }
      const url = req.nextUrl.clone();
      url.pathname = "/gate";
      url.search = "";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  const { userId } = await auth();

  if (userId && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isProtectedRoute(req) && !userId) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
