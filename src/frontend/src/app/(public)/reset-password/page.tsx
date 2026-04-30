'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle2, ArrowLeft, Home, Lock, ShieldCheck } from 'lucide-react';

export default function ResetPasswordPage() {
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
      setError("كلمة المرور غير متطابقة");
      return;
    }

    try {
      setLoading(true);
      await authService.changePassword(currentPassword, newPassword);
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError("فشل تحديث كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 font-arabic" dir="rtl">
        <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-neutral-100 text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto transition-transform animate-in fade-in zoom-in duration-500">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-[#1a3a8f]">تم التغيير بنجاح</h3>
            <p className="text-neutral-500 font-bold leading-relaxed">
              تم تحديث كلمة المرور الخاصة بك. جاري تحويلك لصفحة الدخول...
            </p>
          </div>
          <Button
            onClick={() => router.push('/login')}
            className="w-full h-14 bg-[#1a3a8f] hover:bg-[#00215a] text-white font-black rounded-xl md:rounded-2xl shadow-xl shadow-blue-900/20"
          >
            تسجيل الدخول الآن
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 font-arabic" dir="rtl">
      {/* Navigation */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 px-2">
        <Link href="/" className="flex items-center gap-2 text-neutral-400 hover:text-[#1a3a8f] transition-colors text-xs font-black group">
          <Home className="w-4 h-4" />
          <span className="underline underline-offset-4 decoration-2 decoration-neutral-300 group-hover:decoration-[#1a3a8f] transition-all">الرئيسية</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-neutral-100 space-y-8 relative overflow-hidden">
        {/* Brand Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
        
        <div className="text-center space-y-3 relative z-10">
          <div className="transition-transform duration-700 cursor-pointer inline-block">
            <img
              src="/images/logo.png"
              alt="Mojaz Logo"
              className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 object-contain"
            />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-[#1a3a8f]">إعادة تعيين كلمة المرور</h2>
          <p className="text-neutral-400 font-bold text-sm">أدخل بياناتك الجديدة لتحديث صلاحية الدخول.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div className="space-y-2">
            <Label className="text-[#1a3a8f] font-black text-xs pe-1 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 opacity-40" />
              كلمة المرور الحالية
            </Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="h-11 bg-neutral-50/50 border border-neutral-100 rounded-xl px-4 font-bold"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#1a3a8f] font-black text-xs pe-1 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 opacity-40" />
                كلمة المرور الجديدة
              </Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-11 bg-neutral-50/50 border border-neutral-100 rounded-xl px-4 font-bold"
                required
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#1a3a8f] font-black text-xs pe-1 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 opacity-40" />
                تأكيد الجديدة
              </Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-11 bg-neutral-50/50 border border-neutral-100 rounded-xl px-4 font-bold"
                required
                minLength={8}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-xs font-black text-center bg-red-50 p-3 rounded-lg border border-red-100 animate-shake">
              {error}
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#1a3a8f] hover:bg-[#00215a] text-white font-black rounded-xl md:rounded-2xl shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all group overflow-hidden"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري التحديث...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3 w-full">
                  <span>تحديث كلمة المرور</span>
                  <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        <p className="mt-8 text-center text-xs font-black text-neutral-300 uppercase tracking-[0.3em] opacity-50">
          الإدارة العامة للمرور - محافظة صنعاء
        </p>
      </div>
    </div>
  );
}