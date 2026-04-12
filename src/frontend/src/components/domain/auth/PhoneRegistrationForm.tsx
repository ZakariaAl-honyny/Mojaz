'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { authService } from '@/services/auth.service';
import { RegistrationMethod } from '@/types/auth.types';
import { cn } from '@/lib/utils';
import { Phone, User, Lock, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';

const phoneRegisterSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  phone: z.string().regex(/^\+9665[0-9]{8}$/, 'Enter a valid Saudi phone number (+9665xxxxxxxx)'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type PhoneRegisterFormValues = z.infer<typeof phoneRegisterSchema>;

export function PhoneRegistrationForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<PhoneRegisterFormValues>({
    resolver: zodResolver(phoneRegisterSchema),
    defaultValues: {
      termsAccepted: false,
    }
  });

  const termsAccepted = watch('termsAccepted');

  const onSubmit = async (data: PhoneRegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register({
        fullName: data.fullName,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
        method: RegistrationMethod.Phone,
        preferredLanguage: 'ar',
        termsAccepted: data.termsAccepted,
      });

      if (response.success && response.data?.userId) {
        router.push(`/register/verify?userId=${response.data.userId}&method=phone&dest=${encodeURIComponent(data.phone)}`);
      } else {
        setError(response.message || t('errors.registrationFailed'));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t('errors.genericError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl font-medium flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </motion.div>
      )}

      {/* Full Name */}
      <div className="space-y-2">
        <Label className="text-neutral-300 font-semibold ml-1">{t('register.fullName')}</Label>
        <div className="relative group">
          <User className="absolute left-4 top-4 h-5 w-5 text-neutral-500 group-focus-within:text-primary-400 transition-colors rtl:left-auto rtl:right-4" />
          <Input
            placeholder={t('register.fullNamePlaceholder')}
            className={cn(
              "h-14 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-neutral-600 focus:ring-2 focus:ring-primary-500/50 transition-all ps-12", 
              errors.fullName && "border-red-500/50"
            )}
            {...register('fullName')}
          />
        </div>
        {errors.fullName && <p className="text-xs text-red-400 font-medium ml-1">{errors.fullName.message}</p>}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label className="text-neutral-300 font-semibold ml-1">{t('register.phone')}</Label>
        <div className="relative group">
          <Phone className="absolute left-4 top-4 h-5 w-5 text-neutral-500 group-focus-within:text-primary-400 transition-colors rtl:left-auto rtl:right-4" />
          <Input
            placeholder="+9665xxxxxxxx"
            className={cn(
              "h-14 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-neutral-600 focus:ring-2 focus:ring-primary-500/50 transition-all ps-12 font-mono", 
              errors.phone && "border-red-500/50"
            )}
            {...register('phone')}
          />
        </div>
        {errors.phone && <p className="text-xs text-red-400 font-medium ml-1">{errors.phone.message}</p>}
      </div>

<<<<<<< Updated upstream
      {/* Passwords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-neutral-300 font-semibold ml-1">{t('register.password')}</Label>
          <div className="relative group">
            <Lock className="absolute left-4 top-4 h-5 w-5 text-neutral-500 group-focus-within:text-primary-400 transition-colors rtl:left-auto rtl:right-4" />
            <Input
              type="password"
              placeholder="••••••••"
              className={cn(
                "h-14 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-neutral-600 focus:ring-2 focus:ring-primary-500/50 transition-all ps-12", 
                errors.password && "border-red-500/50"
              )}
              {...register('password')}
            />
          </div>
          {errors.password && <p className="text-xs text-red-400 font-medium ml-1">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-neutral-300 font-semibold ml-1">{t('register.confirmPassword')}</Label>
          <div className="relative group">
            <Lock className="absolute left-4 top-4 h-5 w-5 text-neutral-500 group-focus-within:text-primary-400 transition-colors rtl:left-auto rtl:right-4" />
            <Input
              type="password"
              placeholder="••••••••"
              className={cn(
                "h-14 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-neutral-600 focus:ring-2 focus:ring-primary-500/50 transition-all ps-12", 
                errors.confirmPassword && "border-red-500/50"
              )}
              {...register('confirmPassword')}
            />
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-400 font-medium ml-1">{errors.confirmPassword.message}</p>}
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
        <Checkbox 
          id="terms-phone" 
          checked={termsAccepted}
          onCheckedChange={(checked) => setValue('termsAccepted', checked === true)}
          className="mt-1 border-white/20 data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="terms-phone"
            className="text-sm font-medium text-neutral-300 cursor-pointer select-none"
          >
            {t('register.acceptTerms')}{' '}
            <Link href="/terms" className="text-primary-400 hover:text-primary-300 font-bold underline underline-offset-4 decoration-primary-400/30">
              {t('register.termsLink')}
            </Link>
          </label>
          {errors.termsAccepted && <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">{errors.termsAccepted.message}</p>}
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full h-16 text-xl font-black bg-primary-600 hover:bg-primary-700 transition-all rounded-[1.5rem] shadow-xl shadow-primary-900/40 active:scale-[0.97] group"
      >
        {isLoading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <>
            {t('register.submit')}
            <ArrowRight className="ms-2 w-6 h-6 group-hover:translate-x-1 group-rtl:rotate-180 transition-transform" />
          </>
        )}
      </Button>
    </form>
=======
            <div className="space-y-2">
              <Label htmlFor="phone">{t('register.phone')}</Label>
              <div className="relative">
                <Phone className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="phone"
                  placeholder="+9665xxxxxxxx"
                  className={cn("ps-10 h-11 font-mono", errors.phone && "border-destructive")}
                  {...register('phone')}
                />
              </div>
              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phonePassword">{t('register.password')}</Label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="phonePassword"
                  type="password"
                  placeholder="••••••••"
                  className={cn("ps-10 h-11", errors.password && "border-destructive")}
                  {...register('password')}
                />
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneConfirmPassword">{t('register.confirmPassword')}</Label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  id="phoneConfirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className={cn("ps-10 h-11", errors.confirmPassword && "border-destructive")}
                  {...register('confirmPassword')}
                />
              </div>
              {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-start space-x-2 space-x-reverse py-2">
              <Checkbox 
                id="phoneTerms" 
                checked={termsAccepted}
                onCheckedChange={(checked) => setValue('termsAccepted', checked === true)}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="phoneTerms"
                  className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {t('register.acceptTerms')}{' '}
                  <Link href="/terms" className="text-primary-500 hover:underline">{t('register.termsLink')}</Link>
                </label>
                {errors.termsAccepted && <p className="text-[10px] text-destructive">{errors.termsAccepted.message}</p>}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-primary-500 hover:bg-primary-600 transition-all text-white font-semibold rounded-gov shadow-lg active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('register.processing')}
                </>
              ) : (
                t('register.submit')
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t py-4 mt-2">
          <p className="text-sm text-neutral-500">
            {t('register.alreadyHaveAccount')}{' '}
            <Link href="/login" className="text-primary-500 font-semibold hover:underline">
              {t('register.loginLink')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
>>>>>>> Stashed changes
  );
}
