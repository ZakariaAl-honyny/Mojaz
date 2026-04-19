import { Link } from '@/i18n/routing';
import LoginForm from '@/components/forms/auth/LoginForm';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function LoginPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('auth');

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Link href="/" data-testid="login-back-to-home" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <span className="text-sm font-medium">{t("common.backToHome")}</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <LoginForm />
      </main>
    </div>
  );
}