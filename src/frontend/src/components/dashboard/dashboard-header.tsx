"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { useTheme } from "@/contexts/theme-context";
import { Menu, Sun, Moon, Globe, User, LogOut, Settings } from "lucide-react";
import type { UserRole } from "@/data/mock-data";

interface DashboardHeaderProps {
  role: UserRole;
  onMenuClick: () => void;
}

export function DashboardHeader({ role, onMenuClick }: DashboardHeaderProps) {
  const t = useTranslations("common");
  const tDash = useTranslations("dashboard");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("isLoggedIn");
    router.push("/");
  };

  const roleLabel = t(`roles.${role}`);

  return (
    <header className="sticky top-6 z-40 px-6">
      <div className="max-w-7xl mx-auto h-20 bg-slate-900/40 backdrop-blur-2xl rounded-[1.5rem] border border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex items-center justify-between px-8 relative overflow-hidden group">
        {/* Animated Accent Line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
        
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden w-12 h-12 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5 text-white" />
        </Button>

        {/* Page Title / Context */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="w-1.5 h-8 bg-primary-500 rounded-full shadow-[0_0_15px_rgba(30,58,138,0.5)]" />
          <h1 className="text-xl font-black text-white tracking-tighter uppercase font-arabic">
            {tDash("sidebar.dashboard")}
          </h1>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            onClick={() => router.replace(pathname, { locale: locale === "ar" ? "en" : "ar" })}
            className="h-12 px-6 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary-500/20 text-xs font-black tracking-widest text-neutral-400 hover:text-white transition-all gap-3"
          >
            <Globe className="h-4 w-4 text-primary-400" />
            <span>{locale === "ar" ? "English" : "العربية"}</span>
          </Button>

          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="h-12 w-12 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Separator */}
          <div className="w-px h-8 bg-white/5" />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-14 gap-4 px-4 rounded-xl hover:bg-white/5 transition-all group/user">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-500/20 blur-lg rounded-full opacity-0 group-hover/user:opacity-100 transition-opacity" />
                  <div className="h-10 w-10 rounded-xl bg-primary-600/20 border border-primary-500/20 flex items-center justify-center relative z-10 transition-transform group-hover/user:scale-105">
                    <User className="h-5 w-5 text-primary-400" />
                  </div>
                </div>
                <div className="hidden sm:block text-start">
                  <p className="text-sm font-black text-white tracking-widest uppercase truncate max-w-[120px]">
                    {tDash("header.ahmed")}
                  </p>
                  <p className="text-[10px] text-primary-500 font-bold uppercase tracking-widest">{roleLabel}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-3 bg-slate-900/90 backdrop-blur-3xl border border-white/10 shadow-2xl rounded-2xl">
              <DropdownMenuLabel className="px-3 pb-3 text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                {tDash("header.accountSettings")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem className="h-12 px-4 rounded-xl focus:bg-primary-600/10 focus:text-primary-400 gap-3">
                <User className="h-4 w-4" />
                <span className="font-bold text-sm">{t("profile")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="h-12 px-4 rounded-xl focus:bg-primary-600/10 focus:text-primary-400 gap-3">
                <Settings className="h-4 w-4" />
                <span className="font-bold text-sm">{t("settings")}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem onClick={handleLogout} className="h-12 px-4 rounded-xl focus:bg-red-500/10 focus:text-red-400 gap-3">
                <LogOut className="h-4 w-4" />
                <span className="font-bold text-sm tracking-tight">{t("logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
