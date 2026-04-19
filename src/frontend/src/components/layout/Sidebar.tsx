'use client';

import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import { useAuthStore } from '@/stores/auth-store';
import { useTranslations } from 'next-intl';
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
  LogOut,
  DollarSign,
} from 'lucide-react';
import { useRouter } from '@/i18n/routing';

interface SidebarItemProps {
  href: string;
  icon: any;
  label: string;
  active?: boolean;
}

const SidebarItem = ({ href, icon: Icon, label, active }: SidebarItemProps) => (
  <Link 
    href={href} 
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
      active 
        ? "bg-sidebar-accent text-sidebar-accent-foreground" 
        : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
    )}
  >
    <Icon className="h-5 w-5" />
    <span className="text-sm">{label}</span>
  </Link>
);

export default function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const { logout, user } = useAuthStore();
  const router = useRouter();
  const isRTL = locale === 'ar';

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const role = user?.role || 'Applicant';

  const navItemsByRole: Record<string, { href: string; labelKey: string; icon: any }[]> = {
    Applicant: [
      { href: '/dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
      { href: '/applications', labelKey: 'myApplications', icon: FileText },
      { href: '/applications/new', labelKey: 'newApplication', icon: FilePlus },
      { href: '/appointments', labelKey: 'appointments', icon: Calendar },
      { href: '/licenses', labelKey: 'myLicense', icon: CreditCard },
      { href: '/profile', labelKey: 'profile', icon: User },
    ],
    Receptionist: [
      { href: '/dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
      { href: '/queue', labelKey: 'myApplications', icon: ClipboardList },
      { href: '/licenses/verify', labelKey: 'verifyLicense', icon: FileSearch },
    ],
    Examiner: [
      { href: '/dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
      { href: '/tests', labelKey: 'tests', icon: ClipboardList },
      { href: '/test-results', labelKey: 'results', icon: CheckCircle },
    ],
    Doctor: [
      { href: '/dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
      { href: '/medical-results', labelKey: 'medicalExam', icon: Stethoscope },
    ],
    Manager: [
      { href: '/dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
      { href: '/queue', labelKey: 'approve', icon: CheckCircle },
      { href: '/reports', labelKey: 'reports', icon: BarChart3 },
      { href: '/users', labelKey: 'users', icon: Users },
    ],
    Admin: [
      { href: '/dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
      { href: '/users', labelKey: 'users', icon: Users },
      { href: '/fees', labelKey: 'fees', icon: DollarSign },
      { href: '/system-settings', labelKey: 'settings', icon: Settings },
      { href: '/audit-logs', labelKey: 'auditLogs', icon: History },
      { href: '/reports', labelKey: 'reports', icon: BarChart3 },
    ],
  };

  const navItems = navItemsByRole[role] || navItemsByRole.Applicant;

  // Get role label key
  const roleLabelKey = `role${role.charAt(0).toUpperCase() + role.slice(1)}`;

  return (
    <aside className={cn(
      "fixed top-0 start-0 z-50 h-screen bg-sidebar text-sidebar-foreground border-e border-sidebar-border transition-all duration-300",
      collapsed ? "w-20" : "w-64",
      "rtl:start-auto rtl:end-0"
    )}>
      {/* Logo Section */}
      <div className="p-4 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-3">
          <img 
            src="/images/logo.png" 
            alt="Logo" 
            className="h-10 w-10 object-contain" 
          />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold truncate">{t("systemName")}</h2>
              <p className="text-xs text-sidebar-foreground/70 truncate">
                {t("ministry")}
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <SidebarItem 
              key={item.href} 
              href={item.href}
              icon={Icon}
              label={t(item.labelKey)}
              active={isActive}
            />
          );
        })}
      </nav>

      {/* Bottom Section - Profile & Logout */}
      <div className="absolute bottom-0 start-0 end-0 p-4 border-t border-sidebar-border">
        {!collapsed && (
          <div className="mb-4 text-center">
            <span className="text-xs text-sidebar-foreground/60">
              {t("user.role")}:
            </span>
            <p className="text-sm font-medium text-sidebar-primary">
              {t(roleLabelKey)}
            </p>
          </div>
        )}
        
        <div className="flex flex-col gap-1">
          <Link 
            href="/profile"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors",
              collapsed && "justify-center"
            )}
          >
            <User className="h-5 w-5" />
            {!collapsed && <span className="text-sm">{t("profile")}</span>}
          </Link>
          
          <button 
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors",
              collapsed && "justify-center"
            )}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="text-sm">{t("logout")}</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}