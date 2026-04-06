'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Car, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  UserCheck,
  CreditCard,
  History
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const t = useTranslations('public');

  const services = [
    { icon: Car, title: 'New License', ar: 'إصدار رخصة جديدة' },
    { icon: History, title: 'License Renewal', ar: 'تجديد رخصة القيادة' },
    { icon: CreditCard, title: 'Damage Replacement', ar: 'طلب بدل تالف' },
    { icon: ShieldCheck, title: 'License Verification', ar: 'التحقق من الرخصة' },
  ];

  const stats = [
    { label: 'Active Licenses', value: '4.2M+', icon: CheckCircle2 },
    { label: 'Approved Centers', value: '142', icon: MapPin },
    { label: 'Avg Processing', value: '18 min', icon: Clock },
    { label: 'Verified Citizens', value: '12M+', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-500 overflow-hidden">
      {/* ─── Hero Section ─── */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-20 lg:pt-32">
        <div className="absolute inset-0 bg-primary-900 dark:bg-primary-950">
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-primary-500/20 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-secondary-500/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/3 pointer-events-none"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col text-center lg:text-start space-y-8"
            >
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.2, duration: 0.5 }}
                 className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-card border-white/20 text-primary-100 font-bold tracking-widest text-xs uppercase self-center lg:self-start shadow-xl backdrop-blur-xl"
               >
                  <ShieldCheck className="w-4 h-4 text-secondary-400" />
                  <span className="opacity-90">Saudi Digital Transformation</span>
               </motion.div>
               
               <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black text-white leading-[1.05] tracking-tighter text-balance">
                  Mojaz <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary-400 to-primary-600 block mt-2">مُجاز</span>
               </h1>
               
               <p className="text-xl md:text-2xl text-primary-50 max-w-xl font-medium leading-relaxed opacity-80 text-balance">
                  The unified government platform for driving license management. 
               </p>
               
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.4, duration: 0.6 }}
                 className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4"
               >
                  <Link 
                    href="/register" 
                    className={cn(
                      "group h-16 px-10 rounded-2xl bg-white text-primary-900 font-black text-lg flex items-center justify-center gap-3 shadow-[0_20px_40px_-15px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                    )}
                  >
                    Start Now — ابدأ
                    <ArrowRight className="w-5 h-5 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    href="/login"
                    className={cn(
                      "h-16 px-10 rounded-2xl border border-white/20 bg-white/5 text-white hover:bg-white/10 font-bold backdrop-blur-md flex items-center justify-center transition-colors"
                    )}
                  >
                    Login — تسجيل الدخول
                  </Link>
               </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
              className="w-full max-w-2xl mx-auto lg:mx-0 relative perspective-[1000px]"
            >
               <div className="absolute -inset-4 bg-gradient-to-tr from-secondary-400 to-primary-600 rounded-[3rem] blur-2xl opacity-30 animate-pulse"></div>
               <div className="relative glass-card bg-white/10 dark:bg-black/20 rounded-[2.5rem] overflow-hidden aspect-[4/3] flex flex-col justify-center items-center p-12 border-white/20 dark:border-white/10 shadow-2xl transform-gpu hover:rotate-y-12 transition-transform duration-700 ease-out">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="w-28 h-28 bg-white dark:bg-neutral-900 rounded-3xl flex items-center justify-center shadow-2xl z-10 border border-primary-100 dark:border-neutral-800"
                  >
                     <Car className="w-14 h-14 text-primary-500" />
                  </motion.div>
                  <div className="text-center mt-8 z-10">
                    <h3 className="text-4xl font-black text-white tracking-tight text-balance mb-3">Smart Digital Licensing</h3>
                    <p className="text-primary-100 font-medium opacity-80 uppercase tracking-widest text-sm">Verified via Absher</p>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Services Grid ─── */}
      <section className="py-32 relative z-20">
         <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-20">
               <div className="space-y-4 max-w-2xl">
                  <h2 className="text-5xl md:text-6xl font-black text-neutral-900 dark:text-white tracking-tighter leading-none text-balance">Digital Services</h2>
                  <p className="text-xl text-neutral-500 dark:text-neutral-400 font-medium">Streamlined processes for the modern Saudi citizen.</p>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {services.map((s, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true, margin: "-100px" }}
                   transition={{ delay: i * 0.1, duration: 0.6 }}
                 >
                   <Card className="h-full border-neutral-200/50 dark:border-neutral-800/50 shadow-sm hover:shadow-2xl rounded-3xl overflow-hidden hover:-translate-y-2 transition-all duration-300 group bg-white dark:bg-neutral-900 relative">
                      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-5 transition-opacity duration-500 rotate-12 scale-150">
                        <s.icon className="w-32 h-32 text-primary-500" />
                      </div>
                      <CardContent className="p-8 space-y-6 relative z-10 h-full flex flex-col">
                         <div className="w-14 h-14 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center group-hover:bg-primary-500 group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-[0_10px_20px_-10px_rgba(0,108,53,0.5)]">
                            <s.icon className="w-7 h-7 text-neutral-700 dark:text-neutral-300 group-hover:text-white" />
                         </div>
                         <div className="mt-auto">
                            <h4 className="text-xl font-bold text-neutral-900 dark:text-white leading-tight mb-2 tracking-tight transition-colors">{s.title}</h4>
                            <div className="text-lg font-black text-neutral-300 dark:text-neutral-700 uppercase tracking-widest">{s.ar}</div>
                         </div>
                      </CardContent>
                   </Card>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* ─── Stats / Impact ─── */}
      <section className="py-24 bg-neutral-900 dark:bg-black text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-20"></div>
         <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
               {stats.map((stat, i) => (
                 <motion.div 
                   key={i} 
                   initial={{ opacity: 0, scale: 0.9 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.1, duration: 0.5 }}
                   className="text-center lg:text-start flex flex-col items-center lg:items-start group"
                 >
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:bg-primary-500/20 group-hover:border-primary-500/30 transition-colors">
                       <stat.icon className="w-8 h-8 text-secondary-400 group-hover:text-secondary-300" />
                    </div>
                    <div className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-3 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">{stat.value}</div>
                    <div className="text-sm font-bold text-neutral-400 uppercase tracking-[0.2em]">{stat.label}</div>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-32">
         <div className="container mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/30 rounded-[3rem] md:rounded-[4rem] p-12 md:p-24 text-center space-y-10 relative overflow-hidden"
            >
               <h2 className="text-5xl md:text-7xl font-black text-primary-900 dark:text-white tracking-tighter text-balance">Ready for the road?</h2>
               <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto font-medium text-balance">Join millions of citizens managing their credentials on a smarter, faster platform.</p>
               <Link 
                  href="/register"
                  className={cn(
                    "inline-flex h-20 px-12 sm:px-16 rounded-[2rem] bg-primary-600 hover:bg-primary-700 text-white font-black text-xl sm:text-2xl items-center justify-center gap-4 shadow-2xl hover:scale-[1.05] active:scale-95 transition-all uppercase tracking-wide"
                  )}
                >
                  Create Account
                  <ArrowRight className="w-6 h-6 rtl:rotate-180" />
               </Link>
            </motion.div>
         </div>
      </section>
    </div>
  );
}
