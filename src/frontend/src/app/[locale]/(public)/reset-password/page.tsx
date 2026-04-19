'use client';

import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResetPasswordPage() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError(t('reset.mismatch'));
      return;
    }

    try {
      setLoading(true);
      await authService.changePassword(currentPassword, newPassword);
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || t('reset.error'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
          <div className="gov-glass-panel pt-12 pb-12 px-8 text-center space-y-6 rounded-[2.5rem]">
            <div className="w-20 h-20 bg-primary/10 rounded-[1.5rem] flex items-center justify-center mx-auto shadow-[0_20px_40px_rgba(0,108,53,0.1)] border border-primary/20">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <p className="text-xl font-black text-white font-arabic leading-none">{t('reset.success')}</p>
            <Button
              onClick={() => router.push('/login')}
              className="w-full h-14 bg-primary hover:bg-primary/90 rounded-2xl text-lg font-black shadow-xl shadow-primary/20"
            >
              {t('reset.login')}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="gov-glass-panel p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          
          <div className="text-center space-y-4 mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-6 shadow-[0_20px_40px_rgba(0,108,53,0.3)]">
              <RefreshCw className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black tracking-tighter text-white font-arabic leading-none">{t('reset.title')}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-neutral-300 block ms-1">{t('reset.current')}</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                dir="ltr"
                className="h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus:ring-2 focus:ring-primary/50 font-english"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-neutral-300 block ms-1">{t('reset.new')}</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                dir="ltr"
                className="h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus:ring-2 focus:ring-primary/50 font-english"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-neutral-300 block ms-1">{t('reset.confirm')}</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                dir="ltr"
                className="h-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus:ring-2 focus:ring-primary/50 font-english"
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl font-medium"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-primary hover:bg-primary/90 text-lg font-black rounded-[1.2rem] shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2 group"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t('common.loading')}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full relative">
                  <span>{t('reset.submit')}</span>
                </div>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}