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

const translations: Record<TranslationKey, string> = {
  systemName: "نظام إصدار رخص القيادة",
  ministry: "وزارة الداخلية - الإدارة العامة للمرور",
  heroTitle: "نظام إصدار رخص القيادة - اليمن",
  heroSubtitle: "تقدم بطلب رخصة قيادتك الجديدة بسهولة وأمان",
  applyNow: "تقديم طلب جديد",
  trackApplication: "تتبع طلبك",
  login: "تسجيل الدخول",
  register: "إنشاء حساب",
  quickLinks: "روابط سريعة",
  servicesTitle: "خدماتنا",
  howItWorksTitle: "كيف تعمل المنصة",
  categoriesTitle: "فئات الرخص",
  faqTitle: "الأسئلة الشائعة",
  contactUs: "تواصل معنا",
  addressValue: "صنعاء، اليمن",
  copyright: "جميع الحقوق محفوظة",
  allRightsReserved: "© 2024 الإدارة العامة للمرور"
};

export type Language = "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: TranslationKey) => string;
}

const LanguageContext = React.createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language: Language = "ar";
  const isRTL = true;
  
  const t = (key: TranslationKey): string => {
    return translations[key] || key;
  };
  
  const setLanguage = () => {}; // No-op as language is locked to Arabic
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);
  if (!context) {
    return {
      language: "ar" as Language,
      setLanguage: () => {},
      isRTL: true,
      t: (key: TranslationKey) => translations[key] || key
    };
  }
  return context;
}