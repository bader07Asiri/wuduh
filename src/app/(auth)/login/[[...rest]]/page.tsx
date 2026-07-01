import { SignIn } from "@clerk/nextjs";

export default function LoginCatchAllPage() {
  return (
    <div className="min-h-screen bg-brand-gradient flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-cyan flex items-center justify-center text-white font-black text-2xl font-arabic shadow-lg">
            و
          </div>
          <div>
            <div className="text-white font-black text-2xl font-arabic leading-none">وضوح</div>
            <div className="text-white/40 text-xs font-latin tracking-[3px] uppercase">WUDUH</div>
          </div>
        </div>

        <SignIn
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
      </div>
    </div>
  );
}
