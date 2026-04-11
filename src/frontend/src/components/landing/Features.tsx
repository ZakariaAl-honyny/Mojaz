'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { 
  Zap, 
  Lock, 
  Smartphone, 
  Globe, 
  ShieldCheck, 
  Users 
} from 'lucide-react';

const features = [
  { icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { icon: ShieldCheck, color: 'text-primary-500', bg: 'bg-primary-500/10' },
  { icon: Smartphone, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { icon: Lock, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { icon: Users, color: 'text-rose-500', bg: 'bg-rose-500/10' }
];

export default function Features() {
  // Use generic translations or add specifically
  const t = useTranslations('landing.hero');

  return (
    <section className="py-24 bg-white dark:bg-neutral-950">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-primary-600 font-bold uppercase tracking-widest text-sm"
            >
              لماذا تختار مُجاز؟
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-neutral-900 dark:text-white leading-[1.1]"
            >
              منصة رقمية متكاملة <br /> تضع المواطن أولاً
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-neutral-500 dark:text-neutral-400 text-lg leading-relaxed max-w-xl"
            >
              قمنا بتصميم مُجاز لتكون الحل الأمثل والوحيد لإدارة كل ما يتعلق برخص القيادة في المملكة، مع التركيز على السرعة، الأمان، وسهولة الاستخدام.
            </motion.p>
          </div>

          <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[2rem] border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 hover:bg-white dark:hover:bg-neutral-900 transition-all duration-300 hover:shadow-xl group"
              >
                <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center ${feature.color} mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">مميزات ذكية</h4>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">نظام متطور يضمن دقة البيانات وسلاسة الإجراءات الحكومية.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
