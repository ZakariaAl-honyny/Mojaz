"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon, Globe } from "lucide-react";

export function Header() {
  const t = useTranslations("common");
  const tLanding = useTranslations("landing");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleLanguage = () => {
    const newLocale = locale === "ar" ? "en" : "ar";
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and System Name */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt={t("ministry")}
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-foreground leading-tight">
                {t("systemName")}
              </h1>
              <p className="text-xs text-muted-foreground">{t("ministry")}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 me-8">
            <Link href="#services" className="text-sm font-medium hover:text-primary transition-colors">{tLanding("nav.services")}</Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">{tLanding("nav.about")}</Link>
            <Link href="#faq" className="text-sm font-medium hover:text-primary transition-colors">{tLanding("nav.faq")}</Link>
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="gap-2"
            >
              <Globe className="h-4 w-4" />
              <span>{locale === "ar" ? "English" : "العربية"}</span>
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Auth Buttons */}
            <Link href="/login">
              <Button variant="ghost">{t("auth.login")}</Button>
            </Link>
            <Link href="/register">
              <Button>{t("auth.register")}</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border py-4">
            <div className="flex flex-col gap-2">
              <Link href="#services" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">{tLanding("nav.services")}</Button>
              </Link>
              <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">{tLanding("nav.about")}</Button>
              </Link>
              <Link href="#faq" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">{tLanding("nav.faq")}</Button>
              </Link>
              <div className="h-px bg-border my-2 w-full" />
              <Button
                variant="ghost"
                onClick={() => {
                  toggleLanguage();
                  setMobileMenuOpen(false);
                }}
                className="justify-start gap-2"
              >
                <Globe className="h-4 w-4" />
                <span>{locale === "ar" ? "English" : "العربية"}</span>
              </Button>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  {t("auth.login")}
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">{t("auth.register")}</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
