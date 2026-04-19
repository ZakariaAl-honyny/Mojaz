"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  FileText,
  RefreshCw,
  FileX2,
  ArrowUpCircle,
  FilePlus,
  Shield,
  Calendar,
  Smartphone,
} from "lucide-react";

const serviceItems = [
  { id: "issuance", icon: FilePlus, titleKey: "services.items.issuance.title", descKey: "services.items.issuance.desc" },
  { id: "renewal", icon: RefreshCw, titleKey: "services.items.renewal.title", descKey: "services.items.renewal.desc" },
  { id: "replacement", icon: Shield, titleKey: "services.items.replacement.title", descKey: "services.items.replacement.desc" },
  { id: "upgrade", icon: ArrowUpCircle, titleKey: "services.items.upgrade.title", descKey: "services.items.upgrade.desc" },
  { id: "retake", icon: FileText, titleKey: "services.items.retake.title", descKey: "services.items.retake.desc" },
  { id: "booking", icon: Calendar, titleKey: "services.items.booking.title", descKey: "services.items.booking.desc" },
  { id: "cancellation", icon: FileX2, titleKey: "services.items.cancellation.title", descKey: "services.items.cancellation.desc" },
  { id: "download", icon: Smartphone, titleKey: "services.items.download.title", descKey: "services.items.download.desc" },
];

export function Services() {
  const t = useTranslations("landing");

  return (
    <section id="services" className="py-20 lg:py-28 bg-background relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4 uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {t("services.v1_badge") || "MVP Version 1.0 - Active Services"}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            {t("servicesTitle")}
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            {t("servicesSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceItems.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link key={service.id} href="/login">
                <Card
                  className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 border-border hover:border-primary/30 h-full"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      {t(service.titleKey)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(service.descKey)}
                    </p>
                    <div className="mt-4 flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      {t("services.explore") || "Explore Service"}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
