'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Bell, 
  Search, 
  Settings, 
  User, 
  Menu,
  X,
  ChevronDown,
  Globe,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from '@/i18n/routing';

export default function TopNav({ onMenuClick, showSidebar = true }: { onMenuClick?: () => void, showSidebar?: boolean }) {
  const t = useTranslations('navigation');
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const locale = useAuthStore(state => state.locale);

  return (
    <header className={cn(
      "h-20 bg-white border-b border-neutral-100 flex items-center justify-between px-8 sticky top-0 z-40 transition-all",
      !showSidebar && "px-6"
    )}>
      <div className="flex items-center gap-6 flex-1">
        {!showSidebar && (
           <button 
             onClick={onMenuClick}
             className="md:hidden p-2 rounded-xl border border-neutral-100 text-neutral-500 hover:bg-neutral-50 transition-colors"
           >
             <Menu className="w-5 h-5" />
           </button>
        )}
        
        <div className="relative max-w-md w-full hidden md:block">
           <Search className="absolute left-4 top-3 h-4 w-4 text-neutral-400 rtl:left-auto rtl:right-4" />
           <input 
             type="text" 
             placeholder={t('search')} 
             className="w-full h-10 bg-neutral-100 border-none rounded-xl ps-10 pe-4 text-sm focus:ring-2 focus:ring-primary-500 transition-all rtl:ps-4 rtl:pe-10" 
           />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl">
          <button className="p-2 text-neutral-500 hover:text-primary-500 bg-white shadow-sm rounded-lg transition-all scale-95 hover:scale-100">
            <Bell className="w-4 h-4" />
          </button>
          <button className="p-2 text-neutral-500 hover:text-neutral-900 transition-all scale-95 hover:scale-100">
            <Globe className="w-4 h-4" />
          </button>
          <button className="p-2 text-neutral-500 hover:text-neutral-900 transition-all scale-95 hover:scale-100">
            <Moon className="w-4 h-4" />
          </button>
        </div>

        <div className="h-8 w-px bg-neutral-100 mx-2"></div>

        <button 
           className="flex items-center gap-3 p-1 ps-4 rounded-xl hover:bg-neutral-100 transition-all active:scale-[0.98]"
           onClick={() => router.push('/profile')}
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-neutral-900 leading-none">{user?.fullName || 'User Name'}</p>
            <p className="text-[10px] text-neutral-400 font-semibold uppercase mt-0.5">{user?.role || 'Applicant'}</p>
          </div>
          <div className="w-10 h-10 bg-primary-100 text-primary-500 rounded-xl flex items-center justify-center font-bold border-2 border-white shadow-sm">
             {user?.fullName?.charAt(0) || 'U'}
          </div>
        </button>
      </div>
    </header>
  );
}
