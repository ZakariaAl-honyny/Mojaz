'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Globe, User, LogOut, LayoutDashboard, ShieldCheck, Search, Bell, Menu } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { cn } from '@/lib/utils';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-arabic px-6 lg:px-12 flex items-center justify-center",
        isScrolled ? "h-20 bg-white/90 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(26,58,143,0.1)] border-b border-blue-50/50" : "h-28"
      )} 
      dir="rtl"
    >
      <div className="container mx-auto flex items-center justify-between gap-12">
        
        {/* Brand Section */}
        <div className="flex items-center gap-16">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-[#1a3a8f] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-900/20 group-hover:rotate-3 transition-transform border border-white/20">
              م
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter text-neutral-900 leading-none">
                مُجـاز
              </span>
              <div className="flex items-center gap-1.5 opacity-60 mt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1a3a8f]" />
                <span className="text-[10px] text-[#1a3a8f] font-black uppercase tracking-[0.2em] whitespace-nowrap">المرور - صنعاء</span>
              </div>
            </div>
          </Link>

          {/* Premium Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-10">
            <Link href="/services" className="text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-[#1a3a8f] transition-all relative group py-2">
              الخدمات الإلكترونية
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[#1a3a8f] group-hover:w-full transition-all duration-500 rounded-full"></span>
            </Link>
            <Link href="/manual" className="text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-[#1a3a8f] transition-all relative group py-2">
              دليل الاستخدام
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[#1a3a8f] group-hover:w-full transition-all duration-500 rounded-full"></span>
            </Link>
            <Link href="/centers" className="text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-[#1a3a8f] transition-all relative group py-2">
              المراكز المعتمدة
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[#1a3a8f] group-hover:w-full transition-all duration-500 rounded-full"></span>
            </Link>
            <Link href="/verify" className="text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-[#1a3a8f] transition-all relative group py-2">
              التحقق من البيانات
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[#1a3a8f] group-hover:w-full transition-all duration-500 rounded-full"></span>
            </Link>
          </div>
        </div>

        {/* Action Layer */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl hover:bg-neutral-50 hidden md:flex active:scale-95 transition-all text-neutral-400 hover:text-[#1a3a8f]">
             <Search className="w-5 h-5" />
          </Button>

          <div className="h-10 w-px bg-neutral-100 mx-2 hidden xl:block" />

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
               <Link href="/dashboard">
                <Button className="h-12 px-6 rounded-2xl bg-[#1a3a8f] hover:bg-[#002868] font-black text-sm gap-3 shadow-xl shadow-blue-900/10 active:scale-[0.97] transition-all">
                  <LayoutDashboard className="w-4 h-4" />
                  لوحة التحكم
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={logout}
                className="w-12 h-12 rounded-2xl text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="h-10 md:h-11 px-5 md:px-6 rounded-md font-black text-sm text-neutral-500 hover:text-[#1a3a8f] hover:bg-blue-50 transition-all">
                  دخول الموظفين
                </Button>
              </Link>
              <Link href="/register">
                <Button className="h-10 md:h-11 px-6 md:px-8 rounded-md bg-[#1a3a8f] hover:bg-[#002868] text-white font-black text-sm transition-all">
                  نظام المراجعة
                </Button>
              </Link>
            </div>
          )}

<Button variant="ghost" size="icon" className="xl:hidden w-10 h-10 rounded-md bg-neutral-50 border border-neutral-100 text-neutral-400 active:scale-95 transition-all">
             <Menu className="w-4 h-4 md:w-5 md:h-5" />
           </Button>
        </div>
      </div>
    </nav>
  );
}
