import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import {
  Plus,
  HelpCircle,
  Search,
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';

export default async function FAQPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('public');
  const commonT = await getTranslations('common');

  const faqItems = [
    { q: t('faq.items.q1.q'), a: t('faq.items.q1.a') },
    { q: t('faq.items.q2.q'), a: t('faq.items.q2.a') },
    { q: t('faq.items.q3.q'), a: t('faq.items.q3.a') },
    { q: t('faq.items.q4.q'), a: t('faq.items.q4.a') },
    { q: t('faq.items.q5.q'), a: t('faq.items.q5.a') },
    { q: t('faq.items.q6.q'), a: t('faq.items.q6.a') }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-500 overflow-x-hidden pt-32 pb-20">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-4xl font-black text-neutral-900 dark:text-white mb-8 tracking-tighter leading-tight">
            {t("faq.title_line1")} <br />
            <span className="text-primary-600 dark:text-primary-500 italic">{t("faq.title_highlight")}</span>
          </h1>
          <p className="text-xl text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed mb-12">
            {t("faq.subtitle")}
          </p>

          <div className="relative max-w-xl mx-auto group">
            <Input
              placeholder={t("faq.search_placeholder")}
              className="h-14 px-8 ltr:pr-14 rtl:pl-14 rounded-2xl bg-neutral-100 dark:bg-white/10 border-none text-neutral-900 dark:text-white focus:ring-primary-600 transition-all text-lg font-medium shadow-2xl"
            />
            <Search className="absolute ltr:right-6 rtl:left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-neutral-400" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {faqItems.map((item, i) => (
            <div
              key={i}
              className="group rounded-[2.5rem] bg-neutral-100/50 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-3xl overflow-hidden hover:border-primary-500/30 transition-all duration-500"
            >
              <div className="px-10 py-8 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-6">
                  <div className="w-10 h-10 rounded-xl bg-primary-600/10 flex items-center justify-center text-primary-600 font-black">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {item.q}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-neutral-400 group-hover:rotate-90 transition-all rtl:rotate-180">
                  <Plus className="w-5 h-5" />
                </div>
              </div>
              <div className="px-10 pb-10 pt-0 opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto transition-all duration-500 overflow-hidden">
                <p className="text-base text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed py-6 border-t border-black/5 dark:border-white/5">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-32 text-center">
          <div className="inline-flex items-center gap-4 p-8 rounded-[3rem] bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 px-12 group hover:scale-105 transition-all duration-500 cursor-pointer shadow-2xl">
            <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center text-white">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div className="text-start">
              <div className="text-[10px] font-black uppercase tracking-widest opacity-50">{t("faq.cta.title")}</div>
              <div className="text-xl font-black tracking-tight">{t("faq.cta.btn")}</div>
            </div>
            <ArrowRight className="w-5 h-5 ltr:ml-4 rtl:mr-4 rtl:rotate-180 group-hover:translate-x-2 rtl:group-hover:-translate-x-2 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}
