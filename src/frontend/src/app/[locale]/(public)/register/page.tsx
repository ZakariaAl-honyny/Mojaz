import { Link } from '@/i18n/routing';
import RegisterForm from '@/components/forms/auth/RegisterForm';
import { getTranslations } from 'next-intl/server';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default async function RegisterPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const t = await getTranslations('auth');
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowIcon className="h-5 w-5" />
          <span className="text-sm font-medium">{t("common.backToHome")}</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-2xl">
          <RegisterForm />
        </div>
      </main>
    </div>
  );
}