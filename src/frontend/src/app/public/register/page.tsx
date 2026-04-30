'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { Mail, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmailRegistrationForm } from '@/components/domain/auth/EmailRegistrationForm';
import { PhoneRegistrationForm } from '@/components/domain/auth/PhoneRegistrationForm';

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 py-12 font-arabic" dir="rtl">
      {/* Navigation */}
      <div className="w-full max-w-xl flex items-center justify-between mb-4 px-2">
        <Link href="/" className="flex items-center gap-2 text-neutral-400 hover:text-[#1a3a8f] transition-colors text-xs font-black group">
          <Home className="w-4 h-4" />
          <span className="group-hover:underline decoration-2 underline-offset-4">الرئيسية</span>
        </Link>
      </div>

      <div className="w-full max-w-xl space-y-8">
        <div className="bg-white border-0 p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 ring-1 ring-neutral-100 animate-fade-in relative overflow-hidden">
          {/* Brand Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#1a3a8f]/5 rounded-bl-full blur-2xl" />

          <div className="text-center space-y-4 mb-10 relative z-10">
            <img
              src="/images/logo.png"
              alt="Mojaz Logo"
              className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 object-contain"
            />
            <h1 className="text-xl md:text-2xl font-black text-[#1a3a8f] tracking-tight">إنشاء حساب جديد</h1>
            <p className="text-neutral-400 font-bold text-sm max-w-sm mx-auto leading-relaxed">انضم إلى المنظومة الإلكترونية الموحدة لخدمات المرور.</p>
          </div>

          {/* Institutional Tabs */}
          <div className="flex p-2 bg-neutral-50 rounded-[1.5rem] mb-10 border border-neutral-100 relative z-10">
            <button
              onClick={() => setActiveTab('email')}
              className={cn(
                "flex-1 flex items-center justify-center gap-3 py-4 text-sm font-black rounded-2xl transition-all duration-500",
                activeTab === 'email'
                  ? "bg-[#1a3a8f] text-white shadow-xl shadow-blue-900/20"
                  : "text-neutral-400 hover:text-[#1a3a8f] hover:bg-white"
              )}
            >
              <Mail className="w-5 h-5" />
              <span>البريد الإلكتروني</span>
            </button>
            <button
              onClick={() => setActiveTab('phone')}
              className={cn(
                "flex-1 flex items-center justify-center gap-3 py-4 text-sm font-black rounded-2xl transition-all duration-500",
                activeTab === 'phone'
                  ? "bg-[#1a3a8f] text-white shadow-xl shadow-blue-900/20"
                  : "text-neutral-400 hover:text-[#1a3a8f] hover:bg-white"
              )}
            >
              <Phone className="w-5 h-5" />
              <span>رقم الهاتف الجوال</span>
            </button>
          </div>

          <div className="relative z-10">
            {activeTab === 'email' ? <EmailRegistrationForm /> : <PhoneRegistrationForm />}
          </div>
        </div>

      </div>
    </div>
  );
}