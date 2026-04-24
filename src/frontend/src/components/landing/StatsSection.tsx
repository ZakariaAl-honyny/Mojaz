'use client';

import { motion } from 'framer-motion';
import { Users, FileCheck, Star, Clock } from 'lucide-react';

const stats = [
  { icon: FileCheck, value: '١٥٠٬٠٠٠+', label: "رخصة صادرة",       color: "#1a3a8f" },
  { icon: Users,     value: '٥٠٬٠٠٠+',  label: "مستخدم نشط",      color: "#D4A017" },
  { icon: Star,      value: '٩٨٪',       label: "نسبة رضا المرخصين", color: "#0f766e" },
  { icon: Clock,     value: '٣ دقائق',   label: "متوسط وقت التقديم", color: "#7c3aed" },
];

export default function StatsSection() {
  return (
    <section
      className="py-20 lg:py-28 font-arabic relative overflow-hidden"
      dir="rtl"
      style={{ background: "linear-gradient(135deg, #0f1e4a 0%, #1a3a8f 60%, #1e4db7 100%)" }}
    >
      {/* Subtle pattern */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-400/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#D4A017]/8 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-14 space-y-3">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-[#D4A017] text-xs font-bold tracking-widest border border-white/15"
          >
            أرقام وإنجازات
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-3xl md:text-4xl font-black text-white tracking-tight"
          >
            مسيرة التحول الرقمي في{" "}
            <span className="text-[#D4A017]">أرقام</span>
          </motion.h2>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group p-7 rounded-xl bg-white/8 border border-white/12 backdrop-blur-sm hover:bg-white/12 hover:border-white/20 transition-all duration-300 text-center"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: `${stat.color}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <div className="text-3xl md:text-4xl font-black text-white mb-2 group-hover:text-[#D4A017] transition-colors duration-300">
                  {stat.value}
                </div>
                <p className="text-sm text-blue-100/60 font-semibold">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
