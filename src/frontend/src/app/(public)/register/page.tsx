'use client';

import { useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmailRegistrationForm } from '@/components/domain/auth/EmailRegistrationForm';
import { PhoneRegistrationForm } from '@/components/domain/auth/PhoneRegistrationForm';

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 py-12 font-arabic" dir="rtl">
      <div className="w-full max-w-xl space-y-8">
        
        <div className="bg-white border-0 p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 ring-1 ring-neutral-100 animate-fade-in relative overflow-hidden">
          {/* Brand Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#1a3a8f]/5 rounded-bl-full blur-2xl" />
          
          <div className="text-center space-y-4 mb-10 relative z-10">
            <h1 className="text-4xl font-black text-neutral-900 tracking-tight">إنشاء حساب جديد</h1>
            <p className="text-neutral-400 font-bold max-w-sm mx-auto leading-relaxed">انضم إلى المنظومة الإلكترونية الموحدة لخدمات المرور في محافظة صنعاء.</p>
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

        <p className="text-center text-xs font-black text-neutral-300 uppercase tracking-[0.3em]">
          الإدارة العامة للمرور - محافظة صنعاء
        </p>
      </div>
    </div>
  );
}