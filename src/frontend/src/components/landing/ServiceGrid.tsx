'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FileText, RefreshCw, FileX2, ArrowUpCircle,
  Globe, FileSearch, Calendar, Smartphone, ChevronLeft
} from "lucide-react";

const services = [
  { icon: FileText,      title: "رخصة جديدة",        desc: "إصدار رخصة قيادة لأول مرة", href: "/register" },
  { icon: RefreshCw,     title: "تجديد رخصة",        desc: "تجديد رخصة القيادة المنتهية", href: "/register" },
  { icon: FileX2,        title: "بدل فاقد/تالف",     desc: "إصدار بدل فاقد أو تالف", href: "/register" },
  { icon: ArrowUpCircle, title: "ترقية رخصة",        desc: "ترقية فئة رخصة القيادة", href: "/register" },
  { icon: Globe,         title: "رخصة دولية",        desc: "استخراج رخصة القيادة الدولية", href: "/register" },
  { icon: FileSearch,    title: "استعلام عن رخصة",   desc: "التحقق من بيانات وصلاحية الرخصة", href: "/login" },
  { icon: Calendar,      title: "حجز موعد",          desc: "حجز موعد للاختبار أو المراجعة", href: "/login" },
  { icon: Smartphone,    title: "الرخصة الرقمية",    desc: "عرض الرخصة عبر التطبيق الذكي", href: "/login" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function ServiceGrid() {
  return (
    <section id="services" className="py-20 lg:py-28 bg-white font-arabic" dir="rtl">
      <div className="container mx-auto px-6 lg:px-12">

        {/* Section header */}
        <div className="mb-14 text-center space-y-3">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-[#1a3a8f]/8 text-[#1a3a8f] text-xs font-bold tracking-widest border border-[#1a3a8f]/15"
          >
            خدماتنا الإلكترونية
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-3xl md:text-4xl font-black text-[#0f1e4a] tracking-tight"
          >
            كل الخدمات المرورية في مكان واحد
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.14 }}
            className="text-base text-neutral-500 font-semibold max-w-xl mx-auto"
          >
            منظومة رقمية متكاملة لإنجاز جميع معاملات رخص القيادة بسهولة وأمان
          </motion.p>
        </div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div key={index} variants={item}>
                <Link
                  href={service.href}
                  className="group flex flex-col h-full p-6 rounded-xl bg-card border border-border hover:border-[#1a3a8f]/30 hover:shadow-lg hover:shadow-[#1a3a8f]/6 transition-all duration-300"
                >
                  {/* Icon */}
                  <div className="mb-5 w-12 h-12 flex items-center justify-center rounded-lg bg-[#1a3a8f]/8 text-[#1a3a8f] group-hover:bg-[#1a3a8f] group-hover:text-white transition-all duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  {/* Text */}
                  <h3 className="text-base font-black text-neutral-900 mb-1.5 group-hover:text-[#1a3a8f] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-neutral-400 font-semibold leading-relaxed flex-1">
                    {service.desc}
                  </p>
                  {/* CTA */}
                  <div className="mt-4 flex items-center gap-1.5 text-[#1a3a8f] text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>الانتقال للخدمة</span>
                    <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
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
