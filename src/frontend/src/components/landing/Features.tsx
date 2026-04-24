'use client';

import { motion } from 'framer-motion';
import { Zap, Shield, HeadphonesIcon, MapPin, Smartphone, Bell } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: "سرعة الإجراءات",
    desc: "إنجاز المعاملات في وقت قياسي عبر أتمتة كاملة للعمليات الحكومية",
    color: "#D4A017",
  },
  {
    icon: Shield,
    title: "أمان وحماية",
    desc: "تشفير بياناتك وخصوصيتك بأحدث التقنيات الأمنية الحكومية المعتمدة",
    color: "#1a3a8f",
  },
  {
    icon: HeadphonesIcon,
    title: "دعم متخصص",
    desc: "فريق دعم متخصص متاح على مدار الساعة لمساعدتك في كافة الخطوات",
    color: "#0f766e",
  },
  {
    icon: MapPin,
    title: "تغطية جغرافية",
    desc: "خدماتنا متوفرة في جميع المحافظات عبر شبكة واسعة من المراكز المعتمدة",
    color: "#c2410c",
  },
  {
    icon: Smartphone,
    title: "منصة ذكية",
    desc: "إدارة جميع بياناتك ومعاملاتك عبر واجهة مستخدم متطورة وسهلة الاستخدام",
    color: "#7c3aed",
  },
  {
    icon: Bell,
    title: "إشعارات فورية",
    desc: "نظام إشعارات ذكي يذكرك بمواعيد التجديد والاختبارات والمستجدات",
    color: "#0369a1",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-white font-arabic" dir="rtl">
      <div className="container mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <div className="space-y-4 max-w-xl">
            <motion.span
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full bg-[#1a3a8f]/8 text-[#1a3a8f] text-xs font-bold tracking-widest border border-[#1a3a8f]/15"
            >
              مزايا المنصة
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="text-3xl md:text-4xl font-black text-[#0f1e4a] tracking-tight leading-snug"
            >
              لماذا منصة{" "}
              <span className="text-[#1a3a8f]">مُجاز؟</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-base text-neutral-500 font-semibold max-w-sm leading-relaxed"
          >
            صُممت المنصة لتكون الشريك الرقمي الأمثل للمواطن — أدوات ذكية تضمن الكفاءة والأمان والسهولة.
          </motion.p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                className="group p-7 rounded-xl bg-card border border-border hover:border-[#1a3a8f]/25 hover:shadow-lg hover:shadow-[#1a3a8f]/6 transition-all duration-300 relative overflow-hidden"
              >
                {/* Subtle hover accent */}
                <div
                  className="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ backgroundColor: `${feature.color}10` }}
                />

                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center text-white mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300 relative z-10"
                  style={{ backgroundColor: feature.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-base font-black text-neutral-900 mb-2.5 group-hover:text-[#1a3a8f] transition-colors relative z-10">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-400 font-semibold leading-relaxed relative z-10">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
