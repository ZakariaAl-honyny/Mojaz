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
        method: data.identifier.includes('@') ? 1 : 2 // 1=Email, 2=Phone (matching RegistrationMethod enum)
      });
      onSuccess(data.identifier);
    } catch (err: any) {
      setError(err.response?.data?.message || 'تعذر إرسال رمز الاستعادة حالياً. يرجى التأكد من البيانات المدخلة والمحاولة لاحقاً.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10 font-arabic" dir="rtl">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-[#1a3a8f] rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-900/40 border border-white/20 transform hover:rotate-12 transition-transform duration-500">
          <KeyRound className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-[#1a3a8f]">استعادة الوصول</h2>
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <div className="space-y-4 group">
          <Label className="text-[#1a3a8f] font-black text-sm mr-2 flex items-center gap-3">
            <Mail className="w-4.5 h-4.5" />
            الرابط الرقمي (البريد أو الهاتف)
          </Label>
          <div className="relative">
            <Input 
              {...register('identifier')} 
              className={cn(
                "h-16 bg-neutral-100/50 border-none rounded-2xl text-[#1a3a8f] px-8 font-black placeholder:text-neutral-300 focus:ring-4 focus:ring-[#1a3a8f]/10 transition-all text-right shadow-inner",
                errors.identifier && "ring-4 ring-red-500/10 bg-red-50/50"
              )} 
              placeholder="user@domain.com أو +967..." 
            />
          </div>
          {errors.identifier && <p className="text-xs text-red-500 font-bold mr-2">{errors.identifier.message}</p>}
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-20 bg-[#1a3a8f] hover:bg-[#00215a] text-white text-xl font-black rounded-[2rem] shadow-2xl shadow-blue-900/40 active:scale-[0.98] transition-all group overflow-hidden relative"
        >
          {isLoading ? (
            <div className="flex items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span>جاري المعالجة...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-6 w-full">
              <span>إرسال رمز التوثيق</span>
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center transition-transform group-hover:-translate-x-2">
                 <ArrowLeft className="w-7 h-7" />
              </div>
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}
