'use client';

import {
  Facebook, Twitter, Instagram, Youtube, MessageCircle,
  Mail, Phone, MapPin, ShieldCheck, Globe, Award, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const socialLinks = [
  { icon: Twitter, href: "#" },
  { icon: Facebook, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Youtube, href: "#" },
  { icon: MessageCircle, href: "#" },
];

const quickLinks = [
  { label: "إصدار رخصة جديدة", href: "#services" },
  { label: "تجديد رخصة قيادة", href: "#services" },
  { label: "بدل فاقد أو تالف", href: "#services" },
  { label: "التحقق من الصلاحية", href: "#services" },
];

const institutionalLinks = [
  { label: "عن المنصة الرقمية", href: "#" },
  { label: "دليل المستخدم", href: "#" },
  { label: "مراكز الخدمة", href: "#" },
  { label: "الأسئلة الشائعة", href: "#faq" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#020617] pt-24 pb-12 overflow-hidden font-arabic border-t-2 border-[#D4A017]" dir="rtl">
      {/* Premium Institutional Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1a3a8f]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#D4A017]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">

          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4 text-white">
              <div className="w-12 h-12 shrink-0">
                <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain brightness-125" />
              </div>
              <div className="leading-tight">
                <span className="font-black text-xl tracking-tight block">نظام رخص القيادة</span>
                <span className="text-[9px] text-[#D4A017] font-black uppercase tracking-widest block">المنظومة الرقمية السيادية - الجمهورية اليمنية</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-sm font-semibold opacity-60 text-white/70">
              المنصة الرقمية الرسمية الموحدة لخدمات رخص القيادة التابعة للإدارة العامة للمرور، صممت لتوفير أقصى درجات الكفاءة والأمان للمواطنين والمقيمين.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#1a3a8f] hover:border-[#1a3a8f] transition-all group shadow-sm hover:shadow-blue-900/40 hover:-translate-y-1"
                >
                  <social.icon className="w-5 h-5 group-hover:text-white transition-colors text-white/40" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-white font-black text-xs mb-6 opacity-40 border-s-2 border-[#1a3a8f] ps-3 uppercase tracking-widest">الخدمات</h4>
            <ul className="space-y-4 text-sm font-bold">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-white/60 hover:text-[#D4A017] transition-colors flex items-center gap-2 group">
                    <div className="w-1.5 h-1.2 w-1.5 h-1.5 rounded-full bg-[#1a3a8f] group-hover:bg-[#D4A017] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black text-xs mb-6 opacity-40 border-s-2 border-[#1a3a8f] ps-3 uppercase tracking-widest">عن النظام</h4>
            <ul className="space-y-4 text-sm font-bold">
              {institutionalLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-white/60 hover:text-[#D4A017] transition-colors flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1a3a8f] group-hover:bg-[#D4A017] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-black text-xs mb-6 opacity-40 border-s-2 border-[#1a3a8f] ps-3 uppercase tracking-widest">التواصل</h4>
            <ul className="space-y-5">
              <li className="flex items-center gap-4 group">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#1a3a8f] group-hover:border-[#1a3a8f] transition-all">
                  <Phone className="w-4 h-4 text-[#D4A017] group-hover:text-white" />
                </div>
                <span className="text-white/70 font-bold text-sm tracking-widest tabular-nums">٨٠٠ ٤٤٤٤</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#1a3a8f] group-hover:border-[#1a3a8f] transition-all">
                  <Mail className="w-4 h-4 text-[#D4A017] group-hover:text-white" />
                </div>
                <span className="text-white/70 font-bold text-sm tracking-tight">support@traffic.gov.ye</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#1a3a8f] group-hover:border-[#1a3a8f] transition-all">
                  <MapPin className="w-4 h-4 text-[#D4A017] group-hover:text-white" />
                </div>
                <span className="text-white/70 font-bold text-sm">صنعاء، الإدارة العامة للمرور</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Security Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-10 border-y border-white/5 mb-8">
          {[
            { icon: ShieldCheck, label: 'أمن معلومات سيادي' },
            { icon: Globe, label: 'تحول رقمي معتمد' },
            { icon: Award, label: 'معايير جودة مؤسسية' },
            { icon: Zap, label: 'أتمتة ذكية بالكامل' }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 opacity-30 hover:opacity-100 transition-all cursor-default group">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#1a3a8f]/20 transition-all">
                <item.icon className="w-4 h-4 text-[#D4A017]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white leading-none">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-white/5">
          <div className="flex items-center gap-4 opacity-40">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">الجمهورية اليمنية</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4A017]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">الإدارة العامة للمرور</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-center md:text-right">
            حقوق الطبع والنشر © {new Date().getFullYear()} نظام مُجاز الرقمي. المنظومة السيادية لمعالجة التراخيص. جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
}
