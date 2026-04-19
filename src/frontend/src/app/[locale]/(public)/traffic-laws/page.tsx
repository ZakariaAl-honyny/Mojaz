import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Shield, BookOpen, AlertCircle, Scale } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default async function TrafficLawsPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('public');
  const commonT = await getTranslations('common');

  const laws = [
    {
      icon: Shield,
      title: t("laws.items.safety.title"),
      desc: t("laws.items.safety.desc")
    },
    {
      icon: BookOpen,
      title: t("laws.items.rules.title"),
      desc: t("laws.items.rules.desc")
    },
    {
      icon: AlertCircle,
      title: t("laws.items.violations.title"),
      desc: t("laws.items.violations.desc")
    },
    {
      icon: Scale,
      title: t("laws.items.rights.title"),
      desc: t("laws.items.rights.desc")
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 pt-32 pb-20 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <div className="max-w-3xl mb-20 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <h1 className="text-5xl font-black text-neutral-900 dark:text-white mb-8 tracking-tighter leading-tight">
            {t("laws.title")}
          </h1>
          <p className="text-xl text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
            {t("laws.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {laws.map((law, i) => (
            <div 
              key={i} 
              className="p-10 rounded-[2.5rem] bg-neutral-100/50 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-xl hover:border-primary-500/30 transition-all duration-500 group"
            >
              <div className="w-16 h-16 bg-primary-600/10 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <law.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-2xl font-black text-neutral-900 dark:text-white mb-4 tracking-tight">{law.title}</h3>
              <p className="text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">{law.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-12 rounded-[3rem] bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 p-20 bg-primary-600/20 blur-[100px] rounded-full" />
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-6 tracking-tight">
              {t("laws.legal_inquiry")}
            </h2>
            <p className="text-lg opacity-70 mb-10 max-w-2xl font-medium">
              {t("laws.legal_desc")}
            </p>
            <Link href="/contact">
              <button className="h-14 px-10 rounded-2xl bg-primary-600 dark:bg-primary-500 text-white font-black uppercase tracking-widest hover:scale-105 transition-transform">
                {t("laws.contact_support")}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
