'use client';

// Bilingual translations utility for Mojaz
// Supports Arabic (RTL) and English (LTR)
// Populated with official institutional terminology

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// ============================================
// ARABIC TRANSLATIONS
// ============================================
const ARABIC_MESSAGES: Record<string, any> = {
  forbidden: {
    title: "دخول غير مسموح",
    message: "عذراً، ليس لديك صلاحية للوصول إلى هذه الصفحة. يرجى التواصل مع مدير النظام إذا كنتعتقد أن هذا خطأ.",
    errorCode: "رمز الخطأ",
    goHome: "العودة للوحة التحكم",
    logout: "تسجيل الخروج",
    helpText: "إذا كانت لديك أي استفسارات، يرجى التواصل مع الدعم الفني.",
  },
  common: {
    welcome: "مرحباً بكم في منصة نظام إصدار رخص القيادة",
    description: "منصة حكومية متكاملة لخدمات رخص القيادة في الجمهورية اليمنية.",
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
      cta: { start: "ابدأ الآن", login: "تسجيل الدخول" },
    },
    services: {
      title: "خدماتنا",
      subtitle: "حلول رقمية متكاملة لخدمات المرور",
      items: {
        new: { title: "رخصة جديدة", desc: "إصدار رخصة قيادة لأول مرة" },
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
        0: { q: "ما هي شروط الحصول على رخصة؟", a: "يجب أن لا يقل العمر عن 18 عاماً واجتياز الفحص الطبي." },
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
    features: {
      title: "مميزات المنصة",
      subtitle: "خدمات ذكية مصممة لتسهيل إجراءاتك",
      items: {
        speed: { title: "سرعة الإجراءات", desc: "إنجاز المعاملات في وقت قياسي" },
        security: { title: "أمان عالي", desc: "حماية بياناتك بأحدث التقنيات" },
        support: { title: "دعم فني", desc: "فريق متخصص لمساعدتك على مدار الساعة" },
        coverage: { title: "تغطية شاملة", desc: "خدماتنا تغطي جميع المحافظات" },
        platform: { title: "تطبيق موبايل", desc: "إدارة رخصتك من خلال هاتفك" },
        notifications: { title: "تنبيهات ذكية", desc: "إشعارات فورية لمواعيد التجديد" },
      }
    },
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
    logout: "تسجيل الخروج",
  },
};

// ============================================
// ENGLISH TRANSLATIONS
// ============================================
const ENGLISH_MESSAGES: Record<string, any> = {
  forbidden: {
    title: "Access Denied",
    message: "Sorry, you do not have permission to access this page. Please contact the system administrator if you believe this is an error.",
    errorCode: "Error Code",
    goHome: "Go to Dashboard",
    logout: "Logout",
    helpText: "If you have any questions, please contact technical support.",
  },
  common: {
    welcome: "Welcome to the Driving License Issuance System",
    description: "A comprehensive government platform for driving license services.",
    save: "Save",
    cancel: "Cancel",
    next: "Next",
    back: "Back",
    submit: "Submit",
    loading: "Loading...",
    confirm: "Confirm",
    dashboard: "Dashboard",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
  },
  landing: {
    hero: {
      title: "Electronic Driving License Issuance System",
      subtitle: "A comprehensive platform for issuing and managing driving licenses efficiently and easily",
      cta: { start: "Start Now", login: "Login" },
    },
    services: {
      title: "Our Services",
      subtitle: "Integrated digital solutions for traffic services",
      items: {
        new: { title: "New License", desc: "Issue a driving license for the first time" },
        renewal: { title: "License Renewal", desc: "Renew your expired driving license" },
        replacement: { title: "Lost/Damaged", desc: "Replace lost or damaged license" },
        upgrade: { title: "License Upgrade", desc: "Upgrade your driving license category" },
      }
    },
    stats: {
      title: "Our Numbers",
      activeUsers: "Active Users",
      issuedLicenses: "Issued Licenses",
      satisfactionRate: "Satisfaction Rate",
      centers: "Training Centers",
    },
    faq: {
      title: "Frequently Asked Questions",
      items: {
        0: { q: "What are the requirements for a license?", a: "You must be at least 18 years old and pass the medical exam." },
        1: { q: "How long does the process take?", a: "The process usually takes 3 to 5 working days." },
      }
    },
    categories: {
      title: "License Categories",
      subtitle: "We cover all vehicle categories according to international standards",
      types: {
        A: "Motorcycle",
        B: "Private Car",
        C: "Public Transport",
        D: "Bus",
        E: "Heavy Equipment",
        F: "Agricultural",
      }
    },
    features: {
      title: "Platform Features",
      subtitle: "Smart services designed to facilitate your procedures",
      items: {
        speed: { title: "Fast Processing", desc: "Complete transactions in record time" },
        security: { title: "High Security", desc: "Protect your data with latest technologies" },
        support: { title: "Technical Support", desc: "A specialized team available around the clock" },
        coverage: { title: "Wide Coverage", desc: "Our services cover all governorates" },
        platform: { title: "Mobile App", desc: "Manage your license through your phone" },
        notifications: { title: "Smart Alerts", desc: "Instant notifications for renewals" },
      }
    },
  },
  navigation: {
    dashboard: "Dashboard",
    applications: "Electronic Applications",
    licenses: "Driving Licenses",
    progress: "Track Progress",
    training: "Training Phase",
    myResults: "My Results",
    appointments: "Appointments",
    notifications: "Notifications",
    logout: "Logout",
  },
};

// ============================================
// TRANSLATION CONTEXT
// ============================================
type Locale = 'ar' | 'en';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  dir: 'rtl' | 'ltr';
  isRTL: boolean;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'ar',
  setLocale: () => {},
  toggleLocale: () => {},
  dir: 'rtl',
  isRTL: true,
});

// Translation message store by locale
const MESSAGES: Record<Locale, Record<string, any>> = {
  ar: ARABIC_MESSAGES,
  en: ENGLISH_MESSAGES,
};

// ============================================
// PROVIDER
// ============================================
interface LocaleProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function LocaleProvider({ children, initialLocale = 'ar' }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mojaz-locale', newLocale);
    }
  }, []);

  const toggleLocale = useCallback(() => {
    const newLocale = locale === 'ar' ? 'en' : 'ar';
    setLocale(newLocale);
  }, [locale, setLocale]);

  const value: LocaleContextType = {
    locale,
    setLocale,
    toggleLocale,
    dir: locale === 'ar' ? 'rtl' : 'ltr',
    isRTL: locale === 'ar',
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

// ============================================
// HOOKS
// ============================================
type TranslationOptions = Record<string, string | number | ReactNode>;

type TranslationFunction = (key: string, options?: TranslationOptions) => string;

interface UseTranslationsReturn extends TranslationFunction {
  rich: (key: string, options?: TranslationOptions) => React.ReactNode;
}

/**
 * Get the current locale from context
 */
export function useLocale(): Locale {
  const { locale } = useContext(LocaleContext);
  return locale;
}

/**
 * Get the current direction from context
 */
export function useDirection(): 'rtl' | 'ltr' {
  const { dir } = useContext(LocaleContext);
  return dir;
}

/**
 * Translation hook - returns a function to translate keys
 */
export function useTranslations(namespace?: string): UseTranslationsReturn {
  const { locale } = useContext(LocaleContext);
  const messages = MESSAGES[locale];

  const t = (key: string, options?: TranslationOptions): string => {
    const keys = namespace 
      ? [...namespace.split('.'), ...key.split('.')] 
      : key.split('.');

    let value: any = messages;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }

    let result = (typeof value === 'string' ? value : keys[keys.length - 1]) || key;
    
    if (options) {
      Object.entries(options).forEach(([k, v]) => {
        if (typeof v === 'string' || typeof v === 'number') {
          result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        }
      });
    }
    
    return result;
  };

  const rich: (key: string, options?: TranslationOptions) => React.ReactNode = (key, options) => {
    return <>{t(key, options)}</>;
  };

  return Object.assign(t, { rich });
}

// For static usage (without hook)
export function getTranslation(
  locale: Locale, 
  namespace: string, 
  key: string, 
  options?: TranslationOptions
): string {
  const messages = MESSAGES[locale];
  const keys = [...namespace.split('.'), ...key.split('.')];

  let value: any = messages;
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      value = undefined;
      break;
    }
  }

  let result = (typeof value === 'string' ? value : keys[keys.length - 1]) || key;
  
  if (options) {
    Object.entries(options).forEach(([k, v]) => {
      if (typeof v === 'string' || typeof v === 'number') {
        result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      }
    });
  }
  
  return result;
}

// ============================================
// LEGACY EXPORTS
// ============================================
export const NextIntlClientProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  return <>{children}</>;
};

export type { Locale };