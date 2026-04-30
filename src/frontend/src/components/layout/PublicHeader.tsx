'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, UserCircle2, LogOut, LayoutDashboard, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

export default function PublicHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuthStore();

  // Initialize active link based on current path/hash
  useEffect(() => {
    if (pathname !== '/') {
      setActiveLink(pathname);
    } else {
      setActiveLink(window.location.hash || '/');
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/#services', label: 'الخدمات الإلكترونية' },
    { href: '/#categories', label: 'فئات الرخصة' },
    { href: '/#faq', label: 'الأسئلة الشائعة' },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 start-0 end-0 z-50 transition-all duration-300 font-arabic h-16 flex items-center border-b border-t-2 border-t-[#D4A017]",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-neutral-200"
          : "bg-white/80 backdrop-blur-sm border-transparent"
      )}
      dir="rtl"
    >
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 shrink-0">
            <img
              src="/images/logo.png"
              alt="شعار الإدارة العامة للمرور"
              className="w-full h-full object-contain transition-transform group-hover:scale-105"
            />
          </div>
          <div className="leading-tight">
            <span className="text-lg font-black text-[#1a3a8f] block tracking-tight">
              نظام رخص القيادة
            </span>
            <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block">
              الجمهورية اليمنية · الإدارة العامة للمرور
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isLinkActive = activeLink === link.href || (link.href.startsWith('/#') && activeLink === link.href.substring(1));

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setActiveLink(link.href)}
                className={cn(
                  "text-sm font-bold transition-all relative group py-2",
                  isLinkActive ? "text-[#1a3a8f]" : "text-neutral-500 hover:text-[#1a3a8f]"
                )}
              >
                {link.label}
                <span className={cn(
                  "absolute -bottom-1 start-0 h-0.5 bg-[#1a3a8f] transition-all duration-500 rounded-full",
                  isLinkActive ? "w-full" : "w-0 group-hover:w-full"
                )}></span>
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="hidden sm:block">
                <Button className="h-10 px-5 bg-[#1a3a8f] hover:bg-[#152d6f] text-white rounded-lg text-sm font-bold transition-all gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>لوحة التحكم</span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="w-10 h-10 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="h-10 px-5 text-neutral-600 hover:text-[#1a3a8f] hover:bg-blue-50 rounded-lg text-sm font-bold transition-all">
                  <span>تسجيل الدخول</span>
                </Button>
              </Link>
              <Link href="/register">
                <Button className="h-10 px-6 bg-[#1a3a8f] hover:bg-[#152d6f] text-white rounded-lg text-sm font-bold transition-all gap-2">
                  <span>إنشاء حساب</span>
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden w-10 h-10 rounded-lg text-neutral-500 hover:bg-blue-50">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="start" className="w-[300px] sm:w-[350px] p-0 border-none font-arabic" dir="rtl">
              <SheetHeader className="p-6 border-b border-neutral-100 bg-neutral-50/50">
                <div className="flex items-center gap-3">
                  <img src="/images/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                  <SheetTitle className="text-right font-black text-[#1a3a8f]">نظام مُجاز</SheetTitle>
                </div>
              </SheetHeader>
              <div className="flex flex-col p-6 gap-6">
                <div className="space-y-4">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setActiveLink(link.href)}
                        className={cn(
                          "flex items-center h-12 px-4 rounded-xl font-bold transition-all",
                          (activeLink === link.href || (link.href.startsWith('/#') && activeLink === link.href.substring(1)))
                            ? "bg-[#1a3a8f]/5 text-[#1a3a8f] ring-1 ring-[#1a3a8f]/10"
                            : "text-neutral-500 hover:bg-neutral-50 hover:text-[#1a3a8f]"
                        )}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </div>

                <div className="h-px bg-neutral-100 my-2" />

                {!isAuthenticated ? (
                  <div className="flex flex-col gap-3">
                    <SheetClose asChild>
                      <Link href="/login">
                        <Button variant="outline" className="w-full h-12 rounded-xl font-black text-[#1a3a8f] border-blue-100">تسجيل الدخول</Button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/register">
                        <Button className="w-full h-12 rounded-xl font-black bg-[#1a3a8f] hover:bg-[#152d6f]">إنشاء حساب جديد</Button>
                      </Link>
                    </SheetClose>
                  </div>
                ) : (
                  <SheetClose asChild>
                    <Link href="/dashboard">
                      <Button className="w-full h-12 rounded-xl font-black bg-[#1a3a8f] hover:bg-[#152d6f] gap-3">
                        <LayoutDashboard className="w-5 h-5" />
                        لوحة التحكم
                      </Button>
                    </Link>
                  </SheetClose>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
