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
// ENGLISH TRANSLATIONS (PURGED)
// ============================================
// System is now 100% Arabic Lockdown

// ============================================
// TRANSLATION CONTEXT
// ============================================
type Locale = 'ar';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  dir: 'rtl';
  isRTL: boolean;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'ar',
  setLocale: () => { },
  toggleLocale: () => { },
  dir: 'rtl',
  isRTL: true,
});

// Translation message store by locale
const MESSAGES: Record<Locale, Record<string, any>> = {
  ar: ARABIC_MESSAGES,
};

// ============================================
// PROVIDER
// ============================================
interface LocaleProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function LocaleProvider({ children, initialLocale = 'ar' }: LocaleProviderProps) {
  // Locale is hardcoded to 'ar' to satisfy Arabic Lockdown
  const locale: Locale = 'ar';

  const setLocale = useCallback((newLocale: Locale) => {
    // No-op to prevent language switching
  }, []);

  const toggleLocale = useCallback(() => {
    // No-op
  }, []);

  const value: LocaleContextType = {
    locale,
    setLocale,
    toggleLocale,
    dir: 'rtl',
    isRTL: true,
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
  return 'ar';
}

/**
 * Get the current direction from context
 */
export function useDirection(): 'rtl' {
  return 'rtl';
}

/**
 * Translation hook - returns a function to translate keys
 */
export function useTranslations(namespace?: string): UseTranslationsReturn {
  const messages = MESSAGES.ar;

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
  const messages = MESSAGES.ar;
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
export const NextIntlClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export type { Locale };