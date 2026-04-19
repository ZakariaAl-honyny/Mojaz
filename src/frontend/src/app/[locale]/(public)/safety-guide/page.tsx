import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { ShieldCheck, HeartPulse, Zap, Eye } from 'lucide-react';

export default async function SafetyGuidePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('public');
  const commonT = await getTranslations('common');

  const guides = [
    {
      icon: ShieldCheck,
      title: t("safety.items.belts.title"),
      desc: t("safety.items.belts.desc")
    },
    {
      icon: Eye,
      title: t("safety.items.focus.title"),
      desc: t("safety.items.focus.desc")
    },
    {
      icon: Zap,
      title: t("safety.items.speed.title"),
      desc: t("safety.items.speed.desc")
    },
    {
      icon: HeartPulse,
      title: t("safety.items.distance.title"),
      desc: t("safety.items.distance.desc")
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 pt-32 pb-20 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[800px] h-[400px] bg-green-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <div className="max-w-3xl mb-20 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <h1 className="text-5xl font-black text-neutral-900 dark:text-white mb-8 tracking-tighter leading-tight">
            {t("safety.title")}
          </h1>
          <p className="text-xl text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
            {t("safety.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {guides.map((guide, i) => (
            <div 
              key={i} 
              className="p-10 rounded-[2.5rem] bg-neutral-100/50 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-xl hover:border-green-500/30 transition-all duration-500 group"
            >
              <div className="w-16 h-16 bg-green-600/10 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <guide.icon className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-black text-neutral-900 dark:text-white mb-4 tracking-tight">{guide.title}</h3>
              <p className="text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">{guide.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-12 rounded-[3rem] bg-green-600 dark:bg-green-700 text-white overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 p-20 bg-white/20 blur-[100px] rounded-full" />
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-6 tracking-tight">
              {t("safety.message.title")}
            </h2>
            <p className="text-lg opacity-90 mb-10 max-w-2xl font-medium italic">
              {t("safety.message.content")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
