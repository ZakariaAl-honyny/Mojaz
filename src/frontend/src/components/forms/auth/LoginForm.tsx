'use client';

import { Link } from '@/i18n/routing';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Sun, Moon, Globe, Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from '@/i18n/routing';

type UserRole = 'Applicant' | 'Receptionist' | 'Examiner' | 'Doctor' | 'Manager' | 'Admin';

type LoginValues = {
  identifier: string;
  password: string;
};

const roles: { value: UserRole; key: string }[] = [
  { value: 'Applicant', key: 'applicant' },
  { value: 'Receptionist', key: 'receptionist' },
  { value: 'Examiner', key: 'examiner' },
  { value: 'Doctor', key: 'doctor' },
  { value: 'Manager', key: 'manager' },
  { value: 'Admin', key: 'admin' },
];

export default function LoginForm() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('Applicant');
  const isRTL = locale === 'ar';

  const loginSchema = z.object({
    identifier: z.string().min(5, t('errors.identifierMin')),
    password: z.string().min(8, t('errors.passwordMin')),
  });

  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true);

    // Demo mode - simulate login with selected role
    if (data.identifier === 'demo' || data.identifier === 'test') {
      const mockUser = {
        id: 'demo-user-001',
        email: 'demo@DrivingLicenseIssuanceSystem.gov.sa',
        fullName: 'Demo User',
        role: selectedRole,
        phone: '+966501234567',
        nationalId: '1234567890',
      };

      localStorage.setItem('userRole', selectedRole);
      setAuth(mockUser, 'demo-token', 'demo-refresh');
      router.push('/dashboard');
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md space-y-8 gov-glass-panel p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

      <div className="text-center space-y-4 relative z-10">
        <div className="w-24 h-24 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-[0_20px_40px_rgba(0,108,53,0.2)] border border-white/20 relative group-hover:scale-110 transition-transform duration-700 p-2">
          <img src="/images/logo.png" alt={t("common.logoAlt")} className="h-full w-full object-contain mx-auto drop-shadow-lg" />
          <div className="absolute inset-0 bg-white/5 rounded-[1.5rem] animate-pulse" />
        </div>
        <h2 className="text-3xl font-black tracking-tighter text-neutral-900 dark:text-white font-arabic leading-none">
          {t("login.title")}
        </h2>
        <p className="text-muted-foreground font-bold text-sm font-arabic">
          {t("login.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
        <div className="space-y-3">
          <Label htmlFor="identifier" className="text-foreground font-semibold ms-1">{t("login.identifier")}</Label>
          <div className="relative group">
            <Input
              id="identifier"
              type="text"
              placeholder={t("login.placeholderIdentifier")}
              {...register('identifier')}
              dir="ltr"
              data-testid="login-identifier-input"
              className="h-14 bg-background/50 border-border rounded-2xl text-white placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-english"
            />
          </div>
          {errors.identifier && (
            <p className="text-sm text-destructive font-medium ms-1">{errors.identifier.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="password" className="text-foreground font-semibold ms-1">{t("login.password")}</Label>
          <div className="relative group">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("login.placeholderPassword")}
              {...register('password')}
              dir="ltr"
              data-testid="login-password-input"
              className="h-14 bg-background/50 border-border rounded-2xl text-white placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all pe-12 font-english"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute end-2 top-2 h-10 w-10 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </Button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive font-medium ms-1">{errors.password.message}</p>
          )}
        </div>

        {/* Demo Role Selection */}
        <div className="space-y-2 p-4 rounded-xl bg-muted/30 border border-dashed border-border/80">
          <Label className="text-xs text-muted-foreground font-semibold">
            {t("login.roleSelection")}
          </Label>
          <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
            <SelectTrigger className="h-12 bg-background/80 border-border rounded-xl" data-testid="login-role-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {t(`roles.${role.key}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            data-testid="login-forgot-password-link"
            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            {t("login.forgotPassword")}
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          data-testid="login-submit-button"
          className="w-full h-14 text-lg font-black bg-primary hover:bg-primary/90 transition-all rounded-[1.2rem] shadow-xl shadow-primary/20 active:scale-[0.98] mt-2 group"
        >
          {isLoading ? (
            <div className="flex items-center gap-2 justify-center">
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              <span>{t("common.loading")}</span>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full relative">
              <span>{t("login.submit")}</span>
              <ArrowRight className="absolute end-6 w-5 h-5 group-hover:translate-x-1 group-rtl:rotate-180 transition-transform" />
            </div>
          )}
        </Button>

        <p className="text-center text-sm font-medium text-muted-foreground pt-4 border-t border-border/50">
          {t("noAccount")}{" "}
          <Link href="/register" data-testid="login-register-link" className="text-primary font-bold hover:underline transition-all">
            {t("signUp")}
          </Link>
        </p>
      </form>
    </motion.div>
  );
}