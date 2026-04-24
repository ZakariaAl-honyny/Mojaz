import Link from 'next/link';
import LoginForm from '@/components/forms/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 font-arabic" dir="rtl">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}