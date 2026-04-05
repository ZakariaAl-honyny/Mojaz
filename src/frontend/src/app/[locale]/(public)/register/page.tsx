import RegisterForm from '@/components/forms/auth/RegisterForm';
import PublicLayout from '@/components/layout/PublicLayout';

export default function RegisterPage() {
  return (
    <PublicLayout>
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-neutral-50 px-4 py-20">
        <div className="w-full max-w-lg">
          <RegisterForm />
          <p className="mt-8 text-center text-sm text-neutral-500">
            لديك حساب بالفعل؟ <a href="/login" className="text-primary-500 font-semibold hover:underline">تسجيل الدخول</a>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
