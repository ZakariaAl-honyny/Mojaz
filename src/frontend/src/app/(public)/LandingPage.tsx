/**
 * Mojaz Landing Page - Complete with i18n, RTL/LTR, Dark/Light Support
 * 
 * Sections:
 * 1. Hero - Headline, CTA, Trust Badges
 * 2. Services - 8 Service Cards Grid
 * 3. Workflow - 6 Steps Timeline
 * 4. Categories - 6 License Category Cards (A-F)
 * 5. Features - 6 Feature Highlight Cards
 * 6. Stats - Counter Animations
 * 7. FAQ - Accordion
 * 8. CTA - Call to Action
 * 9. (Header & Footer via layout)
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { 
  FilePlus, RotateCcw, Copy, ArrowUpCircle, Globe, Tractor, Clock, GraduationCap,
  UserCheck, Activity, BookOpen, FileText, Car, ShieldCheck,
  Bike, Car as CarIcon, Bus, Truck, HardHat, Tractor as TractorIcon,
  Zap, Shield, HeadphonesIcon, MapPin, Smartphone, Bell,
  Users, MapPin as MapPinIcon, Clock as ClockIcon, UserCheck as UserCheckIcon,
  Plus, Minus, HelpCircle,
  ArrowRight, ChevronLeft, CheckCircle2,
  FileText as FileTextIcon, Search, ShieldCheck as ShieldCheckIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// RTL SUPPORT HOOK
// ============================================
function useRTL() {
  const [dir, setDir] = useState<'rtl' | 'ltr'>('rtl');
  
  useEffect(() => {
    const saved = localStorage.getItem('mojaz-locale') || 'ar';
    setDir(saved === 'ar' ? 'rtl' : 'ltr');
  }, []);
  
  return dir;
}

// ============================================
// COUNTER ANIMATION COMPONENT
// ============================================
function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = { current: null };
  const isInView = useInView(ref, { once: true });
  const spring = useSpring(0, { stiffness: 20, damping: 15 });
  
  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, spring, value]);
  
  return (
    <motion.span
      ref={ref as any}
      className="tabular-nums"
    >
      {Math.round(count).toLocaleString()}
    </motion.span>
  );
}

// ============================================
// SCROLL REVEAL ANIMATION
// ============================================
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

// ============================================
// SECTION 1: HERO
// ============================================
function HeroSection() {
  const isRTL = useRTL() === 'rtl';
  
  return (
    <section 
      className="relative overflow-hidden min-h-[90vh] flex items-center justify-center bg-[#1E3A8A] pt-20 pb-16"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A] via-[#1a337a] to-[#162b66]" />
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
          style={{ 
            backgroundImage: "url('/noise.svg')",
          }} 
        />
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4A017]/5 rounded-full blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <motion.div 
          className="max-w-4xl mx-auto text-center space-y-10"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={staggerItem}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-secondary-500 text-sm font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>الجمهورية اليمنية • الإدارة العامة للمرور</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            variants={staggerItem}
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.15]"
          >
            منصة{" "}
            <span className="text-secondary-500">مُجاز</span>
            <br />
            <span className="text-xl md:text-3xl lg:text-4xl text-white/70 font-bold">
              بوابة رخص القيادة الإلكترونية
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={staggerItem}
            className="text-lg md:text-xl text-neutral-100/80 max-w-2xl mx-auto"
          >
            النظام الرسمي الموحد لإصدار وتجديد رخص القيادة. أنجز معاملتك إلكترونياً بأمان تام وسرعة سيادية.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={staggerItem} className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/register">
              <motion.button
                className="inline-flex items-center gap-3 px-8 h-14 bg-[#D4A017] hover:bg-[#C49000] text-neutral-900 font-bold rounded-xl transition-all shadow-lg shadow-[#D4A017]/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>ابدأ الآن</span>
                <ArrowRight className={cn("w-5 h-5", isRTL && "rtl:rotate-180")} />
              </motion.button>
            </Link>
            <Link href="/login">
              <motion.button
                className="inline-flex items-center gap-3 px-8 h-14 border border-white/20 bg-white/5 text-white hover:bg-white/10 font-bold rounded-xl transition-all backdrop-blur-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="w-5 h-5" />
                <span>متابعة طلب موجود</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div variants={staggerItem} className="pt-8 flex flex-wrap items-center justify-center gap-8 text-white/40 text-sm">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>دعم اللغة العربية</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>موثق رقمياً</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px]">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113,2,1200,34.74V0Z" className="fill-neutral-50" />
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" className="fill-[#1E3A8A]" />
        </svg>
      </div>
    </section>
  );
}

// ============================================
// SECTION 2: SERVICES GRID
// ============================================
function ServicesSection() {
  const services = [
    { id: "new", icon: FilePlus, title: "رخصة جديدة", desc: "إصدار رخصة قيادة لأول مرة", href: "/register" },
    { id: "renewal", icon: RotateCcw, title: "تجديد رخصة", desc: "تجديد رخصة القيادة المنتهية", href: "/register" },
    { id: "replacement", icon: Copy, title: "بدل فاقد/تالف", desc: "إصدار بدل فاقد أو تالف", href: "/register" },
    { id: "upgrade", icon: ArrowUpCircle, title: "ترقية رخصة", desc: "ترقية ف��ة رخصة القيادة", href: "/register" },
    { id: "international", icon: Globe, title: "رخصة دولية", desc: "استخراج رخصة القيادة الدولية", href: "/register" },
    { id: "agricultural", icon: Tractor, title: "المركبات الزراعية", desc: "رخص المعدات الزراعية", href: "/register" },
    { id: "probationary", icon: Clock, title: "رخصة مؤقتة", desc: "إدارة مسارات السائقين الجدد", href: "/register" },
    { id: "learner", icon: GraduationCap, title: "تصريح تعلم", desc: "تصريح ممارسة القيادة", href: "/register" },
  ];

  return (
    <section id="services" className="py-32 bg-[#f8fafc]">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20 space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 text-primary-600 text-xs font-bold tracking-widest border border-primary-500/20">
            خدماتنا الإلكترونية
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-primary-600">
            الخدمات المرورية الشاملة
          </h2>
          <p className="text-lg text-neutral-500 font-medium max-w-2xl mx-auto">
            بوابة الإدارة العامة للمرور لتسهيل كافة إجراءات رخص القيادة عبر رحلة رقمية متكاملة.
          </p>
          <div className="w-24 h-1.5 bg-secondary-500 rounded-full mx-auto" />
        </motion.div>

        {/* Service Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div key={service.id} variants={staggerItem}>
                <Link 
                  href={service.href}
                  className="group relative block h-full p-10 bg-white border border-neutral-100 rounded-[2.5rem] transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(26,58,143,0.1)] hover:-translate-y-2 overflow-hidden"
                >
                  {/* Hover Accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/[0.02] rounded-bl-[100%] transition-all duration-500 group-hover:scale-150 group-hover:bg-primary-500/[0.05]" />
                  
                  <div className="relative z-10 space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 group-hover:bg-primary-500 group-hover:text-white transition-all duration-500 shadow-sm">
                      <Icon className="w-8 h-8" />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-2xl font-black text-neutral-900 leading-tight">
                        {service.title}
                      </h3>
                      <p className="text-neutral-500 text-sm leading-relaxed">
                        {service.desc}
                      </p>
                    </div>

                    <div className="pt-6 flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-widest text-neutral-400 group-hover:text-secondary-500 transition-colors">ابدأ الآن</span>
                      <div className="w-10 h-10 rounded-full border border-neutral-100 flex items-center justify-center text-neutral-300 group-hover:border-primary-500 group-hover:text-primary-500 transition-all duration-500">
                        <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 3: WORKFLOW TIMELINE
// ============================================
function WorkflowSection() {
  const steps = [
    { id: 1, icon: UserCheck, title: "إنشاء الحساب", desc: "التسجيل وتفعيل الحساب.", color: "#1a3a8f" },
    { id: 2, icon: FileText, title: "تقديم الطلب", desc: "اختيار الخدمة وتعبئة البيانات.", color: "#1e4db7" },
    { id: 3, icon: Activity, title: "الفحص الطبي", desc: "إجراء الفحوصات في المراكز المعتمدة.", color: "#D4A017" },
    { id: 4, icon: BookOpen, title: "مدرسة القيادة", desc: "الالتحق ببرامج تدريب.", color: "#0f766e" },
    { id: 5, icon: Car, title: "الاختبارات", desc: "النظري والعملي.", color: "#c2410c" },
    { id: 6, icon: ShieldCheck, title: "إصدار الرخصة", desc: "رقمياً وميدانياً فوراً.", color: "#7c3aed" },
  ];

  return (
    <section id="workflow" className="py-20 bg-[#1E3A8A] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url('/noise.svg')" }} />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <motion.h2 
            className="text-3xl md:text-5xl font-bold tracking-tight text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            رحلتك نحو الرخصة
          </motion.h2>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-10 left-0 w-full h-0.5 bg-white/10" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div 
                  key={step.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex flex-col items-center text-center space-y-6 group"
                >
                  <div 
                    className="relative z-10 w-20 h-20 rounded-full bg-white/5 border-4 border-white/10 flex items-center justify-center text-white transition-all duration-500 group-hover:bg-secondary-500 group-hover:border-secondary-500/30 shadow-2xl"
                    style={{ boxShadow: `0 0 30px ${step.color}40` }}
                  >
                    <Icon className="w-8 h-8" />
                    <div 
                      className="absolute -top-1 -right-1 w-8 h-8 rounded-full text-neutral-900 text-xs font-bold flex items-center justify-center border-2 border-[#1E3A8A]"
                      style={{ backgroundColor: step.color }}
                    >
                      {step.id}
                    </div>
                  </div>

                  <div className="space-y-2 px-4">
                    <h3 className="text-xl font-bold text-white">
                      {step.title}
                    </h3>
                    <p className="text-white/60 text-sm">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div 
          className="mt-20 pt-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link 
            href="/register"
            className="inline-flex items-center gap-3 px-8 h-14 bg-white text-primary-600 font-bold rounded-xl hover:bg-neutral-100 transition-all shadow-lg"
          >
            ابدأ رحلتك الآن
            <ArrowRight className="w-5 h-5 rtl:rotate-180" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 4: LICENSE CATEGORIES
// ============================================
function CategoriesSection() {
  const categories = [
    { code: "A", icon: Bike, name: "دراجة نارية", age: "16+", color: "#0f766e" },
    { code: "B", icon: CarIcon, name: "سيارة خصوصي", age: "18+", color: "#1a3a8f" },
    { code: "C", icon: Bus, name: "نقل متوسط", age: "21+", color: "#c2410c" },
    { code: "D", icon: Truck, name: "نقل عام", age: "21+", color: "#7c3aed" },
    { code: "E", icon: HardHat, name: "نقل ثقيل", age: "21+", color: "#b45309" },
    { code: "F", icon: TractorIcon, name: "آلات زراعية", age: "18+", color: "#0369a1" },
  ];

  return (
    <section id="categories" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 px-4">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-primary-600">
              فئات الرخص المتاحة
            </h2>
            <p className="text-neutral-500 font-medium uppercase tracking-widest text-xs">
              نظام التصنيف الموحد • الجمهورية اليمنية
            </p>
          </div>
          <div className="h-1.5 w-32 bg-secondary-500 rounded-full hidden md:block" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div 
                key={cat.code}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group relative p-10 bg-neutral-50 border border-neutral-100 rounded-[2.5rem] transition-all duration-500 hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(26,58,143,0.12)]"
              >
                <div className="flex justify-between items-start mb-10">
                  <div 
                    className="w-20 h-20 rounded-3xl bg-white border border-neutral-100 flex items-center justify-center text-primary-600 group-hover:text-white transition-all duration-500 transform group-hover:-rotate-6 shadow-sm shadow-primary-500/20"
                    style={{ 
                      backgroundColor: cat.color,
                      boxShadow: `0 20px 40px -10px ${cat.color}50`
                    }}
                  >
                    <Icon className="w-10 h-10" />
                  </div>
                  <span className="text-6xl font-black text-neutral-200 group-hover:text-primary-500/10 transition-colors">
                    {cat.code}
                  </span>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-neutral-900">
                    {cat.name}
                  </h3>
                  
                  <div className="pt-4 flex items-center gap-4">
                    <div 
                      className="px-4 py-2 rounded-xl bg-white border border-neutral-100 text-xs font-black shadow-sm"
                      style={{ color: cat.color }}
                    >
                      السن {cat.age} عاماً
                    </div>
                    <div className="h-px flex-1 bg-neutral-100" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 5: FEATURES
// ============================================
function FeaturesSection() {
  const features = [
    { id: "f1", icon: Zap, title: "سرعة الإجراءات", desc: "إنجاز المعاملات في وقت قياسي عبر أتمتة كاملة", color: "#D4A017" },
    { id: "f2", icon: Shield, title: "أمان وحماية", desc: "تشفير بياناتك وخصوصيتك بأحدث التقنيات الأمنية", color: "#1a3a8f" },
    { id: "f3", icon: HeadphonesIcon, title: "دعم متخصص", desc: "فريق دعم متخصص متاح على مدار الساعة", color: "#0f766e" },
    { id: "f4", icon: MapPin, title: "تغطية جغرافية", desc: "خدماتنا متوفرة في جميع المحافظات", color: "#c2410c" },
    { id: "f5", icon: Smartphone, title: "منصة ذكية", desc: "إدارة جميع بياناتك عبر واجهة متطورة", color: "#7c3aed" },
    { id: "f6", icon: Bell, title: "إشعارات فورية", desc: "نظام إشعارات ذكي يذكرك بالمواعيد", color: "#0369a1" },
  ];

  return (
    <section id="features" className="py-24 bg-neutral-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-12">
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-secondary-500 font-bold tracking-widest uppercase text-sm">
                خدمة تليق بتطلعاتكم
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
                لماذا منصة مُجاز؟
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div 
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="flex flex-col gap-4 group"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-all duration-300"
                    style={{ 
                      backgroundColor: `${feature.color}15`,
                      color: feature.color 
                    }}
                  >
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-neutral-900 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-neutral-500 text-sm leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div 
            className="relative group"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="aspect-square rounded-[40px] overflow-hidden bg-gradient-to-br from-[#1E3A8A] via-[#1a337a] to-[#162a63] p-1 shadow-2xl">
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/micro-carbon.png')" }} />
               
               <div className="relative w-full h-full bg-neutral-900/80 backdrop-blur-3xl rounded-[39px] flex flex-col items-center justify-center p-12 text-center text-white space-y-8">
                 <div className="relative">
                   <div className="absolute inset-0 bg-primary-500 blur-[80px] opacity-20" />
                   <ShieldCheck className="w-32 h-32 text-secondary-500 relative z-10" />
                 </div>
                 
                 <div className="space-y-4">
                   <h3 className="text-3xl font-bold tracking-tight">نظام آمن وموثوق</h3>
                   <p className="text-neutral-400 max-w-sm mx-auto">
                     حماية متقدمة لبياناتك وتشفير كامل للمعلومات الشخصية.
                   </p>
                 </div>

                 <div className="flex gap-4">
                   <div className="flex items-center gap-2 text-xs font-bold text-primary-400">
                     <CheckCircle2 className="w-4 h-4" />
                     <span>تشفير SSL آمن</span>
                   </div>
                   <div className="flex items-center gap-2 text-xs font-bold text-primary-400">
                     <CheckCircle2 className="w-4 h-4" />
                     <span>توثيق حكومي</span>
                   </div>
                 </div>
               </div>
            </div>

            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-6 -right-6 w-24 h-24 bg-secondary-500 rounded-3xl blur-[40px] opacity-20" 
            />
            <motion.div 
              animate={{ x: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary-500 rounded-full blur-[50px] opacity-20" 
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 6: STATS
// ============================================
function StatsSection() {
  const stats = [
    { id: 1, icon: Users, value: 150, suffix: "K+", label: "رخصة إلكترونية صادرة", color: "#1a3a8f" },
    { id: 2, icon: MapPinIcon, value: 55, suffix: "+", label: "مركز معتمد للخدمة", color: "#D4A017" },
    { id: 3, icon: ClockIcon, value: 15, suffix: "", label: "متوسط وقت المعالجة", color: "#1a3a8f" },
    { id: 4, icon: UserCheckIcon, value: 250, suffix: "K+", label: "طلب مكتمل بنجاح", color: "#D4A017" },
  ];

  return (
    <section className="relative py-32 overflow-hidden bg-[#0a0f1a]">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500 opacity-[0.05] blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-500 opacity-[0.05] blur-[120px] rounded-full" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div 
              key={stat.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative group p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div 
                  className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/5 border border-white/10 text-white shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                  style={{ boxShadow: `0 20px 40px -10px ${stat.color}40` }}
                >
                  <stat.icon className="w-10 h-10" style={{ color: stat.color }} />
                </div>
                
                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                    {stat.value.toLocaleString()}{stat.suffix}
                  </div>
                  <div className="text-xs md:text-sm font-medium uppercase tracking-[0.2em] text-neutral-500 group-hover:text-white transition-colors duration-500">
                    {stat.label}
                  </div>
                </div>
              </div>
              
              <div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[3px] rounded-full transition-all duration-500 group-hover:w-[40%]" 
                style={{ backgroundColor: stat.color }}
              />
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 flex flex-wrap justify-center items-center gap-8 md:gap-16 grayscale opacity-30"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6" />
            <span className="text-xs font-black uppercase tracking-widest text-white">نظام معتمد سيادياً</span>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6" />
            <span className="text-xs font-black uppercase tracking-widest text-white">التحول الرقمي الموحد</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 7: FAQ ACCORDION
// ============================================
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { id: 1, q: "كيف يمكنني التقديم على رخصة قيادة جديدة؟", a: "يمكنك البدء بالضغط على 'ابدأ الآن' في القسم الرئيسي واتباع خطوات التسجيل عبر المنصة بكل سهولة." },
    { id: 2, q: "ما هي الوثائق المطلوبة لتجديد الرخصة؟", a: "عادة ما يكتفي بوجود هوية وطنية سارية المفعول وتقرير طبي حديث من مراكز معتمدة مربوطة بالنظام." },
    { id: 3, q: "ماذا تشمل هذه النسخة الأولية من المنصة؟", a: "هذه النسخة (MVP) تركز على الخدمات الجوهرية كإصدار وتجديد الرخص وبدل الفاقد. تم تأجيل بعض المكونات الإضافية والخدمات المتقدمة للمرحلة الثانية لضمان أقصى درجات الاستقرار." },
    { id: 4, q: "كم تستغرق عملية الإصدار؟", a: "في حال اكتمال جميع المتطلبات واجتياز الاختبارات، يتم إصدار الرخصة رقمياً فوراً." },
    { id: 5, q: "كيف يتم سداد الرسوم؟", a: "توفر المنصة خيارات سداد رقمية متعددة تشمل المحافظ الإلكترونية والحوالات البنكية." },
  ];

  return (
    <section id="faq" className="py-24 bg-neutral-50">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900">
            الأسئلة الشائعة
          </h2>
          <div className="flex justify-center">
            <div className="h-1.5 w-12 bg-secondary-500 rounded-full" />
          </div>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div 
                key={faq.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07 }}
                className="border border-neutral-200 rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-start gap-4 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${isOpen ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-500'}`}>
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-primary-600' : 'text-neutral-900'}`}>
                      {faq.q}
                    </span>
                  </div>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-secondary-500 text-neutral-900 rotate-180' : 'bg-neutral-100 text-neutral-500'}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-2 text-neutral-600 leading-relaxed border-t border-neutral-100 mt-4 mx-6">
                        <p className="pt-4">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// SECTION 8: CTA
// ============================================
function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#081021]">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')" }} />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500 rounded-full blur-[160px] opacity-20" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary-500 rounded-full blur-[160px] opacity-10" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto rounded-[32px] overflow-hidden bg-gradient-to-br from-[#1E3A8A] to-[#162a63] p-8 md:p-16 text-center space-y-10 shadow-3xl border border-white/10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-secondary-500 text-sm font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>+100,000 مستخدم مستفيد</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.2]">
              جاهز للبدء؟
            </h2>
            <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              احصل على رخصتك الآن عبر منصة مُجاز الإلكترونية بكل سهولة وأمان.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/register">
              <motion.button
                className="inline-flex items-center gap-3 px-12 h-16 bg-secondary-500 hover:bg-secondary-600 text-neutral-900 font-bold rounded-2xl text-xl shadow-[0_0_30px_rgba(212,160,23,0.3)] transition-all hover:scale-105 active:scale-95"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                إنشاء حساب جديد
                <ArrowRight className="w-6 h-6 rtl:rotate-180" />
              </motion.button>
            </Link>
          </motion.div>

          <div className="pt-10 flex flex-wrap justify-center gap-8 text-white/40 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
              <span>معالجة فورية</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
              <span>تشفير بيانات آمن</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-500" />
              <span>متاح على مدار الساعة</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// MAIN LANDING PAGE
// ============================================
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Section 1: Hero */}
      <HeroSection />
      
      {/* Main Content */}
      <main className="flex-1">
        {/* Section 2: Services */}
        <ServicesSection />
        
        {/* Section 3: Workflow */}
        <WorkflowSection />
        
        {/* Section 4: Categories */}
        <CategoriesSection />
        
        {/* Section 5: Features */}
        <FeaturesSection />
        
        {/* Section 6: Stats */}
        <StatsSection />
        
        {/* Section 7: FAQ */}
        <FAQSection />
        
        {/* Section 8: CTA */}
        <CTASection />
      </main>
    </div>
  );
}