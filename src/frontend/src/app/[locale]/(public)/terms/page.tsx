import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Scale, Gavel, ShieldAlert, FileText } from 'lucide-react';

export default async function TermsPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('public');
  const commonT = await getTranslations('common');

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 pt-32 pb-20 overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[400px] bg-primary-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <div className="max-w-3xl mb-20">
          <h1 className="text-5xl font-black text-neutral-900 dark:text-white mb-8 tracking-tighter leading-tight">
            {t("terms.title")}
          </h1>
          <p className="text-xl text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
            {t("terms.subtitle")}
          </p>
        </div>

        <div className="space-y-12 max-w-4xl text-neutral-600 dark:text-neutral-400 font-medium text-lg leading-relaxed">
           <section>
              <h2 className="text-3xl font-black text-neutral-900 dark:text-white mb-6">
                {t("terms.sections.usage.title")}
              </h2>
              <p>
                {t("terms.sections.usage.content")}
              </p>
           </section>
           <section>
              <h2 className="text-3xl font-black text-neutral-900 dark:text-white mb-6">
                {t("terms.sections.legal.title")}
              </h2>
              <p>
                {t("terms.sections.legal.content")}
              </p>
           </section>
           <section>
              <h2 className="text-3xl font-black text-neutral-900 dark:text-white mb-6">
                {t("terms.sections.modifications.title")}
              </h2>
              <p>
                {t("terms.sections.modifications.content")}
              </p>
           </section>
           <section>
              <h2 className="text-3xl font-black text-neutral-900 dark:text-white mb-6">
                {t("terms.sections.law.title")}
              </h2>
              <p>
                {t("terms.sections.law.content")}
              </p>
           </section>
        </div>
      </div>
    </div>
  );
}
