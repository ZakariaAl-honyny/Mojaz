import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default async function ContactPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('public');
  const commonT = await getTranslations('common');

  const contactItems = [
    { icon: MapPin, title: t("contact.info.address.title"), content: t("contact.info.address.content") },
    { icon: Phone, title: t("contact.info.phone.title"), content: t("contact.info.phone.content") },
    { icon: Mail, title: t("contact.info.email.title"), content: t("contact.info.email.content") },
    { icon: Clock, title: t("contact.info.hours.title"), content: t("contact.info.hours.content") }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 pt-32 pb-20 overflow-hidden">
      <div className="absolute top-0 left-0 w-[800px] h-[400px] bg-primary-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <div className="max-w-3xl mb-20">
          <h1 className="text-5xl font-black text-neutral-900 dark:text-white mb-8 tracking-tighter leading-tight">
            {t("contact.title")}
          </h1>
          <p className="text-xl text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Info */}
          <div className="space-y-8">
            {contactItems.map((item, i) => (
              <div key={i} className="flex gap-6 items-start p-8 rounded-[2.5rem] bg-neutral-100/50 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-xl group hover:border-primary-500/30 transition-all duration-500">
                <div className="w-14 h-14 bg-primary-600/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                  <item.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-black text-neutral-900 dark:text-white mb-1 tracking-tight">{item.title}</h3>
                  <p className="text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">{item.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form Placeholder */}
          <div className="p-12 rounded-[3.5rem] bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-32 bg-primary-600/20 blur-[120px] rounded-full" />
             <div className="relative z-10 h-full flex flex-col justify-center text-center lg:text-start">
               <h2 className="text-3xl font-black mb-6 tracking-tight">
                 {t("contact.form.title")}
               </h2>
               <p className="text-lg opacity-70 mb-10 font-medium">
                 {t("contact.form.desc")}
               </p>
               <div className="space-y-4">
                 <div className="h-14 bg-white/10 dark:bg-neutral-900/5 rounded-2xl border border-white/20 dark:border-neutral-200" />
                 <div className="h-14 bg-white/10 dark:bg-neutral-900/5 rounded-2xl border border-white/20 dark:border-neutral-200" />
                 <div className="h-40 bg-white/10 dark:bg-neutral-900/5 rounded-2xl border border-white/20 dark:border-neutral-200" />
               </div>
               <button className="h-14 mt-10 w-full rounded-2xl bg-primary-600 dark:bg-primary-500 text-white font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all">
                 {t("contact.form.send")}
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
