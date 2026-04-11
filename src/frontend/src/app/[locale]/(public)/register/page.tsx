'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { EmailRegistrationForm } from '@/components/domain/auth/EmailRegistrationForm';
import { PhoneRegistrationForm } from '@/components/domain/auth/PhoneRegistrationForm';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Mail, Phone, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-neutral-950 px-6 py-24">
      {/* Background with Premium Feel */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.png"
          alt="Auth Background"
          fill
          className="object-cover opacity-40 grayscale-[30%] blur-[2px]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-bl from-primary-900/30 via-neutral-950/90 to-neutral-950" />
      </div>

      <div className="w-full max-w-xl relative z-10 space-y-8">
        {/* Glow behind the form */}
        <div className="absolute -inset-4 bg-primary-500/10 rounded-[3rem] blur-3xl opacity-30" />

        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-white tracking-tight"
          >
            {t('register.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-neutral-400 font-medium"
          >
            {t('register.subtitle')}
          </motion.p>
        </div>

        <div className="bg-white/10 dark:bg-black/40 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-white/20 shadow-2xl">
          {/* Tabs */}
          <div className="p-1.5 bg-white/5 rounded-2xl flex border border-white/5 mb-8">
            <button
              onClick={() => setActiveTab('email')}
              className={cn(
                "flex-1 flex items-center justify-center gap-3 py-4 text-sm font-bold rounded-xl transition-all duration-300",
                activeTab === 'email' 
                  ? "bg-primary-600 text-white shadow-lg" 
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Mail className="w-5 h-5" />
              {t('register.email')}
            </button>
            <button
              onClick={() => setActiveTab('phone')}
              className={cn(
                "flex-1 flex items-center justify-center gap-3 py-4 text-sm font-bold rounded-xl transition-all duration-300",
                activeTab === 'phone' 
                  ? "bg-primary-600 text-white shadow-lg" 
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Phone className="w-5 h-5" />
              {t('register.phone')}
            </button>
          </div>

          <div className="relative overflow-hidden min-h-[450px]">
            <AnimatePresence mode="wait">
              {activeTab === 'email' ? (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <EmailRegistrationForm />
                </motion.div>
              ) : (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <PhoneRegistrationForm />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="text-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group px-6 py-3 rounded-full hover:bg-white/5">
            <ChevronLeft className="w-4 h-4 group-rtl:rotate-180" />
            <span className="font-semibold underline underline-offset-4 decoration-neutral-400/30">
              {t('register.alreadyHaveAccount')}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
