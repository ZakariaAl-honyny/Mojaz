'use client';

import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [locale, setLocale] = useState<'ar' | 'en'>('ar');

  const t = (key: string) => {
    const translations: Record<string, string> = {
      'reset.title': locale === 'ar' ? 'تغيير كلمة المرور' : 'Change Password',
      'reset.current': locale === 'ar' ? 'كلمة المرور الحالية' : 'Current Password',
      'reset.new': locale === 'ar' ? 'كلمة المرور الجديدة' : 'New Password',
      'reset.confirm': locale === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password',
      'reset.submit': locale === 'ar' ? 'تغيير كلمة المرور' : 'Change Password',
      'reset.success': locale === 'ar' ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully',
      'reset.mismatch': locale === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match',
      'reset.error': locale === 'ar' ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'An error occurred. Please try again.',
      'reset.login': locale === 'ar' ? 'تسجيل الدخول' : 'Login',
    };
    return translations[key] || key;
  };

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
        router.push(`/${locale}/login`);
      }, 2000);
    } catch (err) {
      setError(t('reset.error'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <p className="text-lg font-semibold text-green-600">{t('reset.success')}</p>
            <Button
              onClick={() => router.push(`/${locale}/login`)}
              className="mt-4 bg-primary-500"
            >
              {t('reset.login')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-primary-900">{t('reset.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('reset.current')}</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('reset.new')}</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('reset.confirm')}</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 hover:bg-primary-600"
            >
              {loading ? '...' : t('reset.submit')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}