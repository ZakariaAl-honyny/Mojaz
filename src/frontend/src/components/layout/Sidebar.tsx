'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { 
  Home, 
  FileText, 
  Calendar, 
  User, 
  LogOut,
  Settings,
  Shield,
  Target,
  Sparkles,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import { useAuthStore } from '@/stores/auth-store';
import { motion } from 'framer-motion';

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
      "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative",
      active 
        ? "bg-primary-600 text-white shadow-xl shadow-primary-900/40" 
        : "text-neutral-400 hover:bg-white/5 hover:text-white"
    )}
  >
    <Icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110", active ? "text-white" : "text-neutral-500 group-hover:text-primary-400")} />
    {!collapsed && <span className="font-bold text-sm tracking-tight">{label}</span>}
    
    {active && !collapsed && (
      <motion.div 
        layoutId="active-pill"
        className="absolute inset-y-2 end-2 w-1 bg-white rounded-full"
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    )}

    {collapsed && (
      <div className="absolute left-full ml-4 px-3 py-2 bg-neutral-900 border border-white/10 text-white text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-50 shadow-2xl">
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
    { href: '/dashboard', icon: LayoutDashboard, label: t('dashboard'), roles: ['Applicant'] },
    { href: '/applications', icon: FileText, label: t('applications'), roles: ['Applicant'] },
    { href: '/appointments', icon: Calendar, label: t('appointments'), roles: ['Applicant'] },
    { href: '/queue', icon: FileText, label: t('applications'), roles: ['Receptionist', 'Manager', 'Security', 'Admin'] },
    { href: '/medical-results', icon: Shield, label: t('medicalResults'), roles: ['Doctor'] },
    { href: '/test-results', icon: Target, label: t('testResults'), roles: ['Examiner'] },
    { href: '/users', icon: User, label: t('users'), roles: ['Admin', 'Manager'] },
    { href: '/reports', icon: FileText, label: t('reports'), roles: ['Admin', 'Manager'] },
    { href: '/system-settings', icon: Settings, label: t('settings'), roles: ['Admin', 'Manager'] },
  ];

  const filteredItems = menuItems.filter(item => 
    !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <aside className={cn(
      "h-screen bg-neutral-950 border-e border-white/5 flex flex-col transition-all duration-500 sticky top-0 z-40",
      collapsed ? "w-24" : "w-72"
    )}>
      {/* Brand Section */}
      <div className="p-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-primary-600 rounded-[1.25rem] flex items-center justify-center font-black text-white text-2xl shadow-2xl shadow-primary-900/40 transform hover:rotate-6 transition-transform">
          M
        </div>
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="leading-tight pt-1"
          >
            <h1 className="font-black text-2xl text-white tracking-tighter">مُجاز</h1>
            <div className="flex items-center gap-1.5 grayscale opacity-50">
               <Sparkles className="w-2.5 h-2.5 text-primary-400" />
               <p className="text-[9px] text-white font-black uppercase tracking-[0.2em]">Gov Platform</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 py-8 space-y-2 overflow-y-auto custom-scrollbar">
        {filteredItems.map((item) => (
          <SidebarItem 
            key={item.href} 
            {...item} 
            active={pathname?.includes(item.href)} 
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Footer / User Profile Area */}
      <div className="px-6 py-8 border-t border-white/5 space-y-2 bg-neutral-950/50 backdrop-blur-md">
         {!collapsed && (
           <div className="px-4 py-3 mb-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-900/30 flex items-center justify-center border border-primary-500/20">
                <User className="w-5 h-5 text-primary-400" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{user?.fullName || 'User Name'}</p>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">{user?.role || 'Role'}</p>
              </div>
           </div>
         )}
         
         <SidebarItem href="/profile" icon={User} label={t('profile')} collapsed={collapsed} />
         
         <button 
           onClick={logout}
           className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all duration-300 group"
         >
           <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
           {!collapsed && <span className="font-bold text-sm">{t('logout')}</span>}
         </button>
      </div>
    </aside>
  );
}
