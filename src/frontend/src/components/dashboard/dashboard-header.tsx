"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Menu, 
  Sun, 
  Moon, 
  User, 
  LogOut, 
  Settings, 
  Bell,
  ShieldCheck,
  ChevronDown,
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  role: string;
  onMenuClick: () => void;
}

export function DashboardHeader({ role, onMenuClick }: DashboardHeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("isLoggedIn");
    router.push("/");
  };

  const roleLabels: Record<string, string> = {
    applicant: "متقدم (مواطن)",
    admin: "مدير النظام",
    receptionist: "موظف استقبال",
    doctor: "طبيب فاحص",
    examiner: "ضابط فحص",
    manager: "مدير فرع",
    security: "مسؤول أمن",
  };

  const roleLabel = roleLabels[role.toLowerCase()] || "مستخدم النظام";

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border font-arabic h-14 flex items-center" dir="rtl">
      <div className="w-full flex items-center justify-between px-4 lg:px-6">
        {/* Mobile Menu Button & Title */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-neutral-50 rounded pl-0"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5 text-sidebar-foreground" />
          </Button>

          <div className="hidden lg:flex items-center gap-4">
             <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#1a3a8f] shadow-sm">
               <LayoutDashboard className="w-5 h-5" />
             </div>
             <div>
                <h1 className="text-xl font-black text-neutral-900 tracking-tight leading-none">لوحة التحكم</h1>
                <p className="text-xs font-bold text-neutral-400 mt-1 uppercase tracking-widest">إدارة المرور - صنعاء</p>
             </div>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          
          {/* Notifications Notification Pin */}
          <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl relative bg-neutral-50/50 hover:bg-blue-50 hover:text-[#1a3a8f] transition-all group overflow-hidden">
             <div className="absolute inset-0 bg-[#1a3a8f] translate-y-full group-hover:translate-y-0 transition-transform opacity-5"></div>
             <Bell className="w-6 h-6" />
             <span className="absolute top-3 left-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </Button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-14 px-3 rounded-[1.25rem] bg-neutral-50/50 border border-neutral-100/50 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all gap-4">
                <div className="hidden md:block text-end space-y-0.5">
                  <p className="text-sm font-black text-neutral-900 leading-none">أحمد فؤاد السلمي</p>
                  <div className="flex items-center justify-end gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-[#1a3a8f] opacity-60" />
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{roleLabel}</p>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#1a3a8f] to-black flex items-center justify-center shadow-lg shadow-blue-900/20">
                  <User className="h-5 w-5 text-white" />
                </div>
                <ChevronDown className="w-4 h-4 text-neutral-300 hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 rounded-[2rem] border-none shadow-2xl p-4 mt-2 font-arabic">
              <DropdownMenuLabel className="px-4 py-4">
                 <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-1">الحساب الشخصي</p>
                 <p className="text-lg font-black text-neutral-900 leading-tight">أحمد فؤاد السلمي</p>
                 <p className="text-xs font-bold text-[#1a3a8f] mt-1">{roleLabel}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-neutral-50 mx-2" />
              <div className="p-2 space-y-1">
                <DropdownMenuItem className="h-12 px-4 rounded-xl font-bold gap-3 focus:bg-blue-50 focus:text-[#1a3a8f] cursor-pointer">
                  <User className="h-5 w-5 opacity-40" />
                  الملف الشخصي
                </DropdownMenuItem>
                <DropdownMenuItem className="h-12 px-4 rounded-xl font-bold gap-3 focus:bg-blue-50 focus:text-[#1a3a8f] cursor-pointer">
                  <Settings className="h-5 w-5 opacity-40" />
                  إعدادات الحساب
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator className="bg-neutral-50 mx-2" />
              <div className="p-2">
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="h-12 px-4 rounded-xl font-black gap-3 text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer"
                >
                  <LogOut className="h-5 w-5 opacity-60" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
