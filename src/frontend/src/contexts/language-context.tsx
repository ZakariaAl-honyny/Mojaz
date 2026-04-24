"use client";

import * as React from "react";

export type TranslationKey = 
  | "systemName"
  | "ministry"
  | "heroTitle"
  | "heroSubtitle"
  | "applyNow"
  | "trackApplication"
  | "login"
  | "register"
  | "quickLinks"
  | "servicesTitle"
  | "howItWorksTitle"
  | "categoriesTitle"
  | "faqTitle"
  | "contactUs"
  | "addressValue"
  | "copyright"
  | "allRightsReserved";

const translations: Record<TranslationKey, Record<"ar" | "en", string>> = {
  systemName: {
    ar: "نظام إصدار رخص القيادة",
    en: "Driving License Issuance System"
  },
  ministry: {
    ar: "وزارة الداخلية - الإدارة العامة للمرور",
    en: "Ministry of Interior - General Traffic Authority"
  },
  heroTitle: {
    ar: "نظام إصدار رخص القيادة - اليمن",
    en: "Driving License Issuance System - Yemen"
  },
  heroSubtitle: {
    ar: "تقدم بطلب رخصة قيادتك الجديدة بسهولة وأمان",
    en: "Apply for your driving license easily and safely"
  },
  applyNow: {
    ar: "تقديم طلب جديد",
    en: "Apply Now"
  },
  trackApplication: {
    ar: "تتبع طلبك",
    en: "Track Application"
  },
  login: {
    ar: "تسجيل الدخول",
    en: "Login"
  },
  register: {
    ar: "إنشاء حساب",
    en: "Register"
  },
  quickLinks: {
    ar: "روابط سريعة",
    en: "Quick Links"
  },
  servicesTitle: {
    ar: "خدماتنا",
    en: "Our Services"
  },
  howItWorksTitle: {
    ar: "كيف تعمل المنصة",
    en: "How It Works"
  },
  categoriesTitle: {
    ar: "فئات الرخص",
    en: "License Categories"
  },
  faqTitle: {
    ar: "الأسئلة الشائعة",
    en: "FAQ"
  },
  contactUs: {
    ar: "تواصل معنا",
    en: "Contact Us"
  },
  addressValue: {
    ar: "صنعاء، اليمن",
    en: "Sana'a, Yemen"
  },
  copyright: {
    ar: "جميع الحقوق محفوظة",
    en: "All Rights Reserved"
  },
  allRightsReserved: {
    ar: "© 2024 الإدارة العامة للمرور",
    en: "© 2024 General Traffic Authority"
  }
};

export type Language = "ar" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: TranslationKey) => string;
}

// Helper to get translations as flat record per language
function getTranslations(lang: Language): Record<TranslationKey, string> {
  const result: Record<string, string> = {};
  (Object.keys(translations) as TranslationKey[]).forEach((key) => {
    result[key] = translations[key][lang];
  });
  return result as Record<TranslationKey, string>;
}

const LanguageContext = React.createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children, defaultLang = "ar" }: { children: React.ReactNode; defaultLang?: Language }) {
  const [language, setLanguage] = React.useState<Language>(defaultLang);
  const isRTL = language === "ar";
  
  const t = (key: TranslationKey): string => {
    return translations[key]?.[language] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);
  if (!context) {
    // Return default values if not in provider (for storybook)
    return {
      language: "ar" as Language,
      setLanguage: () => {},
      isRTL: true,
      t: (key: TranslationKey) => getTranslations("ar")[key] || key
    };
  }
  return context;
}