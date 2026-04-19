import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { BookOpen, Download, Monitor, Phone } from 'lucide-react';

export default async function ManualsPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('public');
  const commonT = await getTranslations('common');

  const manualsItems = [
    { 
      icon: Monitor, 
      title: t("manuals.items.applicant.title"),
      desc: t("manuals.items.applicant.desc")
    },
    { 
      icon: BookOpen, 
      title: t("manuals.items.categories.title"),
      desc: t("manuals.items.categories.desc")
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 pt-32 pb-20 overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[400px] bg-primary-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <div className="max-w-3xl mb-20 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <h1 className="text-5xl font-black text-neutral-900 dark:text-white mb-8 tracking-tighter leading-tight">
            {t("manuals.title")}
          </h1>
          <p className="text-xl text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
            {t("manuals.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {manualsItems.map((manual, i) => (
            <div key={i} className="p-10 rounded-[3rem] bg-neutral-100/50 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-xl group hover:border-primary-500/30 transition-all duration-500">
              <div className="w-16 h-16 bg-primary-600/10 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <manual.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-2xl font-black text-neutral-900 dark:text-white mb-4 tracking-tight">{manual.title}</h3>
              <p className="text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed mb-8">{manual.desc}</p>
              <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors">
                <Download className="w-4 h-4" />
                {t("manuals.download_pdf")}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
