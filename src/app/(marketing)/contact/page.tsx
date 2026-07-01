"use client";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Clock, CheckCircle2, Send } from "lucide-react";
import { toast } from "sonner";

type Status = "idle" | "sending" | "done";

const subjects = [
  "استفسار عن الخطط والأسعار",
  "مشكلة تقنية في المنصة",
  "طلب عرض تجريبي للمؤسسات",
  "اقتراح أو ملاحظة",
  "شراكة أو تكامل",
  "موضوع آخر",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.subject || !form.message) {
      toast.error("يرجى ملء جميع الحقول الإلزامية");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "فشل الإرسال");
      setStatus("done");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "حدث خطأ، يرجى المحاولة لاحقاً");
      setStatus("idle");
    }
  };

  return (
    <>
      <Navbar />
      <main>

        {/* Header */}
        <section className="bg-navy-950 py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <Mail size={14} className="text-brand-cyan" />
              <span className="text-white/80 text-sm font-arabic">نرد على كل رسالة</span>
            </div>
            <h1 className="text-4xl font-black text-white font-arabic mb-3">تواصل معنا</h1>
            <p className="text-white/60 font-arabic text-lg">
              فريقنا هنا للمساعدة. أرسل لنا رسالة وسنعود إليك خلال 24 ساعة عمل.
            </p>
          </div>
        </section>

        {/* Main */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Info Cards */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6 border border-slate-100">
                  <div className="w-10 h-10 bg-brand-blue/10 rounded-xl flex items-center justify-center mb-3">
                    <Mail size={20} className="text-brand-blue" />
                  </div>
                  <h3 className="font-bold text-slate-900 font-arabic mb-1">البريد الإلكتروني</h3>
                  <p className="text-sm text-slate-500 font-arabic">
                    نتلقى استفساراتك عبر النموذج ونردّ على بريدك الإلكتروني مباشرة.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-100">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-3">
                    <Clock size={20} className="text-emerald-500" />
                  </div>
                  <h3 className="font-bold text-slate-900 font-arabic mb-1">وقت الاستجابة</h3>
                  <p className="text-sm text-slate-500 font-arabic">خلال 24 ساعة عمل — أحياناً أسرع.</p>
                </div>

                <div className="bg-navy-950 rounded-2xl p-6">
                  <h3 className="font-bold text-white font-arabic mb-2">للمؤسسات والشركات</h3>
                  <p className="text-sm text-white/60 font-arabic">
                    هل تبحث عن حل مؤسسي؟ اذكر ذلك في رسالتك وسيتواصل معك مدير حساب متخصص.
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-2">
                {status === "done" ? (
                  <div className="bg-white rounded-2xl border border-slate-100 p-12 flex flex-col items-center justify-center text-center gap-4">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={32} className="text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 font-arabic">تم إرسال رسالتك!</h2>
                    <p className="text-slate-500 font-arabic max-w-sm leading-relaxed">
                      استلمنا رسالتك وسنرد على بريدك الإلكتروني <strong className="text-slate-700">{form.email}</strong> خلال 24 ساعة عمل.
                    </p>
                    <button
                      onClick={() => {
                        setStatus("idle");
                        setForm({ full_name: "", email: "", company: "", subject: "", message: "" });
                      }}
                      className="text-sm text-brand-blue underline font-arabic mt-2"
                    >
                      إرسال رسالة أخرى
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl border border-slate-100 p-8 space-y-5"
                  >
                    <h2 className="text-xl font-black text-slate-900 font-arabic mb-2">أرسل لنا رسالة</h2>

                    {/* Row: Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 font-arabic mb-1.5">
                          الاسم الكامل <span className="text-red-400">*</span>
                        </label>
                        <Input
                          placeholder="مثال: بدر العسيري"
                          value={form.full_name}
                          onChange={(e) => set("full_name", e.target.value)}
                          required
                          disabled={status === "sending"}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 font-arabic mb-1.5">
                          البريد الإلكتروني <span className="text-red-400">*</span>
                        </label>
                        <Input
                          type="email"
                          placeholder="you@company.com"
                          value={form.email}
                          onChange={(e) => set("email", e.target.value)}
                          required
                          disabled={status === "sending"}
                          className="font-latin"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    {/* Company */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 font-arabic mb-1.5">
                        اسم الشركة أو المؤسسة
                        <span className="text-slate-400 font-normal mr-1">(اختياري)</span>
                      </label>
                      <Input
                        placeholder="مثال: شركة النور للمقاولات"
                        value={form.company}
                        onChange={(e) => set("company", e.target.value)}
                        disabled={status === "sending"}
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 font-arabic mb-1.5">
                        موضوع الرسالة <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={form.subject}
                        onChange={(e) => set("subject", e.target.value)}
                        required
                        disabled={status === "sending"}
                        className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-arabic text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors disabled:opacity-50"
                      >
                        <option value="">اختر موضوع الرسالة</option>
                        {subjects.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 font-arabic mb-1.5">
                        الرسالة <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        placeholder="اكتب رسالتك هنا بتفصيل — كلما كانت المعلومات أوضح، كان ردنا أكثر فائدة."
                        value={form.message}
                        onChange={(e) => set("message", e.target.value)}
                        required
                        rows={5}
                        disabled={status === "sending"}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-arabic text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors resize-none disabled:opacity-50"
                      />
                      <p className="text-xs text-slate-400 font-arabic mt-1">
                        {form.message.length} حرف — الحد الأدنى 20 حرفاً
                      </p>
                    </div>

                    <Button
                      type="submit"
                      variant="gold"
                      size="lg"
                      className="w-full"
                      disabled={status === "sending"}
                    >
                      {status === "sending" ? (
                        <span className="font-arabic">جاري الإرسال...</span>
                      ) : (
                        <>
                          <Send size={18} />
                          <span className="font-arabic">إرسال الرسالة</span>
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-slate-400 font-arabic text-center">
                      بإرسال هذه الرسالة، أنت توافق على{" "}
                      <a href="/privacy" className="text-brand-blue underline">سياسة الخصوصية</a>
                    </p>
                  </form>
                )}
              </div>

            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
