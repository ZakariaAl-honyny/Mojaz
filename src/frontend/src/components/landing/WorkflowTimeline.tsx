'use client';

import { motion } from 'framer-motion';
import {
  UserPlus, FileText, FileCheck, Stethoscope,
  ClipboardCheck, Award, ArrowLeft
} from "lucide-react";
import Link from 'next/link';

const steps = [
  { icon: UserPlus,       num: "١", title: "إنشاء الحساب",       desc: "التسجيل باستخدام الرقم الوطني وتفعيل الحساب عبر رسالة نصية آمنة.", color: "#1a3a8f" },
  { icon: FileText,       num: "٢", title: "تقديم الطلب",        desc: "اختيار الخدمة وتعبئة البيانات ورفع المستندات رقمياً بخطوات بسيطة.", color: "#1e4db7" },
  { icon: FileCheck,      num: "٣", title: "مراجعة المستندات",   desc: "يراجع فريقنا طلبك والتحقق من صحة المستندات المرفقة بوقت قياسي.", color: "#D4A017" },
  { icon: Stethoscope,    num: "٤", title: "الفحص الطبي",        desc: "إجراء الفحوصات الطبية في المراكز المعتمدة وإرسال النتائج للنظام آلياً.", color: "#0f766e" },
  { icon: ClipboardCheck, num: "٥", title: "الاختبارات المرورية", desc: "حجز موعد وأداء الاختبارات النظرية والعملية بحسب فئة الرخصة المطلوبة.", color: "#c2410c" },
  { icon: Award,          num: "٦", title: "إصدار الرخصة",       desc: "بعد اجتياز كافة المراحل تُصدر الرخصة رقمياً وميدانياً فوراً.", color: "#7c3aed" },
];

export default function WorkflowTimeline() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-white font-arabic" dir="rtl">
      <div className="container mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="space-y-4 max-w-xl">
            <motion.span
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full bg-[#1a3a8f]/8 text-[#1a3a8f] text-xs font-bold tracking-widest border border-[#1a3a8f]/15"
            >
              خطوة بخطوة
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="text-3xl md:text-4xl font-black text-[#0f1e4a] tracking-tight leading-snug text-start"
            >
              كيف تحصل على
              <br />
              <span className="text-[#1a3a8f]">رخصتك الرقمية؟</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-base text-neutral-500 font-semibold max-w-sm leading-relaxed border-s-2 border-[#D4A017] ps-4 text-start"
          >
            قمنا بتبسيط الإجراءات الحكومية في خطوات واضحة وشفافة تضمن لك السرعة والدقة.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* connecting line (desktop) */}
          <div className="hidden lg:block absolute top-12 right-[calc(8.33%+24px)] left-[calc(8.33%+24px)] h-px bg-border z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  className="group flex flex-col items-center lg:items-start text-center lg:text-start"
                >
                  {/* Icon circle */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-5 shadow-md group-hover:scale-110 transition-transform duration-300 shrink-0"
                    style={{ backgroundColor: step.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  {/* Step number */}
                  <span className="text-xs font-black text-neutral-300 mb-1.5 tracking-widest text-start">
                    الخطوة {step.num}
                  </span>
                  <h3 className="text-sm font-black text-neutral-800 mb-2 group-hover:text-[#1a3a8f] transition-colors text-start">
                    {step.title}
                  </h3>
                  <p className="text-xs text-neutral-400 font-semibold leading-relaxed text-start">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Action */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 flex justify-center"
        >
          <Link
            href="/register"
            className="inline-flex items-center gap-3 px-7 py-3.5 bg-[#1a3a8f] text-white rounded-lg text-sm font-bold hover:bg-[#152d6f] transition-colors shadow-md shadow-[#1a3a8f]/20 group"
          >
            ابدأ رحلتك الآن
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
