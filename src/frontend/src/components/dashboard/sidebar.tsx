"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
type UserRole = string;

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
    { href: "/dashboard", labelKey: "لوحة التحكم", icon: LayoutDashboard },
    { href: "/dashboard/applications", labelKey: "طلباتي", icon: FileText },
    { href: "/dashboard/new-application", labelKey: "طلب جديد", icon: FilePlus },
    { href: "/dashboard/appointments", labelKey: "مواعيدي", icon: Calendar },
    { href: "/dashboard/license", labelKey: "رخصتي", icon: CreditCard },
    { href: "/dashboard/profile", labelKey: "الملف الشخصي", icon: User },
  ],
  receptionist: [
    { href: "/dashboard", labelKey: "لوحة التحكم", icon: LayoutDashboard },
    { href: "/dashboard/applications", labelKey: "الطلبات", icon: ClipboardList },
    { href: "/dashboard/review", labelKey: "المراجعة", icon: FileSearch },
  ],
  examiner: [
    { href: "/dashboard", labelKey: "لوحة التحكم", icon: LayoutDashboard },
    { href: "/dashboard/tests", labelKey: "الاختبارات", icon: ClipboardList },
    { href: "/dashboard/results", labelKey: "النتائج", icon: CheckCircle },
  ],
  doctor: [
    { href: "/dashboard", labelKey: "لوحة التحكم", icon: LayoutDashboard },
    { href: "/dashboard/medical", labelKey: "الفحص الطبي", icon: Stethoscope },
    { href: "/dashboard/reports", labelKey: "التقارير", icon: FileText },
  ],
  manager: [
    { href: "/dashboard", labelKey: "لوحة التحكم", icon: LayoutDashboard },
    { href: "/dashboard/approvals", labelKey: "الموافقات", icon: CheckCircle },
    { href: "/dashboard/statistics", labelKey: "الإحصائيات", icon: BarChart3 },
    { href: "/dashboard/staff", labelKey: "الموظفين", icon: Users },
  ],
  admin: [
    { href: "/dashboard", labelKey: "لوحة التحكم", icon: LayoutDashboard },
    { href: "/dashboard/users", labelKey: "المستخدمين", icon: Users },
    { href: "/dashboard/policies", labelKey: "السياسات", icon: Shield },
    { href: "/dashboard/audit", labelKey: "سجل النظام", icon: History },
    { href: "/dashboard/reports", labelKey: "التقارير", icon: BarChart3 },
    { href: "/dashboard/settings", labelKey: "الإعدادات", icon: Settings },
  ],
};

export function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = navItemsByRole[role] || navItemsByRole.applicant;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 start-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground border-e border-sidebar-border transition-transform duration-300 lg:translate-x-0 lg:static flex flex-col sticky",
          isOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold truncate">نظام إصدار رخص القيادة الإلكتروني</h2>
              <p className="text-xs text-sidebar-foreground/70 truncate">
                الإدارة العامة للمرور
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href} onClick={onClose} className="block">
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.labelKey}</span>
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Role Badge and Footer */}
        <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/20">
          <div className="text-center mb-4">
            <span className="text-xs text-sidebar-foreground/60">
              الدور:
            </span>
            <p className="text-sm font-medium text-sidebar-primary">
              {role}
            </p>
          </div>
          <Button variant="ghost" className="w-full justify-start gap-3 text-red-300 hover:text-red-300 hover:bg-red-500/20" onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.removeItem("userRole");
              localStorage.removeItem("isLoggedIn");
              window.location.href = "/";
            }
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out h-5 w-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            <span>تسجيل الخروج</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
