import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { ShieldCheck, Target, Award, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('public');
  const commonT = await getTranslations('common');

  const stats = [
    { icon: Users, label: t("about.stats.users.label"), value: t("about.stats.users.value") },
    { icon: Award, label: t("about.stats.excellence.label"), value: t("about.stats.excellence.value") },
    { icon: Target, label: t("about.stats.efficiency.label"), value: t("about.stats.efficiency.value") },
    { icon: ShieldCheck, label: t("about.stats.security.label"), value: t("about.stats.security.value") }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-500 overflow-x-hidden pt-32 pb-20">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <div className="mb-20">
          <h1 className="text-4xl md:text-4xl font-black text-neutral-900 dark:text-white mb-6 tracking-tighter leading-tight">
            {t("about.title")} <span className="text-primary-600 dark:text-primary-500">{t("branding.project")}</span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-500 dark:text-neutral-400 font-medium max-w-2xl leading-relaxed">
            {t("about.hero_subtitle")}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-8 rounded-[2.5rem] bg-neutral-100/50 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-xl group hover:border-primary-500/30 transition-all duration-500"
            >
              <div className="w-12 h-12 bg-primary-600/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <stat.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="text-3xl font-black text-neutral-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600/10 rounded-full border border-primary-600/20">
              <ShieldCheck className="w-4 h-4 text-primary-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600">{t("about.vision.badge")}</span>
            </div>
            <h2 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight leading-snug">
              {t("about.vision.title")}
            </h2>
            <div className="space-y-6 text-lg text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
              <p>{t("about.vision.p1")}</p>
              <p>{t("about.vision.p2")}</p>
              <p>{t("about.vision.p3")}</p>
            </div>
            <div className="pt-6">
              <Link href="/register">
                <Button className="h-14 px-10 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-black uppercase tracking-widest hover:bg-primary-600 dark:hover:bg-primary-500 group transition-all duration-500">
                  {t("about.journey.btn")}
                  <ArrowRight className="w-4 h-4 ltr:ml-2 rtl:mr-2 rtl:rotate-180 group-hover:translate-x-2 rtl:group-hover:-translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative h-[600px] rounded-[3rem] overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-600 to-transparent opacity-20 dark:opacity-40" />
            <div className="absolute inset-0 bg-neutral-900/10 backdrop-blur-[2px]" />
            <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-neutral-950 to-transparent">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-2xl text-primary-600">
                  {locale === 'ar' ? "م" : "M"}
                </div>
                <div className="text-white font-black uppercase tracking-[0.2em] text-xs">{t("about.visual.certified")}</div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{t("about.visual.title")}</h3>
              <p className="text-white/60 font-medium">{t("about.visual.desc")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
