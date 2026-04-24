'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Search, ShieldCheck, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const trustBadges = [
  "معتمد رسمياً من الإدارة العامة للمرور",
  "تشفير TLS 1.3 الحكومي",
  "خدمة على مدار الساعة",
];

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden font-arabic border-b border-white/5"
      dir="rtl"
      style={{ background: "linear-gradient(135deg, #0f1e4a 0%, #1a3a8f 55%, #1e4db7 100%)" }}
    >
      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-6 md:px-12 py-16 md:py-24 lg:py-32 relative z-10">
        <div className="max-w-4xl mx-auto md:mx-0">
          {/* Official badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 mb-8 md:mb-10 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4A017] shrink-0" />
            <span className="text-white/70 text-[10px] md:text-xs font-bold tracking-wider uppercase">
              وزارة الداخلية · الإدارة العامة للمرور
            </span>
          </motion.div>

          <div className="space-y-6 md:space-y-8">
            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]"
            >
              منصة{" "}
              <span className="text-[#D4A017] inline-block">مُجاز</span>
              <br />
              <span className="text-white/60 font-black text-2xl md:text-4xl lg:text-5xl">
                بوابة رخص القيادة الإلكترونية
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-base md:text-lg text-blue-100/60 font-semibold max-w-xl leading-relaxed"
            >
              النظام الرسمي الموحد لإصدار وتجديد رخص القيادة. أنجز معاملتك إلكترونياً بأمان تام وسرعة سيادية.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pt-2"
            >
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  className="w-full sm:w-auto h-12 md:h-14 px-8 bg-[#D4A017] hover:bg-[#b88a12] text-white rounded-xl text-base font-black shadow-lg shadow-[#D4A017]/20 transition-all gap-3 group"
                >
                  <FileText className="h-5 w-5" />
                  ابدأ تقديم الطلب
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto h-12 md:h-14 px-8 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 rounded-xl text-base font-black transition-all gap-3 backdrop-blur-sm shadow-inner"
                >
                  <Search className="h-5 w-5" />
                  متابعة طلب موجود
                </Button>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3 pt-6 md:pt-8"
            >
              {trustBadges.map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/60 shrink-0" />
                  {badge}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Wave Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4A017]/30 to-transparent" />
    </section>
  );
}
