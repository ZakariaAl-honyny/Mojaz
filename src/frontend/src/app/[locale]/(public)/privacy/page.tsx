import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { ShieldCheck, Lock, Eye, FileLock } from 'lucide-react';

export default async function PrivacyPage({
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
        <div className="max-w-3xl mb-20 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <h1 className="text-5xl font-black text-neutral-900 dark:text-white mb-8 tracking-tighter leading-tight">
            {t("privacy.title")}
          </h1>
          <p className="text-xl text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
            {t("privacy.subtitle")}
          </p>
        </div>

        <div className="space-y-12 max-w-4xl text-neutral-600 dark:text-neutral-400 font-medium text-lg leading-relaxed">
           <section>
              <h2 className="text-3xl font-black text-neutral-900 dark:text-white mb-6">
                {t("privacy.sections.collection.title")}
              </h2>
              <p>
                {t("privacy.sections.collection.content")}
              </p>
           </section>
           <section>
              <h2 className="text-3xl font-black text-neutral-900 dark:text-white mb-6">
                {t("privacy.sections.security.title")}
              </h2>
              <p>
                {t("privacy.sections.security.content")}
              </p>
           </section>
           <section>
              <h2 className="text-3xl font-black text-neutral-900 dark:text-white mb-6">
                {t("privacy.sections.contact.title")}
              </h2>
              <p>
                {t("privacy.sections.contact.content")}
              </p>
           </section>
        </div>
      </div>
    </div>
  );
}
