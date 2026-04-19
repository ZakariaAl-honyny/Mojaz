"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  { questionKey: "faq1Q", answerKey: "faq1A" },
  { questionKey: "faq2Q", answerKey: "faq2A" },
  { questionKey: "faq3Q", answerKey: "faq3A" },
  { questionKey: "faq4Q", answerKey: "faq4A" },
];

export function FAQ() {
  const t = useTranslations("landing");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            {t("faqTitle")}
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-border rounded-lg px-6 bg-card"
              >
                <button
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between py-4 text-start text-foreground hover:text-primary transition-all [&[data-state=open]>svg]:rotate-180"
                  data-state={isOpen ? "open" : "closed"}
                >
                  <span className="font-medium">{t(faq.questionKey)}</span>
                  <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                </button>
                <div
                  className={cn(
                    "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
                    isOpen ? "max-h-96" : "max-h-0"
                  )}
                  style={{ transition: "max-height 0.3s ease-in-out" }}
                  data-state={isOpen ? "open" : "closed"}
                >
                  <div className="pb-4 pt-0 text-muted-foreground">
                    {t(faq.answerKey)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
