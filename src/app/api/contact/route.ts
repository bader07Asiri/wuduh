import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// SQL to create the table (run once in Supabase):
// CREATE TABLE IF NOT EXISTS contact_submissions (
//   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//   full_name text NOT NULL,
//   email text NOT NULL,
//   company text,
//   subject text NOT NULL,
//   message text NOT NULL,
//   status text DEFAULT 'new',
//   created_at timestamptz DEFAULT now()
// );

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { full_name, email, company, subject, message } = body;

    if (!full_name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "جميع الحقول الإلزامية مطلوبة" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "البريد الإلكتروني غير صحيح" }, { status: 400 });
    }

    // Validate message length
    if (message.trim().length < 20) {
      return NextResponse.json({ error: "الرسالة قصيرة جداً — الحد الأدنى 20 حرفاً" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { error } = await supabase.from("contact_submissions").insert({
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      company: company?.trim() || null,
      subject: subject.trim(),
      message: message.trim(),
      status: "new",
    });

    if (error) {
      console.error("Contact submission error:", error);
      return NextResponse.json(
        { error: "حدث خطأ أثناء إرسال رسالتك. يرجى المحاولة لاحقاً." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "حدث خطأ غير متوقع. يرجى المحاولة لاحقاً." },
      { status: 500 }
    );
  }
}
