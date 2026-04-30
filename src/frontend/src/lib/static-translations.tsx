// Static Arabic translations utility for Mojaz
// This replaces next-intl for Arabic-only builds
// Populated with official institutional terminology

import React from 'react';

// Official Arabic translations extracted from JSON files
const ARABIC_MESSAGES: Record<string, any> = {
  application: {
    timeline: {
      stages: {
        "01": { title: "تقديم الطلب", desc: "إنشاء الطلب وتعبئة البيانات" },
        "02": { title: "المستندات", desc: "رفع المستندات والتحقق" },
        "03": { title: "سداد الرسوم", desc: "سداد الرسوم الأولية" },
        "04": { title: "الفحص الطبي", desc: "تأكيد اللياقة الطبية" },
        "05": { title: "التدريب", desc: "إكمال تدريب القيادة" },
        "06": { title: "الاختبار النظري", desc: "اجتياز الاختبار النظري" },
        "07": { title: "الاختبار العملي", desc: "اجتياز الاختبار العملي" },
        "08": { title: "الاعتماد النهائي", desc: "المراجعة والاعتماد" },
        "09": { title: "سداد الإصدار", desc: "سداد رسوم الإصدار" },
        "10": { title: "إصدار الرخصة", desc: "إصدار وتسليم الرخصة" },
        creation: "إنشاء الطلب",
        documentReview: "مراجعة المستندات",
        training: "مرحلة التدريب",
        payment: "مرحلة السداد",
        medical: "مرحلة الفحص الطبي",
        theory: "مرحلة الاختبار النظري",
        practical: "مرحلة الاختبار العملي",
        fieldTest: "اختبار الميدان الزراعي",
        issuance: "إصدار الرخصة"
      },
      status: {
        completed: "مكتمل",
        current: "قيد التنفيذ",
        pending: "قيد الانتظار",
        failed: "لم يتم الإكمال",
        completedDesc: "مكتمل بنجاح",
        currentDesc: "قيد المراجعة والمعالجة",
        pendingDesc: "قيد الانتظار",
        failedDesc: "فشل في هذه المرحلة"
      }
    }
  },
  license: {
    title: "تراخيصي",
    subtitle: "إدارة ومتابعة رخص القيادة الصادرة عن الإدارة العامة للمرور",
    myLicenses: "لا توجد رخص متوفرة",
    class: "الفئة",
    active: "نشط",
    expired: "منتهي",
    suspended: "موقوف",
    issueDate: "تاريخ الإصدار",
    expiryDate: "تاريخ الانتهاء",
    digitalLicense: "الرخصة الرقمية",
    download: "تحميل",
    share: "مشاركة",
    viewQR: "عرض QR",
    status: {
      active: "نشط",
      expired: "منتهي",
      suspended: "موقوف",
    },
    card: {
      title: "رخصة قيادة - فئة {{categoryName}}",
      categoryCode: "فئة {{code}}",
      number: "رقم الرخصة",
      category: "الفئة",
      issuedAt: "تاريخ الإصدار",
      expiresAt: "تاريخ الانتهاء",
      status: "الحالة",
      active: "نشطة",
      expired: "منتهية",
      replaced: "تم استبدالها",
      replacementCount: "عدد الاستبدالات",
      requestReplacement: "طلب استبدال",
      renew: "تجديد",
      viewPdf: "عرض PDF",
      expiringSoon: "تنتهي قريباً"
    }
  },
  queue: {
    title: "طابور معالجة الطلبات",
    subtitle: "إدارة ومراجعة طلبات رخص القيادة الواردة للنظام. ضمان الدقة والالتزام بالمعايير الحكومية في كل عملية.",
    filter: "تصفية القائمة",
    search: "البحث في القائمة...",
    columns: {
      applicationNumber: "رقم الطلب",
      applicantName: "اسم المتقدم",
      serviceType: "نوع الخدمة",
      category: "فئة الرخصة",
      submittedDate: "تاريخ الاستلام",
      status: "الحالة",
      stage: "مرحلة المعالجة",
      actions: "الإجراءات",
    },
    noResults: "لا يوجد طلبات حالية في قائمة الانتظار",
    showing: "عرض {count} من {total} معاملة نشطة",
    pagination: {
      previous: "السابق",
      next: "التالي",
    },
    stages: {
      submit: "تقديم الطلب",
      documentReview: "مراجعة المستندات",
      inReview: "في المراجعة",
      medicalExam: "الفحص الطبي",
      training: "التدريب",
      theoryTest: "الاختبار النظري",
      practicalTest: "الاختبار العملي",
      approved: "الموافقة",
      payment: "الدفع",
      issued: "إصدار الرخصة",
      processing: "قيد المعالجة",
    },
    categories: {
      A: "دراجة نارية",
      B: "سيارة خصوصي",
      C: "نقل عام",
      D: "حافلة",
      E: "أشغال شاقة",
      F: "زراعية",
    },
    fields: {
      applicantName: "اسم المتقدم",
      nationalId: "الرقم الوطني",
      phone: "رقم الهاتف",
      email: "البريد الإلكتروني",
      address: "العنوان",
      fullName: "الاسم الكامل",
      serviceType: "نوع الخدمة",
      category: "فئة الرخصة",
    }
  },
  review: {
    title: "مراجعة الطلب",
    backLink: "العودة لقائمة الطلبات",
    sections: {
      applicantInfo: "بيانات مقدم الطلب",
      documents: "المستندات والوثائق",
      decision: "اتخاذ القرار",
      history: "سجل الحركات",
    },
    fields: {
      fullName: "الاسم الكامل",
      nationalId: "الرقم الوطني",
      serviceType: "نوع الخدمة",
      phone: "رقم الهاتف",
      email: "البريد الإلكتروني",
      address: "العنوان",
      category: "فئة الرخصة",
    },
    documents: {
      view: "عرض المستند",
      approved: "معتمد",
      pending: "بانتظار المراجعة",
      rejected: "مرفوض",
    },
    decision: {
      remarks: "ملاحظات المراجع",
      remarksPlaceholder: "اكتب ملاحظاتك المهنية هنا...",
      approve: "اعتماد الموافقة",
      reject: "رفض الطلب",
      confirmApprove: "هل أنت متأكد من اعتماد هذا الطلب؟",
      confirmReject: "سبب الرفض",
      rejectPlaceholder: "اكتب سبب الرفض...",
      cancel: "إلغاء",
      submit: "تأكيد",
    },
    history: {
      processingCenter: "مركز المعالجة",
      initialSubmit: "تقديم الطلب الأولي",
      by: "بواسطة",
    },
    messages: {
      approved: "تمت الموافقة على الطلب بنجاح",
      rejected: "تم رفض الطلب بنجاح",
      error: "حدث خطأ. يرجى المحاولة مرة أخرى.",
    }
  },
  common: {
    welcome: "مرحباً بكم في منصة نظام إصدار رخص القيادة",
    description: "منصة حكومية متكاملة لخدمات رخص القيادة في الجمهورية اليمنية. سهولة في التقديم، سرعة في الإجراءات، وموثوقية عالية.",
    save: "حفظ",
    cancel: "إلغاء",
    next: "التالي",
    back: "السابق",
    submit: "تقديم",
    loading: "جاري التحميل...",
    confirm: "تأكيد",
    dashboard: "لوحة التحكم",
    profile: "الملف الشخصي",
    settings: "الإعدادات",
    logout: "تسجيل الخروج",
  },
  landing: {
    hero: {
      title: "نظام إصدار رخص القيادة الإلكتروني",
      subtitle: "منصة متكاملة لإصدار وإدارة رخص القيادة بكفاءة وسهولة",
      applyNow: "تقديم طلب جديد",
      trackApplication: "تتبع طلبك",
      cta: "ابدأ الآن",
    },
    services: {
      title: "خدماتنا",
      subtitle: "حلول رقمية متكاملة لخدمات المرور",
      items: {
        new_license: { title: "رخصة جديدة", desc: "إصدار رخصة قيادة لأول مرة" },
        renewal: { title: "تجديد رخصة", desc: "تجديد رخصة القيادة المنتهية" },
        replacement: { title: "بدل فاقد/تالف", desc: "إصدار بدل فاقد أو تالف للرخصة" },
        upgrade: { title: "ترقية رخصة", desc: "ترقية فئة رخصة القيادة" },
      }
    },
    stats: {
      title: "أرقامنا تتحدث",
      activeUsers: "مستخدم نشط",
      issuedLicenses: "رخصة صادرة",
      satisfactionRate: "نسبة الرضا",
      centers: "مركز تدريب",
    },
    faq: {
      title: "الأسئلة الشائعة",
      items: {
        0: { q: "ما هي شروط الحصو على رخصة؟", a: "يجب أن لا يقل العمر عن 18 عاماً واجتياز الفحص الطبي." },
        1: { q: "كم تستغرق عملية الإصدار؟", a: "تستغرق العملية عادة من 3 إلى 5 أيام عمل." },
      }
    },
    categories: {
      title: "فئات الرخص",
      subtitle: "نغطي جميع فئات المركبات وفقاً للمعايير الدولية",
      types: {
        A: "دراجة نارية",
        B: "سيارة خصوصي",
        C: "نقل عام",
        D: "حافلة",
        E: "أشغال شاقة",
        F: "زراعية",
      }
    },
    timeline: {
      title: "كيفية التقديم",
      subtitle: "خطوات بسيطة للحصول على رخصتك",
      stages: {
        0: "التسجيل في المنصة",
        1: "اختيار الخدمة",
        2: "الفحص الطبي",
        3: "دفع الرسوم",
        4: "الاختبار النظري",
        5: "الاختبار العملي",
        6: "مراجعة البيانات",
        7: "الموافقة النهائية",
        8: "طباعة الرخصة",
        9: "استلام الرخصة",
      }
    },
    features: {
      title: "مميزات المنصة",
      subtitle: "خدمات ذكية مصممة لتسهيل إجراءاتك",
      items: {
        feature1Title: "سرعة الإجراءات",
        feature1Desc: "إنجاز المعاملات في وقت قياسي",
        feature2Title: "أمان عالي",
        feature2Desc: "حماية بياناتك بأحدث التقنيات",
        feature3Title: "دعم فني",
        feature3Desc: "فريق متخصص لمساعدتك على مدار الساعة",
        feature4Title: "تغطية شاملة",
        feature4Desc: "خدماتنا تغطي جميع المحافظات",
        feature5Title: "تطبيق موبايل",
        feature5Desc: "إدارة رخصتك من خلال هاتفك",
        feature6Title: "تنبيهات ذكية",
        feature6Desc: "إشعارات فورية لمواعيد التجديد والاختبارات",
      }
    },
    application: {
      status: {
        draft: "مسودة",
        submitted: "تم التقديم",
        documents: "بانتظار الوثائق",
        inReview: "قيد المراجعة",
        medical: "الفحص الطبي",
        training: "مرحلة التدريب",
        theory: "الاختبار النظري",
        practical: "الاختبار العملي",
        approved: "مقبول",
        payment: "بانتظار الدفع",
        issued: "صدرت الرخصة",
        active: "نشط",
        rejected: "مرفوض",
        cancelled: "ملغي",
        expired: "منتهي",
        paid: "تم الدفع",
      }
    }
  },
  navigation: {
    dashboard: "لوحة التحكم",
    applications: "الطلبات الإلكترونية",
    licenses: "رخص القيادة",
    progress: "تتبع المسار",
    training: "مرحلة التدريب",
    myResults: "نتائجي",
    appointments: "المواعيد",
    notifications: "التنبيهات",
    schedule: "جدول المواعيد العام",
    attendance: "كشف الحضور",
    issueLicense: "إصدار رخصة",
    verifyLicense: "التحقق من الرخص",
    medicalResults: "الفحص الطبي",
    testResults: "نتائج الاختبارات",
    users: "المستخدمين",
    reports: "التقارير",
    applicationReports: "تقارير الطلبات",
    financialReports: "التقارير المالية",
    userReports: "تقارير المستخدمين",
    performanceReports: "تقارير الأداء",
    auditReports: "سجلات الرقابة",
    licenseReports: "تقارير الرخص",
    settings: "الإعدادات",
    profile: "الملف الشخصي",
    notificationSettings: "إعدادات التنبيهات",
    emailPreferences: "تفضيلات البريد",
    logout: "تسجيل الخروج",
  },
  employee: {
    reports: {
      subtitle: "لوحة التقارير والتحليلات",
      title: "التقارير والإحصائيات",
      charts: "نوع التقرير",
      daily: "اليوم",
      weekly: "الأسبوع",
      monthly: "الشهر",
      custom: "مخصص",
      dateFrom: "من",
      dateTo: "إلى",
      generate: "إنشاء",
      result: {
        passed: "ناجح",
        failed: "راسب",
        pending: "قيد الانتظار"
      },
      details: "تفاصيل الطلبات",
      passRate: "نسبة النجاح",
      trends: "اتجاهات المعالجة",
      columns: {
        applicationNumber: "رقم الطلب",
        category: "الفئة",
        result: "النتيجة",
        processingTime: "مدة المعالجة",
        date: "التاريخ"
      },
      queue: {
        columns: {
          categoryPrefix: "فئة"
        }
      },
      metrics: {
        totalProcessed: "إجمالي المعالج",
        passRate: "نسبة النجاح",
        avgProcessingTime: "متوسط مدة المعالجة",
        efficiencyTrend: "اتجاه الكفاءة"
      },
      totalIssued: "إجمالي الرخص المصدرة",
      active: "نشط",
      expired: "منتهي",
      expiredSoon: "مقبل الانتهاء"
    },
    manage: { title: "إدارة الرخص" },
    training: { title: "إدارة التدريب" },
    testing: { title: "إدارة الاختبارات" },
    sendNotification: "إرسال تعميم"
  },
  fees: {
    title: "إدارة الرسوم",
    subtitle: "إدارة رسوم الخدمات والرخص",
    addNew: "إضافة رسوم جديد",
    edit: "تعديل الرسوم",
    create: "إضافة رسوم جديد",
    feeType: "نوع الرسوم",
    licenseCategory: "فئة الرخصة",
    amount: "المبلغ",
    currency: "العملة",
    effectiveFrom: "تاريخ السريان",
    effectiveTo: "تاريخ الانتهاء",
    description: "الوصف",
    status: "الحالة",
    active: "نشط",
    inactive: "غير نشط",
    actions: "الإجراءات",
    editAction: "تعديل",
    deleteAction: "حذف",
    toggleAction: "تفعيل/تعطيل",
    search: "البحث...",
    noFees: "لا توجد رسوم",
    all: "الكل",
    confirmDelete: "هل أنت متأكد من حذف هذه الرسوم؟",
    deleteSuccess: "تم الحذف بنجاح",
    deleteError: "فشل في الحذف",
    saveSuccess: "تم الحفظ بنجاح",
    saveError: "فشل في الحفظ",
    loadError: "فشل في تحميل البيانات",
    feeTypes: {
      ApplicationFee: "رسوم التقديم",
      MedicalExamFee: "رسوم الفحص الطبي",
      TheoryTestFee: "رسوم الاختبار النظري",
      PracticalTestFee: "رسوم الاختبار العملي",
      IssuanceFee: "رسوم إصدار الرخصة",
      RetakeFee: "رسوم إعادة الاختبار"
    },
    categories: {
      A: "دراجة نارية",
      B: "سيارة خصوصي",
      C: "نقل عام",
      D: "حافلة",
      E: "أشغال شاقة",
      F: "زراعية"
    }
  }
};

type TranslationOptions = Record<string, string | number | React.ReactNode>;

type RichTranslationFunction = (key: string, options?: {
  name?: string;
  [key: string]: string | number | React.ReactNode | ((chunks: React.ReactNode) => React.ReactNode);
}) => React.ReactNode;

type TranslationFunction = (key: string, options?: TranslationOptions) => string;

interface UseTranslationsReturn extends TranslationFunction {
  rich: RichTranslationFunction;
}

interface GetTranslationsOptions {
  locale?: string;
  namespace?: string;
}

/**
 * Internal factory to create translation functions without Hook violations
 */
function createTranslations(namespace?: string): UseTranslationsReturn {
  const t = (key: string, options?: TranslationOptions): string => {
    // Lookup logic
    const keys = namespace ? [...namespace.split('.'), ...key.split('.')] : key.split('.');
    let value: any = ARABIC_MESSAGES;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }

    // Default to last part of key if not found
    let result = (typeof value === 'string' ? value : keys[keys.length - 1]) || key;
    
    if (options) {
      Object.entries(options).forEach(([k, v]) => {
        if (typeof v === 'string' || typeof v === 'number') {
          result = result.replace(`{${k}}`, String(v));
        }
      });
    }
    
    return result;
  };

  const rich: RichTranslationFunction = (key: string, options?: any): React.ReactNode => {
    return <>{t(key, options)}</>;
  };

  return Object.assign(t, { rich });
}

// React Hook version
export function useTranslations(namespace?: string): UseTranslationsReturn {
  return createTranslations(namespace);
}

// For any code expecting useLocale
export function useLocale(): string {
  return 'ar';
}

// Fixed getTranslations to avoid calling the hook directly
export async function getTranslations(options?: string | GetTranslationsOptions): Promise<UseTranslationsReturn> {
  let namespace: string | undefined;
  
  if (typeof options === 'string') {
    namespace = options;
  } else if (options && typeof options === 'object') {
    namespace = options.namespace;
  }
  
  return createTranslations(namespace);
}

export const NextIntlClientProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return <>{children}</>;
};