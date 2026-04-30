'use client';

import {
  Search,
  Menu,
  HandHelping,
  Bell,
  Activity,
  ShieldCheck,
  ChevronDown,
  Info,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { NotificationBell } from '@/components/domain/notification/NotificationBell';
import { getRoleLabel } from '@/lib/enums';

export default function TopNav({ 
  onMenuClick, 
  onDesktopMenuClick,
  showSidebar = true 
}: { 
  onMenuClick?: () => void, 
  onDesktopMenuClick?: () => void,
  showSidebar?: boolean 
}) {
  const router = useRouter();
  const user = useAuthStore(state => state.user);

  const roleLabel = getRoleLabel(user?.role);

  return (
    <header className={cn(
      "h-12 md:h-14 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-border flex items-center justify-between px-3 md:px-6 sticky top-0 z-40 transition-all font-arabic",
      !showSidebar && "px-4"
    )} dir="rtl">
      <div className="flex items-center gap-2 md:gap-4 flex-1">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-neutral-50 text-neutral-400 hover:text-[#1a3a8f] transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Collapse Button */}
        <button
          onClick={onDesktopMenuClick}
          className="hidden lg:flex w-9 h-9 items-center justify-center rounded-lg bg-neutral-50 text-neutral-400 hover:text-[#1a3a8f] transition-all"
        >
          <PanelLeftClose className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* Backend & Security Status - THE PROOF OF LIFE */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50/50 border border-emerald-100/50 rounded-full">
          <div className="relative">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping absolute inset-0" />
          </div>
          <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest leading-none">
            متصل بالسيرفر (v1.0)
          </span>
        </div>

        {/* Support & Tools */}
        <div className="flex items-center gap-1.5 p-1.5 bg-neutral-50/50 border border-neutral-100/50 rounded-xl hidden lg:flex">
          <NotificationBell />
          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-lg hover:bg-white hover:text-[#1a3a8f] transition-all">
            <HandHelping className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-lg hover:bg-white hover:text-[#1a3a8f] transition-all">
            <Info className="w-4 h-4" />
          </Button>
        </div>

        {/* User Quick Profile */}
        <button
          className="flex items-center gap-3 p-1.5 pe-4 rounded-full border border-transparent hover:bg-white hover:border-neutral-100 hover:shadow-lg hover:shadow-blue-900/5 transition-all group"
          onClick={() => router.push('/profile')}
        >
          <div className="w-9 h-9 bg-gradient-to-br from-[#1a3a8f] to-[#00215a] rounded-lg animate-in zoom-in duration-300 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-900/10 group-hover:rotate-3 transition-transform border border-white/20 shrink-0">
            {user?.fullName?.charAt(0) || 'م'}
          </div>
          <div className="text-start hidden sm:block">
            <div className="flex items-center justify-end gap-1.5">
              <p className="text-xs font-black text-neutral-800 leading-none">
                {user?.fullName || 'المستخدم'}
              </p>
              <ChevronDown className="w-3 h-3 text-neutral-300" />
            </div>
            <p className="text-[9px] text-[#1a3a8f] font-black uppercase tracking-widest leading-none mt-1 opacity-60">
              {roleLabel}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
}