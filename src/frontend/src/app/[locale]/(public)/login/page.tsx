import { Link } from '@/i18n/routing';
import LoginForm from '@/components/forms/auth/LoginForm';
import PublicLayout from '@/components/layout/PublicLayout';

export default function LoginPage() {
  return (
    <PublicLayout>
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-neutral-50 px-6 py-24 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-50/50 via-transparent to-transparent">
        <div className="w-full max-w-lg">
          <LoginForm />
          <p className="mt-10 text-center text-sm font-semibold text-neutral-500">
            ليس لديك حساب؟ <Link href="/register" className="text-primary-500 hover:text-primary-600 underline">إنشاء حساب جديد</Link>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
