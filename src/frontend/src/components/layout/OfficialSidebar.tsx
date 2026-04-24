'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  FileText, 
  Calendar, 
  User, 
  LogOut,
  Settings,
  LayoutDashboard,
  FileKey2,
  PlusCircle,
  Bell,
  Activity,
  ClipboardList,
  Stethoscope,
  Target,
  ShieldCheck,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { isEmployeeRole, isAdminRole, isApplicantRole, getRoleLabel } from '@/lib/enums';
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
      "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative",
      active 
        ? "bg-[#1a3a8f] text-white shadow-xl shadow-blue-900/30" 
        : "text-slate-400 hover:text-white hover:bg-white/5"
    )}
  >
    <Icon className={cn("w-5 h-5 flex-shrink-0 transition-all duration-300 group-hover:scale-110", active ? "text-white" : "text-slate-500 group-hover:text-white")} />
    {!collapsed && <span className="font-bold text-sm tracking-tight truncate">{label}</span>}
    
    {active && (
      <div className="absolute inset-y-3 end-0 w-1 bg-[#D4A017] rounded-full" />
    )}
  </Link>
);

export default function OfficialSidebar({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();
  const { logout, user } = useAuthStore();

  const isEmployee = isEmployeeRole(user?.role);
  const isAdmin = isAdminRole(user?.role);

  const applicantMenu = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'لوحة التحكم' },
    { href: '/applications', icon: FileText, label: 'طلباتي' },
    { href: '/applications/new', icon: PlusCircle, label: 'طلب جديد' },
    { href: '/appointments', icon: Calendar, label: 'المواعيد' },
    { href: '/licenses', icon: FileKey2, label: 'رخصتي' },
    { href: '/notifications', icon: Bell, label: 'التنبيهات' },
  ];

  const employeeMenu = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'الرئيسية' },
    { href: '/employee/queue', icon: Activity, label: 'طابور المعاملات' },
    { href: '/employee/medical-results', icon: Stethoscope, label: 'الفحص الطبي' },
    { href: '/employee/test-results', icon: Target, label: 'إدخال النتائج' },
    { href: '/employee/licenses/issue', icon: FileKey2, label: 'إصدار الرخص' },
    { href: '/employee/reports', icon: BarChart3, label: 'التقارير' },
    { href: '/notifications', icon: Bell, label: 'التنبيهات' },
  ];

  const adminMenu = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'لوحة الإشراف' },
    { href: '/admin/users', icon: User, label: 'إدارة المستخدمين' },
    { href: '/admin/settings', icon: Settings, label: 'إعدادات النظام' },
    { href: '/employee/reports', icon: BarChart3, label: 'تقارير الأداء' },
    { href: '/notifications', icon: Bell, label: 'تنبيهات النظام' },
  ];

  const menuItems = isAdmin ? adminMenu : (isEmployee ? employeeMenu : applicantMenu);

  return (
    <aside className={cn(
      "h-screen bg-[#1a3a8f] text-white border-e border-white/10 flex flex-col transition-all duration-500 sticky top-0 z-40 shadow-2xl shadow-blue-900/30 shrink-0",
      collapsed ? "w-20" : "w-64"
    )} dir="rtl">
      {/* 1. Header: Mojaz System Logo and Title */}
      <div className="px-5 py-6 flex items-center gap-3 border-b border-white/5">
        <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center p-2 shadow-xl shadow-blue-900/50">
           <ShieldCheck className="w-5 h-5 text-[#1a3a8f]" />
        </div>
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="leading-tight overflow-hidden"
          >
            <h1 className="font-black text-base text-white tracking-tight leading-none mb-1">مُـجـاز</h1>
            <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest truncate">المرور الذكي</p>
          </motion.div>
        )}
      </div>

      {/* 2. Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => (
          <SidebarItem 
            key={item.href} 
            {...item} 
            active={pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href))} 
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* 3. Footer: User Info */}
      <div className="px-3 py-4 border-t border-white/5 space-y-1.5">
          {!collapsed && (
            <div className="px-3 py-3 mb-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5">
               <div className="w-8 h-8 rounded-lg bg-[#1a3a8f]/20 flex items-center justify-center border border-[#1a3a8f]/30 flex-shrink-0">
                 <User className="w-4 h-4 text-[#1a3a8f]" />
               </div>
               <div className="overflow-hidden">
<p className="text-xs font-black text-white truncate leading-none mb-1">{user?.fullName || 'المستخدم'}</p>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 shrink-0" />
                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-wider truncate">{isApplicantRole(user?.role) ? 'حساب مواطن' : getRoleLabel(user?.role)}</p>
                  </div>
               </div>
            </div>
          )}
         
         <div className="space-y-1">
           <SidebarItem href="/profile" icon={User} label="الملف الشخصي" collapsed={collapsed} active={pathname === '/profile'} />
           
           <button 
             onClick={logout}
             className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200 group mt-2"
           >
              <LogOut className="w-5 h-5 flex-shrink-0 transition-transform group-hover:-translate-x-1" />
              {!collapsed && <span className="font-bold text-sm">تسجيل الخروج</span>}
           </button>
         </div>
      </div>
    </aside>
  );
}
