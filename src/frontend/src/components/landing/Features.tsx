"use client";

import { useTranslations } from "next-intl";
import {
  Zap,
  Shield,
  HeadphonesIcon,
  MapPin,
  Smartphone,
  Bell,
} from "lucide-react";

const features = [
  { icon: Zap, titleKey: "feature1Title", descKey: "feature1Desc" },
  { icon: Shield, titleKey: "feature2Title", descKey: "feature2Desc" },
  { icon: HeadphonesIcon, titleKey: "feature3Title", descKey: "feature3Desc" },
  { icon: MapPin, titleKey: "feature4Title", descKey: "feature4Desc" },
  { icon: Smartphone, titleKey: "feature5Title", descKey: "feature5Desc" },
  { icon: Bell, titleKey: "feature6Title", descKey: "feature6Desc" },
];

export function Features() {
  const t = useTranslations("landing");

  return (
    <section id="features" className="py-20 lg:py-28 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            {t("featuresTitle")}
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            {t("featuresSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {t(feature.descKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
