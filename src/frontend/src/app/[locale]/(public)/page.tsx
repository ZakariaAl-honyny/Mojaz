'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Car, 
  MapPin, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight,
  UserCheck,
  CreditCard,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function LandingPage() {
  const t = useTranslations('public');

  const services = [
    { icon: Car, title: 'New License', ar: 'إصدار رخصة جديدة' },
    { icon: History, title: 'License Renewal', ar: 'تجديد رخصة القيادة' },
    { icon: CreditCard, title: 'Damage Replacement', ar: 'طلب بدل تالف' },
    { icon: ShieldCheck, title: 'License Verification', ar: 'التحقق من الرخصة' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-primary-900 pb-20 pt-32 lg:pt-48">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-start space-y-8 animate-in fade-in slide-in-from-left duration-1000">
               <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 font-bold tracking-widest text-xs uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  Saudi Digital Transformation — Vision 2030
               </div>
               <h1 className="text-6xl md:text-8xl font-black text-white leading-tight tracking-tighter">
                  Mojaz <span className="text-primary-500">مُجاز</span>
               </h1>
               <p className="text-xl md:text-2xl text-primary-100/60 max-w-2xl font-medium leading-relaxed italic">
                  The unified government platform for driving license management. 
                  Efficiency, transparency, and a smarter future for Saudi citizens.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link 
                    href="/register" 
                    className={cn(
                      "h-16 px-10 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-black text-lg flex items-center justify-center gap-3 shadow-2xl hover:scale-105 transition-all"
                    )}
                  >
                    Register Now — ابدأ الآن
                    <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                  </Link>
                  <Link 
                    href="/login"
                    className={cn(
                      "h-16 px-10 rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10 font-bold backdrop-blur-xl flex items-center justify-center"
                    )}
                  >
                    Login — تسجيل الدخول
                  </Link>
               </div>
            </div>
            
            <div className="flex-1 w-full max-w-2xl animate-in fade-in zoom-in duration-1000">
               <div className="relative group p-4">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-primary-900 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                  <div className="relative bg-white rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/3] flex items-center justify-center border border-primary-100/50">
                     <div className="text-center p-12 space-y-6">
                        <div className="w-24 h-24 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
                           <Car className="w-12 h-12 text-primary-500" />
                        </div>
                        <h3 className="text-3xl font-black text-neutral-900 tracking-tight">Smart Licensing</h3>
                        <p className="text-neutral-500 font-medium italic">Integrated with Absher & Digital Wallets</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Services Grid ─── */}
      <section className="py-24 bg-neutral-50">
         <div className="container mx-auto px-6">
            <div className="text-center space-y-4 mb-20">
               <h2 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight leading-none uppercase">Integrated Digital Services</h2>
               <p className="text-lg text-neutral-500 max-w-2xl mx-auto font-medium italic">8 essential services for the Saudi license lifecycle.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {services.map((s, i) => (
                 <Card key={i} className="border-none shadow-xl rounded-[2rem] overflow-hidden hover:translate-y-[-10px] transition-all group bg-white">
                    <CardContent className="p-10 space-y-6">
                       <div className="w-16 h-16 bg-primary-500/5 rounded-2xl flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                          <s.icon className="w-8 h-8 text-primary-500 group-hover:text-white" />
                       </div>
                       <div>
                          <h4 className="text-xl font-black text-neutral-900 leading-none mb-2 tracking-tight group-hover:text-primary-500 transition-colors">{s.title}</h4>
                          <span className="text-2xl font-black text-primary-500/30 uppercase tracking-widest">{s.ar}</span>
                       </div>
                    </CardContent>
                 </Card>
               ))}
            </div>
         </div>
      </section>

      {/* ─── Stats / Impact ─── */}
      <section className="py-24 border-y border-neutral-100 bg-white">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24">
               {[
                 { label: 'Active Licenses', value: '4.2M+', icon: CheckCircle2 },
                 { label: 'Approved Centers', value: '142', icon: MapPin },
                 { label: 'Avg Processing', value: '18 min', icon: Clock },
                 { label: 'Verified Citizens', value: '12M+', icon: UserCheck },
               ].map((stat, i) => (
                 <div key={i} className="text-center lg:text-start space-y-3 p-6 rounded-3xl hover:bg-neutral-50 transition-colors">
                    <div className="w-12 h-12 bg-primary-900 rounded-xl flex items-center justify-center mb-4 shadow-lg mx-auto lg:mx-0">
                       <stat.icon className="w-6 h-6 text-primary-400" />
                    </div>
                    <div className="text-4xl font-black text-neutral-900 tracking-tighter leading-none">{stat.value}</div>
                    <div className="text-xs font-black text-neutral-400 uppercase tracking-widest italic">{stat.label}</div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* ─── CTA Footer ─── */}
      <section className="py-24">
         <div className="container mx-auto px-6">
            <div className="bg-primary-900 rounded-[4rem] p-16 md:p-24 text-center space-y-10 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,108,53,0.3)]">
               <div className="absolute top-0 right-0 p-12 opacity-5">
                  <ShieldCheck className="w-64 h-64" />
               </div>
               <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">Ready for the road?</h2>
               <p className="text-xl text-primary-100/60 max-w-xl mx-auto font-medium italic">Join 12 million Saudi citizens managing their credentials on a smarter, faster platform.</p>
               <Link 
                  href="/register"
                  className={cn(
                    "h-20 px-16 rounded-3xl bg-primary-500 hover:bg-primary-600 text-white font-black text-2xl flex items-center justify-center gap-4 shadow-2xl hover:scale-110 transition-all uppercase"
                  )}
                >
                  Create Free Account
                  <ArrowRight className="w-8 h-8 rtl:rotate-180" />
               </Link>
            </div>
         </div>
      </section>

      <footer className="py-12 border-t border-neutral-100 text-center">
         <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest leading-none mb-4">Mojaz مُجاز — Official Government Portal</p>
         <div className="flex justify-center flex-wrap gap-8 text-[10px] font-black text-neutral-300 uppercase tracking-[0.2em] italic">
            <span>Vision 2030</span>
            <span>Ministry of Interior</span>
            <span>Digital Saudi</span>
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
         </div>
      </footer>
    </div>
  );
}
