import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Building2, Users, FileText, Globe } from 'lucide-react';

export default async function WhoWeArePage({
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <div className="max-w-3xl mb-20 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <h1 className="text-5xl font-black text-neutral-900 dark:text-white mb-8 tracking-tighter leading-tight">
            {t("who_we_are.title")}
          </h1>
          <p className="text-xl text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
            {t("who_we_are.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           <div className="p-10 rounded-[3rem] bg-neutral-100/50 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-xl">
              <h2 className="text-3xl font-black mb-6 text-neutral-900 dark:text-white leading-tight">
                {t("who_we_are.vision.title")}
              </h2>
              <p className="text-lg text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed italic">
                 {t("who_we_are.vision.content")}
              </p>
           </div>
           <div className="p-10 rounded-[3rem] bg-primary-600/10 border border-primary-500/20 backdrop-blur-xl">
              <h2 className="text-3xl font-black mb-6 text-primary-600 dark:text-primary-400 leading-tight">
                {t("who_we_are.mission.title")}
              </h2>
              <p className="text-lg text-neutral-900 dark:text-white font-medium leading-relaxed">
                 {t("who_we_are.mission.content")}
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
