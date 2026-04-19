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
  const commonT = useTranslations('common');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-50 dark:bg-site-bg text-neutral-400 py-32 px-6 border-t border-white/5 relative overflow-hidden transition-colors duration-500">
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-primary-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-20 mb-24">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-10">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="relative flex-shrink-0">
                <img
                  src="/images/logo.png"
                  alt={commonT('brand.name')}
                  className="h-14 w-14 object-contain group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute -inset-2 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
              <div className="leading-tight">
                <span className="font-black text-3xl tracking-tighter block text-white">{commonT('brand.name')}</span>
                <span className="text-[10px] text-primary-500 font-black uppercase tracking-[0.3em]">{commonT('brand.subtitle')}</span>
              </div>
            </Link>
            <p className="text-base leading-relaxed max-w-sm font-medium text-neutral-500">
              {commonT('footer.description')}
            </p>
            <div className="flex gap-4">
              {[Twitter, Facebook, Instagram, Linkedin].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -8, scale: 1.1 }}
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all cursor-pointer group hover:bg-primary-600 hover:border-primary-500"
                >
                  <Icon className="w-5 h-5 group-hover:text-white" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[11px] mb-10 opacity-50">{commonT('footer.services_title')}</h4>
            <ul className="space-y-5 text-sm font-bold">
              {[
                { href: '/register', key: 'new_license' },
                { href: '/services', key: 'renewal' },
                { href: '/services', key: 'replacement' },
                { href: '/services', key: 'upgrade' },
                { href: '/violations', key: 'violations_check' }
              ].map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="hover:text-primary-400 transition-all flex items-center gap-2 group whitespace-nowrap">
                    {commonT(`footer.links.${link.key}`)}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[11px] mb-10 opacity-50">{commonT('footer.about_title')}</h4>
            <ul className="space-y-5 text-sm font-bold">
              {['who_we_are', 'manuals', 'centers', 'faqs'].map((key) => (
                <li key={key}>
                  <Link href={`/${key.replace('_', '-')}`} className="hover:text-primary-400 transition-all">
                    {commonT(`footer.links.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[11px] mb-10 opacity-50">{commonT('footer.support_title')}</h4>
            <ul className="space-y-5 text-sm font-bold">
              {['traffic_laws', 'safety_guide', 'contact', 'privacy', 'terms'].map((key) => (
                <li key={key}>
                  <Link href={`/${key.replace('_', '-')}`} className="hover:text-primary-400 transition-all">
                    {commonT(`footer.links.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Awards/Trust Area */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 py-16 border-y border-white/5 mb-16">
          {[
            { icon: ShieldCheck, key: 'secure' },
            { icon: Globe, key: 'excellence' },
            { icon: Award, key: 'award' },
            { icon: Sparkles, key: 'zero_paper' }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ opacity: 1, scale: 1.02 }}
              className="flex items-center gap-5 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-default"
            >
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-primary-500/30">
                <item.icon className="w-6 h-6 text-primary-500" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white leading-tight max-w-[120px]">{commonT(`footer.trust.${item.key}`)}</span>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-[10px] font-black uppercase tracking-[0.3em]">
          <p className="opacity-40">{commonT('footer.rightsReserved', { year: currentYear })}</p>
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              <span className="text-primary-500">صنعاء، اليمن</span>
            </div>
            <span className="opacity-40">{commonT('footer.poweredBy')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
