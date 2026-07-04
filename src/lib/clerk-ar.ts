import type { LocalizationResource } from "@clerk/types";

// تعريب واجهات Clerk (تسجيل الدخول / إنشاء الحساب)
// المفاتيح غير المعرّبة تعود تلقائياً للإنجليزية
export const clerkArabic: LocalizationResource = {
  locale: "ar-SA",

  socialButtonsBlockButton: "المتابعة عبر {{provider|titleize}}",
  dividerText: "أو",
  formButtonPrimary: "متابعة",
  backButton: "رجوع",

  formFieldLabel__emailAddress: "البريد الإلكتروني",
  formFieldLabel__password: "كلمة المرور",
  formFieldLabel__firstName: "الاسم الأول",
  formFieldLabel__lastName: "اسم العائلة",
  formFieldLabel__newPassword: "كلمة المرور الجديدة",
  formFieldLabel__confirmPassword: "تأكيد كلمة المرور",
  formFieldLabel__currentPassword: "كلمة المرور الحالية",
  formFieldInputPlaceholder__emailAddress: "أدخل بريدك الإلكتروني",
  formFieldAction__forgotPassword: "نسيت كلمة المرور؟",

  badge__primary: "أساسي",
  badge__default: "افتراضي",

  signIn: {
    start: {
      title: "تسجيل الدخول إلى {{applicationName}}",
      subtitle: "مرحباً بعودتك! سجّل دخولك للمتابعة",
      actionText: "ليس لديك حساب؟",
      actionLink: "أنشئ حساباً",
    },
    password: {
      title: "أدخل كلمة المرور",
      subtitle: "أدخل كلمة المرور المرتبطة بحسابك",
      actionLink: "استخدم طريقة أخرى",
    },
    forgotPasswordAlternativeMethods: {
      title: "نسيت كلمة المرور؟",
      label__alternativeMethods: "أو سجّل الدخول بطريقة أخرى",
      blockButton__resetPassword: "إعادة تعيين كلمة المرور",
    },
    forgotPassword: {
      title: "إعادة تعيين كلمة المرور",
      subtitle: "لإعادة تعيين كلمة المرور",
      subtitle_email: "أدخل الرمز المرسل إلى بريدك الإلكتروني",
      formTitle: "رمز إعادة التعيين",
      resendButton: "لم يصلك الرمز؟ إعادة الإرسال",
    },
    resetPassword: {
      title: "تعيين كلمة مرور جديدة",
      formButtonPrimary: "إعادة التعيين",
      successMessage: "تم تغيير كلمة المرور بنجاح. جارٍ تسجيل دخولك...",
    },
    emailCode: {
      title: "تحقق من بريدك الإلكتروني",
      subtitle: "للمتابعة إلى {{applicationName}}",
      formTitle: "رمز التحقق",
      resendButton: "لم يصلك الرمز؟ إعادة الإرسال",
    },
    alternativeMethods: {
      title: "استخدم طريقة أخرى",
      subtitle: "تواجه مشكلة؟ يمكنك استخدام أي من هذه الطرق لتسجيل الدخول",
      blockButton__emailCode: "إرسال رمز إلى {{identifier}}",
      blockButton__password: "تسجيل الدخول بكلمة المرور",
      getHelp: {
        title: "احصل على مساعدة",
        content: "إذا واجهت صعوبة في تسجيل الدخول، راسلنا وسنساعدك في استعادة حسابك بأسرع وقت.",
        blockButton__emailSupport: "مراسلة الدعم",
      },
    },
  },

  signUp: {
    start: {
      title: "أنشئ حسابك",
      subtitle: "مرحباً بك! أكمل البيانات للبدء",
      actionText: "لديك حساب بالفعل؟",
      actionLink: "تسجيل الدخول",
    },
    emailCode: {
      title: "تحقق من بريدك الإلكتروني",
      subtitle: "أدخل رمز التحقق المرسل إلى بريدك",
      formTitle: "رمز التحقق",
      formSubtitle: "أدخل الرمز المرسل إلى بريدك الإلكتروني",
      resendButton: "لم يصلك الرمز؟ إعادة الإرسال",
    },
    continue: {
      title: "أكمل البيانات الناقصة",
      subtitle: "للمتابعة إلى {{applicationName}}",
      actionText: "لديك حساب بالفعل؟",
      actionLink: "تسجيل الدخول",
    },
  },

  userButton: {
    action__manageAccount: "إدارة الحساب",
    action__signOut: "تسجيل الخروج",
    action__signOutAll: "تسجيل الخروج من جميع الحسابات",
    action__addAccount: "إضافة حساب",
  },

  unstable__errors: {
    form_identifier_not_found: "لا يوجد حساب بهذا البريد الإلكتروني",
    form_password_incorrect: "كلمة المرور غير صحيحة",
    form_password_pwned: "كلمة المرور هذه مسرّبة في اختراقات سابقة — الرجاء اختيار كلمة مرور أخرى",
    form_password_length_too_short: "كلمة المرور قصيرة جداً",
    form_identifier_exists__email_address: "هذا البريد الإلكتروني مسجّل مسبقاً — جرّب تسجيل الدخول",
    form_param_format_invalid__email_address: "صيغة البريد الإلكتروني غير صحيحة",
  },
};
