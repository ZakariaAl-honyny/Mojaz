'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Menu, Search, UserCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PublicHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-arabic h-16 flex items-center border-b border-t-2 border-t-[#D4A017]",
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
              src="/logo.png" 
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
          <Link href="/" className="text-sm font-bold text-[#1a3a8f] hover:opacity-70 transition-opacity">
            الرئيسية
          </Link>
          <Link href="/#services" className="text-sm font-bold text-neutral-500 hover:text-[#1a3a8f] transition-colors">
            الخدمات الإلكترونية
          </Link>
          <Link href="/#categories" className="text-sm font-bold text-neutral-500 hover:text-[#1a3a8f] transition-colors">
            فئات الرخصة
          </Link>
          <Link href="/#faq" className="text-sm font-bold text-neutral-500 hover:text-[#1a3a8f] transition-colors">
            الأسئلة الشائعة
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="w-10 h-10 rounded-lg text-neutral-400 hover:text-[#1a3a8f] hidden sm:flex">
             <Search className="w-5 h-5" />
          </Button>
          
          <Link href="/login">
            <Button className="h-10 px-6 bg-[#1a3a8f] hover:bg-[#152d6f] text-white rounded-lg text-sm font-bold transition-all gap-2">
              <UserCircle2 className="w-4 h-4" />
              <span>دخول المتقدمين</span>
            </Button>
          </Link>

          <Button variant="ghost" size="icon" className="lg:hidden w-10 h-10 rounded-lg text-neutral-400">
             <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
