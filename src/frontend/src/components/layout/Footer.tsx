'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  ExternalLink,
  ShieldCheck,
  Globe,
  Award,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const t = useTranslations('landing.footer');
  const commonT = useTranslations('common');
  
  return (
    <footer className="bg-neutral-950 text-neutral-400 py-24 px-6 border-t border-white/5 relative overflow-hidden">
      {/* Decorative Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
      
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-3 text-white">
              <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl shadow-primary-900/40">M</div>
              <div className="leading-tight">
                <span className="font-black text-2xl tracking-tighter block">{commonT('title').split(' - ')[0]}</span>
                <span className="text-[10px] text-primary-500 font-bold uppercase tracking-[0.2em]">Gov Digital Platform</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-sm font-medium">
              مُجاز هي المنصة الحكومية الموحدة لخدمات رخص القيادة في المملكة، تهدف إلى أتمتة كافة الإجراءات وتقديم تجربة مستخدم رقمية بمعايير عالمية.
            </p>
            <div className="flex gap-4">
              {[Twitter, Facebook, Instagram, Linkedin].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -5, color: '#006C35' }}
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center transition-all cursor-pointer group hover:bg-white"
                >
                  <Icon className="w-5 h-5 group-hover:text-primary-600" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">الخدمات</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link href="/services/new" className="hover:text-primary-400 transition-colors flex items-center gap-2 group">إصدار رخصة جديدة <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              <li><Link href="/services/renewal" className="hover:text-primary-400 transition-colors flex items-center gap-2 group">تجديد رخصة <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              <li><Link href="/services/replacement" className="hover:text-primary-400 transition-colors flex items-center gap-2 group">بدل فاقد/تالف <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              <li><Link href="/services/upgrade" className="hover:text-primary-400 transition-colors flex items-center gap-2 group">ترقية فئة الرخصة <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">عن المنصة</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link href="/about" className="hover:text-primary-400 transition-colors">عن مُجاز</Link></li>
              <li><Link href="/manuals" className="hover:text-primary-400 transition-colors">دليل الاستخدام</Link></li>
              <li><Link href="/centers" className="hover:text-primary-400 transition-colors">مراكز الفحص</Link></li>
              <li><Link href="/faqs" className="hover:text-primary-400 transition-colors">الأسئلة الشائعة</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">الدعم والقانون</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link href="/contact" className="hover:text-primary-400 transition-colors">اتصل بنا</Link></li>
              <li><Link href="/privacy" className="hover:text-primary-400 transition-colors">سياسة الخصوصية</Link></li>
              <li><Link href="/terms" className="hover:text-primary-400 transition-colors">الشروط والأحكام</Link></li>
              <li><Link href="/accessibility" className="hover:text-primary-400 transition-colors">إمكانية الوصول</Link></li>
            </ul>
          </div>
        </div>

        {/* Awards/Trust Area */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-white/5 mb-12">
           {[
             { icon: ShieldCheck, label: 'Secure Framework' },
             { icon: Globe, label: 'Digital Excellence 2025' },
             { icon: Award, label: 'Gov Award Winner' },
             { icon: Sparkles, label: 'Zero Paper Initiative' }
           ].map((item, i) => (
             <div key={i} className="flex items-center gap-4 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                <item.icon className="w-6 h-6 text-primary-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white leading-tight">{item.label}</span>
             </div>
           ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black uppercase tracking-[0.2em]">
          <p>© {new Date().getFullYear()} {commonT('title').split(' - ')[0]}. جميع الحقوق محفوظة لوزارة الداخلية.</p>
          <div className="flex items-center gap-8">
             <span className="text-primary-500">Vision 2030</span>
             <span>Powered by Gaea System</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
