"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { Bike, Car, Truck, Bus, Container } from "lucide-react";

const categories = [
  { icon: Bike, nameKey: "categoryA", ageKey: "categoryAAge", letter: "A" },
  { icon: Car, nameKey: "categoryB", ageKey: "categoryBAge", letter: "B" },
  { icon: Truck, nameKey: "categoryC", ageKey: "categoryCAge", letter: "C" },
  { icon: Bus, nameKey: "categoryD", ageKey: "categoryDAge", letter: "D" },
  { icon: Container, nameKey: "categoryE", ageKey: "categoryEAge", letter: "E" },
];

export function LicenseCategories() {
  const t = useTranslations("landing");

  return (
    <section id="categories" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            {t("categoriesTitle")}
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            {t("categoriesSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card
                key={index}
                className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 border-border hover:border-primary/30 text-center"
              >
                <CardContent className="p-6">
                  <Badge
                    variant="secondary"
                    className="mb-4 text-2xl font-bold h-12 w-12 rounded-full flex items-center justify-center mx-auto bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    {category.letter}
                  </Badge>
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-foreground">
                    {t(category.nameKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(category.ageKey)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
