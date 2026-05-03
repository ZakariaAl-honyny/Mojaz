'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Lock, Loader2, ArrowLeft, ShieldCheck, AlertCircle, KeyRound } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import apiClient from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { RegistrationMethod } from '@/types/auth.types';

const loginSchema = z.object({
  identifier: z.string().min(5, 'يجب إدخال البريد الإلكتروني أو رقم الهاتف بشكل صحيح'),
  password: z.string().min(8, 'يجب أن تكون كلمة المرور 8 أحرف على الأقل'),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true);
    setError(null);
    try {
      // IMPROVED DETECTION LOGIC (DEFENSE-READY)
      const identifier = data.identifier.trim();
      let method = 1; // Default to Email

      if (identifier.includes('@')) {
        method = 1; // Email
      } else {
        const digitsOnly = identifier.replace(/\D/g, '');
        if (digitsOnly.length >= 9) {
          // Standard: Yemen phone is 9 digits, National ID is 10 or 11
          // If it starts with 7, 77, 73, 71 it's likely phone
          if (digitsOnly.startsWith('7') || digitsOnly.length === 9) {
            method = 2; // Phone
          } else {
            method = 0; // NationalId
          }
        }
      }

      const response = await apiClient.post('/auth/login', {
        identifier: identifier,
        password: data.password,
        method: method === 1 ? RegistrationMethod.Email : method === 2 ? RegistrationMethod.Phone : RegistrationMethod.NationalId
      });

      const rawData = response.data.data;

      // DEFENSIVE: Handle both PascalCase (C# Default) and camelCase (JS Default)
      const accessToken = rawData.AccessToken || rawData.accessToken;
      const refreshToken = rawData.RefreshToken || rawData.refreshToken;
      const user = rawData.User || rawData.user;

      if (!accessToken || !user) {
        throw new Error('بيانات المصادقة غير مكتملة من الخادم');
      }

      // Unified role parsing
      const rawRole = user.role !== undefined ? user.role : (user.Role !== undefined ? user.Role : 0);
      let roleNum: number = 0;

      if (typeof rawRole === 'string') {
        const parsed = parseInt(rawRole, 10);
        if (!isNaN(parsed)) {
          roleNum = parsed;
        } else {
          const map: Record<string, number> = {
            'Applicant': 0, 'Receptionist': 1, 'Doctor': 2,
            'Examiner': 3, 'Manager': 4, 'Security': 5, 'Admin': 6
          };
          roleNum = map[rawRole] ?? 0;
        }
      } else {
        roleNum = Number(rawRole);
      }

      user.role = roleNum;

      // Sync store and cookies
      setAuth(user, accessToken, refreshToken);

      // Redirect to main dashboard
      window.location.href = '/dashboard';
    } catch (err: any) {
      console.error('Login Error:', err);
      setError(err.response?.data?.message || err.message || 'عذراً، حدث خطأ أثناء تسجيل الدخول.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-4 bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-xl border border-neutral-100 font-arabic relative overflow-hidden"
      dir="rtl"
    >
      {/* Institutional Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#1a3a8f_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      <div className="text-center space-y-3 relative z-10">
        <div className="transition-transform duration-700 cursor-pointer inline-block">
          <img
            src="/images/logo.png"
            alt="Mojaz Logo"
            className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 object-contain"
          />
        </div>
        <h2 className="text-xl md:text-2xl font-black tracking-tight text-[#1a3a8f] leading-tight">
          بوابة الدخول الموحدة
        </h2>
        <p className="text-neutral-400 font-bold text-sm max-w-xs mx-auto leading-relaxed">
          أدخل بيانات الهوية الرقمية للوصول إلى النظام.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="p-4 bg-red-50 border border-red-100 text-red-700 text-xs font-bold rounded-xl flex items-start gap-4 shadow-sm"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
            <p className="leading-relaxed">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10">
        <div className="space-y-2">
          <Label className="text-[#1a3a8f] font-black text-xs pe-1 flex items-center gap-2">
            <User className="w-3.5 h-3.5 opacity-40" />
            اسم المستخدم / البريد / الهاتف
          </Label>
          <Input
            {...register('identifier')}
            autoComplete="username"
            className={cn(
              "h-11 md:h-11 bg-neutral-50/50 border border-neutral-100 rounded-xl text-neutral-900 px-4 text-base font-bold transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-blue-900/5 focus:border-[#1a3a8f]/30",
              errors.identifier && "border-red-500/50 focus:ring-red-500/5 focus:border-red-500"
            )}
            placeholder="user@mojaz.gov.sa"
          />
          {errors.identifier && <p className="text-[10px] text-red-500 font-black pe-1">{errors.identifier.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center pe-1">
            <Label className="text-[#1a3a8f] font-black text-xs flex items-center gap-2">
              <KeyRound className="w-3.5 h-3.5 opacity-40" />
              كلمة المرور
            </Label>
            <Link href="/forgot-password" title="استعادة كلمة المرور" className="text-[10px] font-black text-[#1a3a8f] underline underline-offset-4 decoration-2 decoration-[#1a3a8f]/10 hover:decoration-[#1a3a8f] transition-all">
              نسيت كلمة المرور؟
            </Link>
          </div>
          <Input
            {...register('password')}
            type="password"
            autoComplete="current-password"
            className={cn(
              "h-11 md:h-11 bg-neutral-50/50 border border-neutral-100 rounded-xl text-neutral-900 px-4 text-base font-bold transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-blue-900/5 focus:border-[#1a3a8f]/30",
              errors.password && "border-red-500/50 focus:ring-red-500/5 focus:border-red-500"
            )}
            placeholder="••••••••"
          />
          {errors.password && <p className="text-[10px] text-red-500 font-black pe-1">{errors.password.message}</p>}
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full h-14 bg-[#1a3a8f] hover:bg-[#00215a] text-white text-base md:text-lg font-black rounded-xl md:rounded-2xl shadow-xl shadow-blue-900/20 transition-all active:scale-[0.98] group overflow-hidden"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>جاري التحقق...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4 w-full">
                <span>تسجيل الدخول</span>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/20 flex items-center justify-center transition-transform group-hover:-translate-x-1">
                  <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
                </div>
              </div>
            )}
          </Button>
        </div>
      </form>

      <div className="text-center pt-2 relative z-10">
        <p className="text-xs font-bold text-neutral-500">
          ليس لديك حساب؟{' '}
          <Link href="/register" className="text-[#1a3a8f] font-black underline underline-offset-4 decoration-2 decoration-[#1a3a8f]/15 hover:decoration-[#1a3a8f] transition-all">
            إنشاء الحساب
          </Link>
        </p>
      </div>

    </motion.div>
  );
}
