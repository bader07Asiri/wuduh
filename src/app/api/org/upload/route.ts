// ============================
// وضوح | Wuduh — رفع شعار المؤسسة (المالك/المشرف)
// يخزّن الصورة في Supabase Storage ويعيد رابط https صالحاً (يصلح للسيرفر عند توليد المستندات)
// ============================

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });

  const supabase = createAdminClient();

  // صلاحية: مالك/مشرف مؤسسة نشط
  const { data: membership } = await supabase
    .from("org_members")
    .select("org_id, role")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (!membership || !["owner", "admin"].includes(membership.role)) {
    return NextResponse.json({ error: "ليس لديك صلاحية" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "لم يُرفق ملف" }, { status: 400 });

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "نوع الملف غير مدعوم. استخدم PNG أو JPG أو WebP" }, { status: 400 });
  }
  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: "حجم الملف يجب أن يكون أقل من 2MB" }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  const fileName = `org-${membership.org_id}-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const doUpload = () =>
    supabase.storage.from("assets").upload(fileName, buffer, { contentType: file.type, upsert: true });

  let { error: uploadError } = await doUpload();
  if (uploadError && /bucket/i.test(uploadError.message ?? "")) {
    await supabase.storage.createBucket("assets", {
      public: true,
      allowedMimeTypes: ALLOWED_TYPES,
      fileSizeLimit: 2 * 1024 * 1024,
    });
    ({ error: uploadError } = await doUpload());
  }
  if (uploadError) {
    return NextResponse.json({ error: `فشل رفع الشعار: ${uploadError.message}` }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage.from("assets").getPublicUrl(fileName);
  return NextResponse.json({ url: publicUrlData.publicUrl });
}
