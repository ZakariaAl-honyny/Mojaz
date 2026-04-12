import { Link } from '@/i18n/routing';
import LoginForm from '@/components/forms/auth/LoginForm';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

export default async function LoginPage() {
  const t = await getTranslations('auth');

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-neutral-950 px-6 py-24">
      {/* Background with Premium Feel */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.png"
          alt="Auth Background"
          fill
          className="object-cover opacity-50 grayscale-[50%] blur-[2px]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/40 via-neutral-950/80 to-neutral-950" />
      </div>

      <div className="w-full max-w-xl relative z-10">
        {/* Glow behind the form */}
        <div className="absolute -inset-4 bg-primary-500/20 rounded-[3rem] blur-3xl opacity-50" />
        
        <LoginForm />
        
        <div className="mt-10 text-center">
          <p className="text-neutral-400 font-medium">
            {t('login.noAccount')} {' '}
            <Link href="/register" className="text-primary-400 hover:text-primary-300 font-bold underline decoration-primary-400/30 underline-offset-4 transition-all">
              {t('login.registerNow')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
