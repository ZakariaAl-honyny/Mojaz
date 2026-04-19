"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const t = useTranslations("landing");

  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image
                src="/images/logo.png"
                alt={t("ministry")}
                width={56}
                height={56}
                className="h-14 w-14 object-contain"
              />
              <div>
                <h3 className="text-lg font-bold">{t("nav.home")}</h3>
                <p className="text-sm text-sidebar-foreground/70">{t("footer.vision_label")}</p>
              </div>
            </Link>
            <p className="text-sidebar-foreground/70 leading-relaxed max-w-md">
              {t("footer.description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footer.about_title")}</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#services"
                  className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors"
                >
                  {t("servicesTitle")}
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors"
                >
                  {t("howItWorksTitle")}
                </Link>
              </li>
              <li>
                <Link
                  href="#categories"
                  className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors"
                >
                  {t("categoriesTitle")}
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors"
                >
                  {t("faqTitle")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t("footer.support_title")}</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/faq"
                  className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors flex items-center gap-2"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-sidebar-primary"></span>
                  {t("footer.links.faqs")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors flex items-center gap-2"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-sidebar-primary"></span>
                  {t("footer.links.contact")}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors flex items-center gap-2"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-sidebar-primary"></span>
                  {t("footer.links.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors flex items-center gap-2"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-sidebar-primary"></span>
                  {t("footer.links.terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-sidebar-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sidebar-foreground/70 text-sm">
              {t("footer.rights_reserved", { year: new Date().getFullYear() })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
