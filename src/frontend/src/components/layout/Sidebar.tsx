'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { 
  Home, 
  FileText, 
  Calendar, 
  CreditCard, 
  Bell, 
  User, 
  LogOut,
  ChevronRight,
  ChevronLeft,
  Settings,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  User as UserIcon,
  Shield,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import { useAuthStore } from '@/stores/auth-store';

interface SidebarItemProps {
  href: string;
  icon: any;
  label: string;
  active?: boolean;
  collapsed?: boolean;
}

const SidebarItem = ({ href, icon: Icon, label, active, collapsed }: SidebarItemProps) => (
  <Link 
    href={href} 
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
      active 
        ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20" 
        : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
    )}
  >
    <Icon className={cn("w-5 h-5", active ? "text-white" : "text-neutral-500 group-hover:text-neutral-900")} />
    {!collapsed && <span className="font-semibold text-sm">{label}</span>}
    {collapsed && (
      <div className="absolute left-full ml-2 px-2 py-1 bg-neutral-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
        {label}
      </div>
    )}
  </Link>
);

export default function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  const t = useTranslations('navigation');
  const pathname = usePathname();
  const { logout, user } = useAuthStore();

  const menuItems = [
    // Applicant Items
    { href: '/dashboard', icon: Home, label: t('dashboard'), roles: ['Applicant'] },
    { href: '/applications', icon: FileText, label: t('applications'), roles: ['Applicant'] },
    { href: '/appointments', icon: Calendar, label: t('appointments'), roles: ['Applicant'] },
    
    // Employee Items
    { href: '/queue', icon: FileText, label: t('applications'), roles: ['Receptionist', 'Manager', 'Security', 'Admin'] },

    
    // Doctor Items
    { href: '/medical-results', icon: Shield, label: t('medicalResults'), roles: ['Doctor'] },
    
    // Examiner Items
    { href: '/test-results', icon: Target, label: t('testResults'), roles: ['Examiner'] },
    
    // Admin/Manager Items
    { href: '/users', icon: User, label: t('users'), roles: ['Admin', 'Manager'] },
    { href: '/reports', icon: FileText, label: t('reports'), roles: ['Admin', 'Manager'] },
    { href: '/system-settings', icon: Settings, label: t('settings'), roles: ['Admin', 'Manager'] },
  ];

  const filteredItems = menuItems.filter(item => 
    !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <aside className={cn(
      "h-screen bg-white border-r border-neutral-100 flex flex-col transition-all duration-300 sticky top-0 rtl:border-r-0 rtl:border-l",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-primary-500/10">M</div>
        {!collapsed && (
          <div className="leading-tight">
            <h1 className="font-bold text-xl text-neutral-900 tracking-tight">مُجاز</h1>
            <p className="text-[10px] text-primary-500 font-bold uppercase tracking-wider">Mojaz Platform</p>
          </div>
        )}
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {filteredItems.map((item) => (
          <SidebarItem 
            key={item.href} 
            {...item} 
            active={pathname?.includes(item.href)} 
            collapsed={collapsed}
          />
        ))}
      </nav>

      <div className="px-4 py-6 border-t border-neutral-100 space-y-2">
         <SidebarItem href="/profile" icon={User} label={t('profile')} collapsed={collapsed} />
         <SidebarItem href="/settings" icon={Settings} label={t('settings')} collapsed={collapsed} />
         <button 
           onClick={logout}
           className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error/10 transition-all group"
         >
           <LogOut className="w-5 h-5" />
           {!collapsed && <span className="font-semibold text-sm">{t('logout')}</span>}
         </button>
      </div>
    </aside>
  );
}
