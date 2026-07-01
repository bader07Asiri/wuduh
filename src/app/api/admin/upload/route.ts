import { auth, currentUser } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";

async function verifyAdmin(userId: string): Promise<boolean> {
  const user = await currentUser();
  const primaryEmail =
    user?.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? user?.emailAddresses[0]?.emailAddress ?? null;
  if (primaryEmail?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) return true;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("user_profiles")
    .select("email, is_admin")
    .eq("clerk_id", userId)
    .single();
  return (
    data?.is_admin === true ||
    data?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  );
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await verifyAdmin(userId))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  // Validate file type
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "نوع الملف غير مدعوم. استخدم PNG أو JPG أو SVG أو WebP" }, { status: 400 });
  }

  // Validate file size (2MB max)
  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: "حجم الملف يجب أن يكون أقل من 2MB" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const ext = file.name.split(".").pop() ?? "png";
  const fileName = `logo-${Date.now()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from("assets")
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    // If bucket doesn't exist, try to create it first
    if (uploadError.message?.includes("Bucket not found") || uploadError.message?.includes("bucket")) {
      const { error: bucketError } = await supabase.storage.createBucket("assets", {
        public: true,
        allowedMimeTypes: allowedTypes,
        fileSizeLimit: 2 * 1024 * 1024,
      });
      if (bucketError) {
        return NextResponse.json({ error: `فشل إنشاء bucket: ${bucketError.message}` }, { status: 500 });
      }
      // Retry upload
      const { error: retryError } = await supabase.storage
        .from("assets")
        .upload(fileName, buffer, { contentType: file.type, upsert: true });
      if (retryError) {
        return NextResponse.json({ error: `فشل رفع الملف: ${retryError.message}` }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: `فشل رفع الملف: ${uploadError.message}` }, { status: 500 });
    }
  }

  const { data: publicUrlData } = supabase.storage.from("assets").getPublicUrl(fileName);

  return NextResponse.json({ url: publicUrlData.publicUrl });
}
