import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#EDF2FB] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-full.png" alt="وضوح Wuduh" className="h-20 w-auto object-contain drop-shadow-lg" />
        </div>

        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "rounded-2xl shadow-modal border-0",
              headerTitle: "font-arabic text-slate-900 font-black",
              headerSubtitle: "font-arabic text-slate-500",
              socialButtonsBlockButton: "font-arabic",
              formFieldLabel: "font-arabic text-slate-700",
              formFieldInput: "rounded-xl border-slate-200 font-arabic",
              formButtonPrimary: "bg-brand-blue hover:bg-blue-700 font-arabic font-bold rounded-xl",
              footerActionLink: "text-brand-blue font-arabic",
            },
          }}
        />

        {/* PDPL — consent notice */}
        <p className="text-center text-slate-500 text-xs font-arabic mt-5 leading-relaxed">
          بإنشائك حساباً في وضوح، فإنك توافق على{" "}
          <a href="/terms" className="underline text-brand-blue font-semibold">شروط الاستخدام</a>{" "}
          و{" "}
          <a href="/privacy" className="underline text-brand-blue font-semibold">سياسة الخصوصية</a>{" "}
          ومعالجة بياناتك وفق نظام حماية البيانات الشخصية.
        </p>
      </div>
    </div>
  );
}
