'use client';

import { 
  Search, 
  Menu,
  HandHelping,
  Bell,
  Activity,
  ShieldCheck,
  ChevronDown,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { NotificationBell } from '@/components/domain/notification/NotificationBell';

export default function TopNav({ onMenuClick, showSidebar = true }: { onMenuClick?: () => void, showSidebar?: boolean }) {
  const router = useRouter();
  const user = useAuthStore(state => state.user);

  const roleLabels: Record<string, string> = {
    applicant: "مواطن / متقدم",
    admin: "مدير النظام",
    receptionist: "موظف استقبال",
    doctor: "طبيب فاحص",
    examiner: "ضابط فحص",
    manager: "مدير الفرع",
    security: "أمن الإدارة",
  };

  const userRole = user?.role;
  let roleKey = '';
  if (typeof userRole === 'string') {
    roleKey = userRole.toLowerCase().trim();
  }
  const roleLabel = roleKey ? (roleLabels[roleKey] || 'مستفيد') : 'مستفيد';

  return (
    <header className={cn(
      "h-12 md:h-14 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-40 transition-all font-arabic",
      !showSidebar && "px-4"
    )} dir="rtl">
      <div className="flex items-center gap-4 md:gap-8 flex-1">
        {!showSidebar && (
           <button 
             onClick={onMenuClick}
             className="w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-50 text-neutral-400 hover:text-[#1a3a8f] transition-all active:scale-95 border border-neutral-100"
           >
             <Menu className="w-5 h-5" />
           </button>
        )}
        
        {/* Institutional Search */}
        <div className="relative max-w-sm w-full hidden md:block group">
           <Search className="absolute start-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-300 group-focus-within:text-[#1a3a8f] transition-colors" />
           <input 
             type="text" 
             placeholder="ابحث..." 
             className="w-full h-10 bg-neutral-50 border border-neutral-100 focus:border-[#1a3a8f]/30 rounded-lg ps-12 pe-4 text-xs font-bold transition-all outline-none focus:bg-white group-hover:bg-white" 
           />
        </div>
      </div>

      <div className="flex items-center gap-4">
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
          <div className="text-right hidden sm:block">
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