'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import PublicLayout from '@/components/layout/PublicLayout';
import { EmailRegistrationForm } from '@/components/domain/auth/EmailRegistrationForm';
import { PhoneRegistrationForm } from '@/components/domain/auth/PhoneRegistrationForm';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Mail, Phone } from 'lucide-react';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');

  return (
    <PublicLayout>
      <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center bg-neutral-50 px-6 py-12 dark:bg-neutral-950">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-extrabold text-neutral-900 tracking-tight dark:text-white"
            >
              {t('register.title')}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-3 text-lg text-neutral-500 dark:text-neutral-400"
            >
              {t('register.subtitle')}
            </motion.p>
          </div>

          <div className="p-1 bg-neutral-200/50 rounded-xl flex dark:bg-neutral-800/50">
            <button
              onClick={() => setActiveTab('email')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-lg transition-all",
                activeTab === 'email' 
                  ? "bg-white text-primary-600 shadow-sm dark:bg-neutral-700 dark:text-primary-400" 
                  : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              )}
            >
              <Mail className="w-4 h-4" />
              {t('register.email')}
            </button>
            <button
              onClick={() => setActiveTab('phone')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-lg transition-all",
                activeTab === 'phone' 
                  ? "bg-white text-primary-600 shadow-sm dark:bg-neutral-700 dark:text-primary-400" 
                  : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              )}
            >
              <Phone className="w-4 h-4" />
              {t('register.phone')}
            </button>
          </div>

          <div className="relative overflow-hidden min-h-[500px]">
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
      </div>
    </PublicLayout>
  );
}
