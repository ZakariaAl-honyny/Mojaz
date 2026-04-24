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
      const method = data.identifier.includes('@') 
        ? 1 // Email
        : /^[0-9]+$/.test(data.identifier.replace(/[\s\-\+]/g, ''))
          ? (data.identifier.length >= 7 && data.identifier.length <= 15 ? 2 : 0) // Phone vs NationalId
          : 1;

      const response = await apiClient.post('/auth/login', {
        identifier: data.identifier,
        password: data.password,
        method: method
      });

      const { accessToken, refreshToken, user } = response.data.data;
      setAuth(user, accessToken, refreshToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'عذراً، بيانات الدخول غير صحيحة. يرجى التأكد من بيانات الاعتماد والمحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-8 bg-white p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-xl border border-neutral-100 font-arabic relative overflow-hidden"
      dir="rtl"
    >
      {/* Institutional Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#1a3a8f_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      <div className="text-center space-y-3 relative z-10">
        <div className="transition-transform duration-700 cursor-pointer inline-block">
            <img 
              src="/logo.png" 
              alt="Mojaz Logo" 
              className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 object-contain" 
            />
        </div>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#1a3a8f] leading-tight">
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
        <div className="space-y-2">
          <Label className="text-[#1a3a8f] font-black text-xs pr-1 flex items-center gap-2">
            <User className="w-3.5 h-3.5 opacity-40" />
            اسم المستخدم / البريد / الهاتف
          </Label>
          <Input
            {...register('identifier')}
            className={cn(
              "h-11 md:h-12 bg-neutral-50/50 border border-neutral-100 rounded-xl text-neutral-900 px-4 text-base font-bold transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-blue-900/5 focus:border-[#1a3a8f]/30",
              errors.identifier && "border-red-500/50 focus:ring-red-500/5 focus:border-red-500"
            )}
            placeholder="user@mojaz.gov.sa"
          />
          {errors.identifier && <p className="text-[10px] text-red-500 font-black pr-1">{errors.identifier.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center pr-1">
            <Label className="text-[#1a3a8f] font-black text-xs flex items-center gap-2">
              <KeyRound className="w-3.5 h-3.5 opacity-40" />
              كلمة المرور
            </Label>
            <Link href="/forgot-password" title="استعادة كلمة المرور" className="text-[10px] font-black text-[#1a3a8f] hover:opacity-70 transition-opacity underline underline-offset-4 decoration-2 decoration-[#1a3a8f]/10">
              نسيت كلمة المرور؟
            </Link>
          </div>
          <Input
            {...register('password')}
            type="password"
            className={cn(
              "h-11 md:h-12 bg-neutral-50/50 border border-neutral-100 rounded-xl text-neutral-900 px-4 text-base font-bold transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-blue-900/5 focus:border-[#1a3a8f]/30",
              errors.password && "border-red-500/50 focus:ring-red-500/5 focus:border-red-500"
            )}
            placeholder="••••••••"
          />
          {errors.password && <p className="text-[10px] text-red-500 font-black pr-1">{errors.password.message}</p>}
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 md:h-14 text-base md:text-lg font-black bg-[#1a3a8f] hover:bg-[#152d6f] text-white transition-all duration-300 rounded-xl md:rounded-2xl shadow-lg shadow-blue-900/10 active:scale-[0.98] group"
          >
            {isLoading ? (
                <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>جاري المصادقة...</span>
                </div>
            ) : (
                <div className="flex items-center justify-center gap-4 w-full">
                    <span>تسجيل الدخول</span>
                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                </div>
            )}
          </Button>
        </div>
      </form>

      <div className="text-center pt-2 relative z-10">
         <p className="text-xs font-bold text-neutral-500">
           ليس لديك حساب؟{' '}
           <Link href="/register" className="text-[#1a3a8f] font-black hover:underline underline-offset-4 decoration-[#1a3a8f]/20">
             ابدأ التسجيل الآن
           </Link>
         </p>
      </div>

      <div className="pt-6 border-t border-neutral-50 flex items-center justify-center gap-3 opacity-30 relative z-10">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">تشفير سيادي موحد • TLS 1.3</p>
      </div>
    </motion.div>
  );
}
