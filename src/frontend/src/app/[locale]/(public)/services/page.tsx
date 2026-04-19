import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { 
  FileCheck, 
  RotateCcw, 
  Files, 
  ChevronUp, 
  CalendarCheck, 
  XSquare, 
  Download,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { Link } from '@/i18n/routing';

export default async function ServicesPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('public');
  const landingT = await getTranslations('landing');

  const services = [
    { key: 'issuance', icon: FileCheck },
    { key: 'renewal', icon: RotateCcw },
    { key: 'replacement', icon: Files },
    { key: 'upgrade', icon: ChevronUp },
    { key: 'booking', icon: CalendarCheck },
    { key: 'cancellation', icon: XSquare },
    { key: 'download', icon: Download },
    { key: 'retake', icon: AlertCircle }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-500 overflow-x-hidden pt-32 pb-20">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-600/5 blur-[150px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
      
      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-4xl font-black text-neutral-900 dark:text-white mb-8 tracking-tighter leading-tight">
            {t("services_page.title_line1")} <br />
            <span className="text-primary-600 dark:text-primary-500 italic">{t("services_page.title_highlight")}</span>
          </h1>
          <p className="text-xl text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
            {t("services_page.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((item, i) => (
            <Link 
              key={item.key}
              href={`/services/${item.key}`}
              className="group p-10 rounded-[2.5rem] bg-neutral-100/50 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-3xl hover:bg-neutral-900 dark:hover:bg-primary-600 transition-all duration-700 hover:-translate-y-3"
            >
              <div className="w-16 h-16 bg-primary-600/10 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-white group-hover:scale-110 transition-all duration-500">
                <item.icon className="w-8 h-8 text-primary-600 group-hover:text-primary-600 transition-colors" />
              </div>
              <h3 className="text-2xl font-black text-neutral-900 dark:text-white mb-4 group-hover:text-white transition-colors">
                {landingT(`services.items.${item.key}.title`)}
              </h3>
              <p className="text-base text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium group-hover:text-white/70 transition-colors">
                {landingT(`services.items.${item.key}.desc`)}
              </p>
              
              <div className="mt-8 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                 <span className="text-[10px] font-black uppercase tracking-widest text-white">{t("services_page.cta.start")}</span>
                 <ArrowRight className="w-4 h-4 text-white rtl:rotate-180" />
              </div>
            </Link>
          ))}
        </div>

        {/* Support Section */}
        <div className="mt-32 p-12 lg:p-20 rounded-[4rem] bg-neutral-900 text-white overflow-hidden relative">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 blur-[100px] rounded-full" />
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
              <div>
                 <h2 className="text-4xl md:text-4xl font-black mb-8 tracking-tighter leading-tight">
                    {t("services_page.support.title")}
                 </h2>
                 <p className="text-xl text-white/60 font-medium max-w-md leading-relaxed mb-10">
                    {t("services_page.support.desc")}
                 </p>
                 <Link href="/contact" className="inline-flex items-center gap-4 px-10 py-5 bg-primary-600 hover:bg-primary-500 rounded-2xl font-black uppercase tracking-widest transition-all">
                    {t("services_page.support.btn")}
                    <ArrowRight className="w-4 h-4 ltr:translate-x-1 rtl:-translate-x-1 rtl:rotate-180" />
                 </Link>
              </div>
              <div className="hidden lg:block">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                       <div className="h-40 bg-white/5 rounded-3xl border border-white/5" />
                       <div className="h-60 bg-primary-600 rounded-3xl" />
                    </div>
                    <div className="space-y-4 pt-10">
                       <div className="h-60 bg-white/5 rounded-3xl border border-white/5" />
                       <div className="h-40 bg-white/5 rounded-3xl border border-white/5" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
