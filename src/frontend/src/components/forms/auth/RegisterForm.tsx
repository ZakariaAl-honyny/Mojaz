'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone, Lock, User, Loader2, ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { RegistrationMethod } from '@/types/auth.types';

const registerSchema = z.object({
  fullName: z.string().min(5, 'يجب أن يكون الاسم الكامل 5 أحرف على الأقل'),
  method: z.enum(['Email', 'Phone']),
  identifier: z.string().min(5, 'يرجى إدخال البريد الإلكتروني أو رقم الهاتف بشكل صحيح'),
  password: z.string().min(8, 'يجب أن تكون كلمة المرور 8 أحرف على الأقل'),
  confirmPassword: z.string(),
  termsAccepted: z.literal(true),
}).refine((data) => data.password === data.confirmPassword, {
  message: "تأكيد كلمة المرور غير متطابق",
  path: ["confirmPassword"],
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { method: 'Email', termsAccepted: true }
  });

  const method = watch('method');

  const onSubmit = async (data: RegisterValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        fullName: data.fullName,
        method: data.method === 'Email' ? RegistrationMethod.Email : RegistrationMethod.Phone,
        email: data.method === 'Email' ? data.identifier : null,
        phone: data.method === 'Phone' ? data.identifier : null,
        password: data.password,
        confirmPassword: data.confirmPassword,
        termsAccepted: true,
        preferredLanguage: 'ar'
      };

      const response = await apiClient.post('/auth/register', payload);
      const { userId } = response.data.data;

      const destination = data.method === 'Email' ? data.identifier : data.identifier;
      router.push(`/verify-otp?userId=${userId}&destination=${encodeURIComponent(destination)}&type=${data.method}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'عذراً، تعذر إنشاء الحساب حالياً. يرجى مراجعة البيانات والمحاولة مرة أخرى.');
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
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#1a3a8f] leading-tight">إنشاء حساب سيادي</h1>
        <p className="text-neutral-400 font-bold text-sm max-w-xs mx-auto">ابدأ إجراءات التسجيل في المنصة الوطنية.</p>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="p-4 bg-red-50 border border-red-100 text-red-700 text-xs font-bold rounded-xl flex items-start gap-4 shadow-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
            <p className="leading-relaxed">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
        <div className="space-y-2">
          <Label className="text-[#1a3a8f] font-black text-xs pe-1 flex items-center gap-2">
            <User className="w-3.5 h-3.5 opacity-40" />
            الاسم الكامل
          </Label>
          <Input
            {...register('fullName')}
            className={cn(
              "h-11 md:h-12 bg-neutral-50/50 border border-neutral-100 rounded-xl text-neutral-900 px-4 text-base font-bold transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-blue-900/5 focus:border-[#1a3a8f]/30",
              errors.fullName && "border-red-500/50 focus:ring-red-500/5 focus:border-red-500"
            )}
            placeholder="مثال: محمد علي الصنعاني"
          />
          {errors.fullName && <p className="text-[10px] text-red-500 font-black pe-1">{errors.fullName.message}</p>}
        </div>

        <div className="p-1.5 bg-neutral-50 rounded-2xl border border-neutral-100 flex gap-1.5">
          <button
            type="button"
            onClick={() => setValue('method', 'Email')}
            className={cn(
              "flex-1 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2",
              method === 'Email' ? "bg-[#1a3a8f] text-white shadow-md" : "text-neutral-400 hover:text-[#1a3a8f]/70"
            )}
          >
            <Mail className="w-3.5 h-3.5" />
            البريد الإلكتروني
          </button>
          <button
            type="button"
            onClick={() => setValue('method', 'Phone')}
            className={cn(
              "flex-1 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2",
              method === 'Phone' ? "bg-[#1a3a8f] text-white shadow-md" : "text-neutral-400 hover:text-[#1a3a8f]/70"
            )}
          >
            <Phone className="w-3.5 h-3.5" />
            رقم الهاتف
          </button>
        </div>

        <div className="space-y-2">
          <Label className="text-[#1a3a8f] font-black text-xs pe-1 flex items-center gap-2">
            {method === 'Email' ? <Mail className="w-3.5 h-3.5 opacity-40" /> : <Phone className="w-3.5 h-3.5 opacity-40" />}
            {method === 'Email' ? 'عنوان البريد الإلكتروني' : 'رقم الهاتف الجوال'}
          </Label>
          <Input
            {...register('identifier')}
            dir={method === 'Phone' ? 'ltr' : 'rtl'}
            className={cn(
              "h-11 md:h-12 bg-neutral-50/50 border border-neutral-100 rounded-xl text-neutral-900 px-4 text-base font-bold transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-blue-900/5 focus:border-[#1a3a8f]/30",
              errors.identifier && "border-red-500/50 focus:ring-red-500/5 focus:border-red-500"
            )}
            placeholder={method === 'Email' ? 'user@example.gov.ye' : '+967 ...'}
          />
          {errors.identifier && <p className="text-[10px] text-red-500 font-black pe-1">{errors.identifier.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[#1a3a8f] font-black text-xs pe-1 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 opacity-40" />
              كلمة المرور
            </Label>
            <Input
              {...register('password')}
              type="password"
              className={cn(
                "h-11 md:h-12 bg-neutral-50/50 border border-neutral-100 rounded-xl text-neutral-900 px-4 text-base font-bold transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-blue-900/5 focus:border-[#1a3a8f]/30",
                errors.password && "border-red-500/50 focus:ring-red-500/5 focus:border-red-500"
              )}
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#1a3a8f] font-black text-xs pe-1 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 opacity-40" />
              تأكيد كلمة المرور
            </Label>
            <Input
              {...register('confirmPassword')}
              type="password"
              className={cn(
                "h-11 md:h-12 bg-neutral-50/50 border border-neutral-100 rounded-xl text-neutral-900 px-4 text-base font-bold transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-blue-900/5 focus:border-[#1a3a8f]/30",
                errors.confirmPassword && "border-red-500/50 focus:ring-red-500/5 focus:border-red-500"
              )}
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 md:h-16 bg-[#1a3a8f] hover:bg-[#00215a] text-white text-base md:text-lg font-black rounded-xl md:rounded-2xl shadow-xl shadow-blue-900/20 transition-all active:scale-[0.98] group overflow-hidden"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>جاري التسجيل...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4 w-full">
                <span>إنشاء الحساب</span>
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
          لديك حساب بالفعل؟{' '}
          <Link href="/login" className="text-[#1a3a8f] font-black underline underline-offset-4 decoration-2 decoration-[#1a3a8f]/15 hover:decoration-[#1a3a8f] transition-all">
            تسجيل الدخول
          </Link>
        </p>
      </div>

      <div className="pt-6 border-t border-neutral-50 flex items-center justify-center gap-3 opacity-30 relative z-10 text-[9px] font-black text-neutral-500 uppercase tracking-widest text-center leading-relaxed">
        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
        تخضع كافة البيانات المسجلة لنظام حماية البيانات السيادي
      </div>
    </motion.div>
  );
}
