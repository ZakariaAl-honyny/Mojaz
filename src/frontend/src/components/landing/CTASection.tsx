'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ArrowLeft, Zap } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden font-arabic" dir="rtl">
      {/* Background container with rounded corners and gradient */}
      <div className="container mx-auto px-6 lg:px-12">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0f1e4a] p-12 md:p-20 lg:p-24 shadow-2xl">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#1a3a8f_0%,_transparent_70%)]" />
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30h30v30H30z' fill='white'/%3E%3C/svg%3E")`,
            }} 
          />
          
          {/* Glow effects */}
          <div className="absolute top-0 left-0 w-80 h-80 bg-[#D4A017]/10 blur-[100px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/10 blur-[100px] translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10 flex flex-col items-center text-center space-y-10">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/15"
            >
              <Zap className="w-8 h-8 text-[#D4A017] fill-[#D4A017]" />
            </motion.div>

            <div className="space-y-6 max-w-4xl">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight"
              >
                جاهز لبدء رحلتك مع <br />
                <span className="text-[#D4A017]">نظام مُجاز الحديث؟</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg md:text-xl text-blue-100/60 font-semibold leading-relaxed max-w-2xl mx-auto"
              >
                انضم إلى آلاف السائقين الذين استفادوا من خدماتنا الإلكترونية. وفر وقتك وجهدك وابدأ معاملتك الآن بضغطة زر.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link href="/register" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:h-14 sm:px-10 bg-white text-[#1a3a8f] hover:bg-neutral-100 rounded-xl text-lg font-bold shadow-xl transition-all duration-300 gap-3 group"
                >
                  سجل الآن مجاناً
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link href="/contact" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full sm:h-14 sm:px-10 border-white/20 text-white hover:bg-white/5 rounded-xl text-lg font-bold transition-all duration-300"
                >
                  تواصل معنا
                </Button>
              </Link>
            </motion.div>

            {/* Shield badge */}
            <div className="pt-8 flex items-center gap-3 opacity-40">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-[10px] text-white font-black tracking-[0.2em] uppercase">نظام سيادي محمي ومشفر بالكامل</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
