import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Search, History, CreditCard, Bell } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default async function ViolationsPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('public');
  const commonT = await getTranslations('common');

  const features = [
    {
      icon: Search,
      title: t("violations.features.direct_inquiry.title"),
      desc: t("violations.features.direct_inquiry.desc")
    },
    {
      icon: CreditCard,
      title: t("violations.features.secure_payment.title"),
      desc: t("violations.features.secure_payment.desc")
    },
    {
      icon: Bell,
      title: t("violations.features.instant_alerts.title"),
      desc: t("violations.features.instant_alerts.desc")
    },
    {
      icon: History,
      title: t("violations.features.history.title"),
      desc: t("violations.features.history.desc")
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 pt-32 pb-20 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[400px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <div className="max-w-3xl mb-20">
          <h1 className="text-5xl font-black text-neutral-900 dark:text-white mb-8 tracking-tighter leading-tight">
            {t("violations.title")}
          </h1>
          <p className="text-xl text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
            {t("violations.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 text-center lg:text-start">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className="p-8 rounded-[2.5rem] bg-neutral-100/50 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-xl hover:border-red-500/30 transition-all duration-500 group"
            >
              <div className="w-16 h-16 bg-red-600/10 rounded-[1.5rem] flex items-center justify-center mb-8 mx-auto lg:mx-0 group-hover:scale-110 transition-transform duration-500">
                <feature.icon className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-black text-neutral-900 dark:text-white mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-16 rounded-[4rem] border-2 border-dashed border-neutral-200 dark:border-white/10 flex flex-col items-center justify-center text-center bg-neutral-50 dark:bg-white/[0.02]">
          <div className="w-24 h-24 bg-neutral-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-8 border border-neutral-200 dark:border-white/10">
            <Search className="w-10 h-10 text-neutral-300" />
          </div>
          <h2 className="text-3xl font-black text-neutral-900 dark:text-white mb-6">
            {t("violations.coming_soon")}
          </h2>
          <p className="text-lg text-neutral-500 max-w-lg mb-10 font-medium">
             {t("violations.coming_soon_desc")}
          </p>
          <Link href="/">
            <button className="h-14 px-12 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
               {t("violations.back_home")}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
