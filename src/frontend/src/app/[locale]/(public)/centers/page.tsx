import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { MapPin, Phone, Clock, Star, ExternalLink, Search, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default async function CentersPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('public');
  const commonT = await getTranslations('common');

  const centers = [
    { title: t("centers.items.center1.title"), location: t("centers.items.center1.location"), rating: 4.8, status: "open", phone: "+967 1 200300", email: "center1@traffic-sana.gov.ye" },
    { title: t("centers.items.center2.title"), location: t("centers.items.center2.location"), rating: 4.9, status: "open", phone: "+967 1 200301", email: "center2@traffic-sana.gov.ye" },
    { title: t("centers.items.center3.title"), location: t("centers.items.center3.location"), rating: 4.7, status: "closing", phone: "+967 1 200302", email: "center3@traffic-sana.gov.ye" },
    { title: t("centers.items.center4.title"), location: t("centers.items.center4.location"), rating: 4.9, status: "open", phone: "+967 1 200303", email: "center4@traffic-sana.gov.ye" },
    { title: t("centers.items.center5.title"), location: t("centers.items.center5.location"), rating: 4.6, status: "open", phone: "+967 1 200304", email: "center5@traffic-sana.gov.ye" },
    { title: t("centers.items.center6.title"), location: t("centers.items.center6.location"), rating: 4.8, status: "open", phone: "+967 1 200305", email: "center6@traffic-sana.gov.ye" }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-500 overflow-x-hidden pt-32 pb-20">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-4xl font-black text-neutral-900 dark:text-white mb-8 tracking-tighter leading-tight">
              {t("centers.title_line1")} <br />
              <span className="text-primary-600 dark:text-primary-500">{t("centers.title_highlight")}</span>
            </h1>
            <p className="text-xl text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
              {t("centers.subtitle")}
            </p>
          </div>

          <div className="w-full lg:w-96">
            <div className="relative group">
              <Input
                placeholder={t("centers.search_placeholder")}
                className="h-16 px-8 ltr:pr-14 rtl:pl-14 rounded-2xl bg-neutral-100 dark:bg-white/5 border border-black/5 dark:border-white/10 text-neutral-900 dark:text-white focus:ring-primary-600 transition-all text-lg font-medium"
              />
              <Search className="absolute ltr:right-6 rtl:left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-neutral-400 group-focus-within:text-primary-600 transition-colors" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {centers.map((center, i) => (
            <div
              key={i}
              className="p-10 rounded-[3rem] bg-neutral-100/50 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-3xl group hover:border-primary-500/30 transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-10">
                <div className="w-16 h-16 bg-primary-600/10 rounded-2xl flex items-center justify-center group-hover:bg-primary-600 transition-all duration-500">
                  <MapPin className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${center.status === "open" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                  }`}>
                  {t(`centers.status.${center.status}`)}
                </div>
              </div>

              <h3 className="text-2xl font-black text-neutral-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {center.title}
              </h3>

              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3 text-neutral-500 dark:text-neutral-400 font-medium">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>{center.location}</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-500 dark:text-neutral-400 font-medium">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>{t("centers.working_hours")}</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-500 dark:text-neutral-400 font-medium">
                  <Phone className="w-4 h-4 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black tracking-widest opacity-50">{t("centers.phone_label")}</span>
                    <span>{center.phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-neutral-500 dark:text-neutral-400 font-medium">
                  <Mail className="w-4 h-4 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black tracking-widest opacity-50">{t("centers.email_label")}</span>
                    <span>{center.email}</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-black text-neutral-900 dark:text-white">{center.rating}</span>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest ml-1 font-bold">{t("centers.rating_label")}</span>
                </div>
                <Button variant="ghost" className="h-12 w-12 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-primary-600 dark:hover:bg-primary-500 hover:text-white transition-all group/btn">
                  <ExternalLink className="w-5 h-5 group-hover/btn:scale-110 transition-transform rtl:rotate-180" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
