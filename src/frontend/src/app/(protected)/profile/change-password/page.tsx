'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authService } from '@/services/auth.service';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  KeyRound, 
  ShieldCheck, 
  ArrowRight, 
  Loader2, 
  Eye, 
  EyeOff,
  AlertCircle
} from 'lucide-react';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
  newPassword: z.string()
    .min(8, 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل')
    .regex(/[A-Z]/, 'يجب أن تحتوي على حرف كبير واحد على الأقل')
    .regex(/[a-z]/, 'يجب أن تحتوي على حرف صغير واحد على الأقل')
    .regex(/[0-9]/, 'يجب أن تحتوي على رقم واحد على الأقل')
    .regex(/[^A-Za-z0-9]/, 'يجب أن تحتوي على رمز خاص واحد على الأقل'),
  confirmPassword: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    setIsLoading(true);
    try {
      const response = await authService.changePassword(data.currentPassword, data.newPassword);
      if (response.success) {
        toast({
          title: 'تم تغيير كلمة المرور بنجاح',
          description: 'يمكنك الآن استخدام كلمة المرور الجديدة في المرات القادمة.',
          variant: 'default',
        });
        router.push('/profile');
      } else {
        toast({
          title: 'فشل تغيير كلمة المرور',
          description: response.message || 'حدث خطأ ما، يرجى المحاولة لاحقاً',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'خطأ في الاتصال',
        description: error.response?.data?.message || 'تعذر الاتصال بالخادم، يرجى التحقق من اتصالك',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="max-w-2xl mx-auto py-6 md:py-10 px-4 font-arabic" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="rounded-full hover:bg-neutral-100"
        >
          <ArrowRight className="w-5 h-5 text-neutral-600" />
        </Button>
        <div>
          <h1 className="text-xl md:text-2xl font-black text-neutral-900 tracking-tight">
            تغيير كلمة المرور
          </h1>
          <p className="text-neutral-500 font-bold text-xs uppercase tracking-widest mt-1">
            إدارة أمان الحساب والوصول
          </p>
        </div>
      </div>

      <Card className="border border-neutral-200 shadow-sm bg-white rounded-2xl overflow-hidden hover:border-[#1a3a8f]/10 transition-all duration-300">
        <CardHeader className="bg-neutral-50/50 p-6 md:p-8 border-b border-neutral-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center shadow-sm">
              <KeyRound className="w-6 h-6 text-[#1a3a8f]" />
            </div>
            <div>
              <CardTitle className="text-lg font-black text-neutral-900 tracking-tight uppercase">تحديث كلمة السر</CardTitle>
              <CardDescription className="text-neutral-500 font-bold text-xs">احرص على استخدام كلمة مرور قوية وغير مكررة</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <Label className="text-xs font-black text-neutral-400 px-1 uppercase tracking-widest">كلمة المرور الحالية</Label>
              <div className="relative group">
                <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
                  <ShieldCheck className="w-4 h-4 text-neutral-300 group-focus-within:text-[#1a3a8f] transition-colors" />
                </div>
                <Input
                  type={showPasswords.current ? 'text' : 'password'}
                  {...register('currentPassword')}
                  className="ps-11 pe-12 h-12 md:h-14 bg-neutral-50/50 border border-neutral-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-900/5 focus:border-[#1a3a8f]/30 font-bold text-base transition-all duration-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute inset-y-0 end-0 pe-4 flex items-center text-neutral-400 hover:text-[#1a3a8f] transition-colors"
                >
                  {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-[10px] text-red-500 font-bold mt-1.5 flex items-center gap-1 px-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="w-full h-px bg-neutral-50" />

            {/* New Password */}
            <div className="space-y-2">
              <Label className="text-xs font-black text-neutral-400 px-1 uppercase tracking-widest">كلمة المرور الجديدة</Label>
              <div className="relative group">
                <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
                  <KeyRound className="w-4 h-4 text-neutral-300 group-focus-within:text-[#1a3a8f] transition-colors" />
                </div>
                <Input
                  type={showPasswords.new ? 'text' : 'password'}
                  {...register('newPassword')}
                  className="ps-11 pe-12 h-12 md:h-14 bg-neutral-50/50 border border-neutral-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-900/5 focus:border-[#1a3a8f]/30 font-bold text-base transition-all duration-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute inset-y-0 end-0 pe-4 flex items-center text-neutral-400 hover:text-[#1a3a8f] transition-colors"
                >
                  {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-[10px] text-red-500 font-bold mt-1.5 flex items-center gap-1 px-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label className="text-xs font-black text-neutral-400 px-1 uppercase tracking-widest">تأكيد كلمة المرور الجديدة</Label>
              <div className="relative group">
                <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
                  <KeyRound className="w-4 h-4 text-neutral-300 group-focus-within:text-[#1a3a8f] transition-colors" />
                </div>
                <Input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  className="ps-11 pe-12 h-12 md:h-14 bg-neutral-50/50 border border-neutral-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-900/5 focus:border-[#1a3a8f]/30 font-bold text-base transition-all duration-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute inset-y-0 end-0 pe-4 flex items-center text-neutral-400 hover:text-[#1a3a8f] transition-colors"
                >
                  {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[10px] text-red-500 font-bold mt-1.5 flex items-center gap-1 px-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="pt-4 flex flex-col md:flex-row gap-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-12 md:h-14 bg-[#1a3a8f] hover:bg-[#152d6f] text-white rounded-xl font-black text-sm uppercase tracking-widest gap-3 shadow-xl shadow-blue-900/10 active:scale-[0.98] transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ShieldCheck className="w-5 h-5" />
                )}
                تحديث كلمة المرور
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="md:w-32 h-12 md:h-14 rounded-xl border-neutral-200 font-black text-xs text-neutral-500 uppercase tracking-widest hover:bg-neutral-50"
              >
                إلغاء
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security Tip */}
      <div className="mt-8 p-6 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
          <AlertCircle className="w-5 h-5 text-[#1a3a8f]" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-black text-blue-900 tracking-tight uppercase">نصيحة أمنية</h4>
          <p className="text-xs text-blue-700 font-bold opacity-80 leading-relaxed">
            كلمة المرور القوية يجب أن لا تقل عن 8 أحرف وتحتوي على مزيج من الأحرف الكبيرة والصغيرة والأرقام والرموز الخاصة. تجنب استخدام تواريخ الميلاد أو أرقام الهاتف ككلمة مرور.
          </p>
        </div>
      </div>
    </div>
  );
}
