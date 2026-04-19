"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  Calendar,
  CreditCard,
  User,
  Settings,
  Users,
  ClipboardList,
  Stethoscope,
  CheckCircle,
  Shield,
  BarChart3,
  FileSearch,
  History,
} from "lucide-react";
import type { UserRole } from "@/data/mock-data";

interface SidebarProps {
  role: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  href: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItemsByRole: Record<UserRole, NavItem[]> = {
  applicant: [
    { href: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
    { href: "/applications", labelKey: "myApplications", icon: FileText },
    { href: "/applications/new", labelKey: "newApplication", icon: FilePlus },
    { href: "/appointments", labelKey: "appointments", icon: Calendar },
    { href: "/licenses", labelKey: "myLicense", icon: CreditCard },
    { href: "/settings", labelKey: "profile", icon: User },
  ],
  receptionist: [
    { href: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
    { href: "/applications", labelKey: "myApplications", icon: ClipboardList },
    { href: "/queue", labelKey: "view", icon: FileSearch },
  ],
  examiner: [
    { href: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
    { href: "/tests", labelKey: "appointments", icon: ClipboardList },
    { href: "/test-results", labelKey: "view", icon: CheckCircle },
  ],
  doctor: [
    { href: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
    { href: "/medical-results", labelKey: "appointments", icon: Stethoscope },
    { href: "/reports", labelKey: "view", icon: FileText },
  ],
  manager: [
    { href: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
    { href: "/management/applications", labelKey: "approve", icon: CheckCircle },
    { href: "/reports", labelKey: "view", icon: BarChart3 },
    { href: "/schedule", labelKey: "view", icon: Users },
  ],
  admin: [
    { href: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
    { href: "/users", labelKey: "view", icon: Users },
    { href: "/system-settings", labelKey: "settings", icon: Shield },
    { href: "/audit-logs", labelKey: "view", icon: History },
    { href: "/reports/applications", labelKey: "view", icon: BarChart3 },
    { href: "/settings", labelKey: "settings", icon: Settings },
  ],
};

export function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("common");
  const tDash = useTranslations("dashboard");
  const locale = useLocale();

  const navItems = navItemsByRole[role] || navItemsByRole.applicant;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 start-0 z-50 h-screen w-72 bg-slate-950/80 backdrop-blur-3xl border-e border-white/5 transition-transform duration-500 lg:translate-x-0 lg:static relative group",
          isOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
        )}
      >
        {/* Subtle King Blue Glow */}
        <div className="absolute top-0 right-0 w-32 h-64 bg-primary-600/10 blur-[80px] -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        
        {/* Logo Section */}
        <div className="p-8 border-b border-white/5 space-y-6">
          <Link href="/" className="flex items-center gap-4 group/logo">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full opacity-0 group-hover/logo:opacity-100 transition-opacity" />
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={48}
                height={48}
                className="h-12 w-12 object-contain relative z-10 drop-shadow-2xl brightness-110"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-black text-white tracking-widest uppercase truncate">{t("systemName")}</h2>
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.2em] truncate">
                {t("ministry")}
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-6 mt-4 space-y-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href} onClick={onClose} className="block">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full h-14 justify-start gap-4 px-6 rounded-2xl transition-all duration-500 group/item relative overflow-hidden",
                      isActive
                        ? "bg-primary-600/20 text-primary-400 border border-primary-500/20 shadow-[0_0_30px_rgba(30,58,138,0.2)]"
                        : "text-neutral-500 hover:text-white hover:bg-white/5 hover:border-white/10 border border-transparent"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute start-0 w-1 h-6 bg-primary-500 rounded-full shadow-[0_0_15px_rgba(30,58,138,0.8)]"
                      />
                    )}
                    <Icon className={cn("h-5 w-5 transition-transform duration-500 group-hover/item:scale-110", isActive && "text-primary-400")} />
                    <span className="font-black text-[12px] uppercase tracking-[0.15em]">
                      {tDash(`sidebar.${item.labelKey}`)}
                    </span>
                  </Button>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Role Badge - Glass Pill */}
        <div className="absolute bottom-0 start-0 end-0 p-8">
          <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group/badge">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary-600/10 blur-3xl rounded-full" />
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block">
                {tDash("sidebar.accessTier")}
              </span>
              <p className="text-sm font-black text-white tracking-widest uppercase flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary-500" />
                {t(`roles.${role}`)}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
