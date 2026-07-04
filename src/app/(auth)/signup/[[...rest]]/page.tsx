import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-brand-gradient flex items-center justify-center px-4">
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
      </div>
    </div>
  );
}
