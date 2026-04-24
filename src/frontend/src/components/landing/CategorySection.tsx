'use client';

import { motion } from 'framer-motion';
import { Bike, Car, Truck, Bus, Container } from "lucide-react";

const categories = [
  { icon: Bike,      letter: "أ",  name: "دراجة نارية",  age: "١٦ سنة فأكثر", color: "#0f766e" },
  { icon: Car,       letter: "ب",  name: "سيارة خصوصي", age: "١٨ سنة فأكثر", color: "#1a3a8f" },
  { icon: Truck,     letter: "ج",  name: "نقل متوسط",   age: "٢١ سنة فأكثر", color: "#c2410c" },
  { icon: Bus,       letter: "د",  name: "نقل عام",      age: "٢١ سنة فأكثر", color: "#7c3aed" },
  { icon: Container, letter: "هـ", name: "نقل ثقيل",    age: "٢١ سنة فأكثر", color: "#b45309" },
];

export default function CategorySection() {
  return (
    <section id="categories" className="py-20 lg:py-28 bg-background font-arabic" dir="rtl">
      <div className="container mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="mb-14 text-center space-y-3">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-[#1a3a8f]/8 text-[#1a3a8f] text-xs font-bold tracking-widest border border-[#1a3a8f]/15"
          >
            فئات الرخصة
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-3xl md:text-4xl font-black text-[#0f1e4a] tracking-tight"
          >
            اختر الفئة المناسبة لاحتياجك
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.14 }}
            className="text-base text-neutral-500 font-semibold max-w-lg mx-auto"
          >
            نقدم خدماتنا لجميع فئات رخص القيادة المعتمدة في الجمهورية اليمنية
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.93, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                className="group flex flex-col items-center p-6 rounded-xl bg-card border border-border hover:border-[#1a3a8f]/25 hover:shadow-lg hover:shadow-[#1a3a8f]/6 transition-all duration-300 text-center cursor-default"
              >
                {/* Letter badge */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-black mb-4 shadow-md group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.letter}
                </div>

                {/* Vehicle icon area */}
                <div className="w-16 h-16 rounded-xl bg-neutral-50 border border-border flex items-center justify-center mb-4 group-hover:bg-white transition-colors">
                  <Icon
                    className="w-8 h-8 transition-colors duration-300"
                    style={{ color: cat.color }}
                  />
                </div>

                <h3 className="text-sm font-black text-neutral-900 mb-2 group-hover:text-[#1a3a8f] transition-colors">
                  {cat.name}
                </h3>
                <span className="inline-block px-3 py-1 rounded-full bg-neutral-100 text-neutral-500 text-xs font-bold group-hover:bg-[#1a3a8f]/8 group-hover:text-[#1a3a8f] transition-colors">
                  {cat.age}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
