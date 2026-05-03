'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Phone, Loader2, ArrowLeft, ShieldQuestion, HelpCircle, KeyRound, AlertCircle } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { RegistrationMethod } from '@/types/auth.types';

const forgotPasswordSchema = z.object({
  identifier: z.string().min(5, 'يرجى إدخال البريد الإلكتروني أو رقم الهاتف المسجل'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onSuccess: (identifier: string) => void;
}

export default function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post('/auth/forgot-password', {
        identifier: data.identifier,
        method: data.identifier.includes('@') ? RegistrationMethod.Email : RegistrationMethod.Phone
      });
      onSuccess(data.identifier);
    } catch (err: any) {
      setError(err.response?.data?.message || 'تعذر إرسال رمز الاستعادة حالياً. يرجى التأكد من البيانات المدخلة والمحاولة لاحقاً.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-arabic bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl border border-neutral-100 relative overflow-hidden" dir="rtl">
      {/* Institutional Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#1a3a8f]/5 rounded-full -mr-16 -mt-16 blur-2xl" />
      <div className="text-center space-y-2 relative z-10">
        <div className="transition-transform duration-700 cursor-pointer inline-block">
          <img
            src="/images/logo.png"
            alt="Mojaz Logo"
            className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 object-contain"
          />
        </div>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#1a3a8f]">استعادة الوصول</h2>
        <p className="text-neutral-500 font-bold text-sm leading-relaxed max-w-sm mx-auto">
          أدخل بيانات الهوية الرقمية المسجلة لإرسال رمز التحقق الآمن إلى هاتفك أو بريدك الإلكتروني.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 rounded-2xl bg-red-500/5 text-red-700 text-sm font-bold leading-relaxed flex items-start gap-4 border border-red-500/10 shadow-sm"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
        <div className="space-y-2 group">
          <Label className="text-[#1a3a8f] font-black text-xs pe-1 flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 opacity-40" />
            الرابط الرقمي (البريد أو الهاتف)
          </Label>
          <div className="relative">
            <Input
              {...register('identifier')}
              autoComplete="username"
              className={cn(
                "h-12 bg-neutral-100/50 border-none rounded-xl text-[#1a3a8f] px-6 font-black placeholder:text-neutral-300 focus:ring-4 focus:ring-[#1a3a8f]/10 transition-all text-start shadow-inner",
                errors.identifier && "ring-4 ring-red-500/10 bg-red-50/50"
              )}
              placeholder="user@domain.com أو +967..."
            />
          </div>
          {errors.identifier && <p className="text-xs text-red-500 font-bold me-2">{errors.identifier.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-16 bg-[#1a3a8f] hover:bg-[#00215a] text-white text-lg font-black rounded-xl md:rounded-2xl shadow-xl shadow-blue-900/40 active:scale-[0.98] transition-all group overflow-hidden relative"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>جاري المعالجة...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4 w-full">
              <span>إرسال رمز التوثيق</span>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center transition-transform group-hover:-translate-x-1">
                <ArrowLeft className="w-6 h-6" />
              </div>
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}
