'use client';

import { useTranslations } from 'next-intl';
import { 
  Bell, 
  Search, 
  Menu,
  Globe,
  Moon,
  HandHelping,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from '@/i18n/routing';
import { motion } from 'framer-motion';

export default function TopNav({ onMenuClick, showSidebar = true }: { onMenuClick?: () => void, showSidebar?: boolean }) {
  const t = useTranslations('navigation');
  const router = useRouter();
  const user = useAuthStore(state => state.user);

  return (
    <header className={cn(
      "h-24 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-100 dark:border-white/5 flex items-center justify-between px-8 sticky top-0 z-30 transition-all",
      !showSidebar && "px-6"
    )}>
      <div className="flex items-center gap-6 flex-1">
        {!showSidebar && (
           <button 
             onClick={onMenuClick}
             className="p-3 rounded-2xl bg-neutral-100 dark:bg-white/5 text-neutral-500 hover:text-primary-500 transition-all active:scale-95"
           >
             <Menu className="w-5 h-5" />
           </button>
        )}
        
        <div className="relative max-w-md w-full hidden md:block group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-primary-500 transition-colors rtl:left-auto rtl:right-4" />
           <input 
             type="text" 
             placeholder={t('search')} 
             className="w-full h-12 bg-neutral-50 dark:bg-white/5 border border-transparent focus:border-primary-500/20 rounded-2xl ps-12 pe-4 text-sm font-medium focus:ring-4 focus:ring-primary-500/5 transition-all outline-none rtl:ps-4 rtl:pe-12 dark:text-white" 
           />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Controls */}
        <div className="flex items-center gap-2 p-1.5 bg-neutral-50 dark:bg-white/5 rounded-2xl border border-neutral-100 dark:border-white/5">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-neutral-900" />
          </motion.button>
          
          <div className="w-px h-6 bg-neutral-200 dark:bg-white/10 mx-1" />
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 text-neutral-500 hover:text-primary-600 transition-colors"
          >
            <Globe className="w-5 h-5" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 text-neutral-500 hover:text-primary-600 transition-colors"
          >
            <Moon className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="hidden lg:flex items-center gap-2">
           <button className="flex items-center gap-2 p-3 px-4 rounded-xl text-neutral-500 hover:bg-neutral-50 dark:hover:bg-white/5 transition-all">
              <HandHelping className="w-5 h-5" />
              <span className="text-sm font-bold">الدعم</span>
           </button>
        </div>

        {/* User Profile */}
        <div className="h-10 w-px bg-neutral-100 dark:bg-white/10 hidden sm:block"></div>

        <button 
           className="flex items-center gap-3 p-1 rounded-2xl transition-all active:scale-[0.98] group"
           onClick={() => router.push('/profile')}
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-neutral-900 dark:text-white leading-none tracking-tight">
              {user?.fullName || 'User Name'}
            </p>
            <p className="text-[10px] text-primary-500 font-black uppercase tracking-widest mt-1 opacity-80">
              {user?.role || 'Applicant'}
            </p>
          </div>
          <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary-900/20 group-hover:scale-105 transition-transform border border-white/10">
             {user?.fullName?.charAt(0) || 'U'}
          </div>
        </button>
      </div>
    </header>
  );
}
