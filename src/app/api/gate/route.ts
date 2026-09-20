import { NextRequest, NextResponse } from "next/server";
import { GATE_PASSWORD, GATE_COOKIE } from "@/lib/gate";

export async function POST(req: NextRequest) {
  let password = "";
  try {
    const body = await req.json();
    password = String(body?.password ?? "");
  } catch {
    /* ignore */
  }

  if (password !== GATE_PASSWORD) {
    return NextResponse.json({ error: "رقم سري غير صحيح" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(GATE_COOKIE, GATE_PASSWORD, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 يوماً
  });
  return res;
}
