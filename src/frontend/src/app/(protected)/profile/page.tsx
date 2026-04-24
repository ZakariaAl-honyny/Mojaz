'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Shield, 
  Calendar,
  Edit,
  KeyRound,
  Building2
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4" dir="rtl">
        <div className="flex items-center justify-center h-64">
          <p className="text-neutral-500 font-bold">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  const roleLabels: Record<string, string> = {
    Applicant: 'مواطن / متقدم',
    Admin: 'مدير النظام',
    Receptionist: 'موظف استقبال',
    Doctor: 'طبيب فاحص',
    Examiner: 'ضابط فحص',
    Manager: 'مدير الفرع',
    Security: 'أمن الإدارة',
  };

  const roleLabel = (() => {
    if (typeof user.role === 'string') return roleLabels[user.role] || user.role;
    return 'غير معروف';
  })();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-10 px-4 font-arabic" dir="rtl">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-1 h-8 md:h-10 bg-[#1a3a8f] rounded-full shadow-lg shadow-blue-900/20" />
          <div>
            <h1 className="text-xl md:text-2xl font-black text-neutral-900 tracking-tight leading-none mb-1">
              الملف الشخصي
            </h1>
            <p className="text-neutral-500 font-bold text-[10px] uppercase tracking-widest leading-none">
              عرض وتعديل البيانات الشخصية
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="h-10 px-4 rounded-lg border-neutral-200 bg-white hover:bg-neutral-50 gap-2 font-black text-xs uppercase tracking-widest transition-all">
            <KeyRound className="w-4 h-4 text-neutral-400" />
            تغيير كلمة المرور
          </Button>
          <Button className="h-10 px-4 rounded-lg bg-[#1a3a8f] hover:bg-[#152d6f] text-white shadow-lg shadow-blue-900/10 gap-2 font-black text-xs uppercase tracking-widest transition-all">
            <Edit className="w-4 h-4" />
            تعديل البيانات
          </Button>
        </div>
      </header>

      {/* Profile Header Card */}
      <Card className="border border-neutral-200 shadow-sm bg-white rounded-2xl overflow-hidden mb-6">
        <div className="h-24 md:h-32 bg-gradient-to-l from-[#1a3a8f] to-[#0f1e4a] relative">
          <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-[#1a3a8f]/30 blur-[60px] md:blur-[80px] -mr-24 md:-mr-32 -mt-24 md:-mt-32" />
        </div>
        <CardContent className="relative px-6 md:px-8 pb-6 md:pb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-12 md:-mt-16">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-[#1a3a8f] to-[#00215a] border-4 border-white shadow-xl flex items-center justify-center text-white font-black text-3xl md:text-4xl">
                <Avatar className="w-full h-full rounded-xl">
                  <AvatarImage src="" alt={user.fullName} />
                  <AvatarFallback className="bg-gradient-to-br from-[#1a3a8f] to-[#00215a] text-white text-3xl font-black rounded-xl">
                    {getInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute -bottom-2 -start-2 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center shadow-md">
                <Shield className="w-4 h-4 text-white" />
              </div>
            </div>
            
            {/* User Info */}
            <div className="flex-1 text-center md:text-start">
              <h2 className="text-xl md:text-2xl font-black text-neutral-900 tracking-tight mb-1">
                {user.fullName}
              </h2>
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mb-2">
                <Badge className="bg-[#1a3a8f] hover:bg-[#152d6f] text-white font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                  {roleLabel}
                </Badge>
                <span className="text-xs text-neutral-400 font-bold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  منصة مُجاز - إدارة التراخيص
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="border border-neutral-200 shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardHeader className="p-4 md:p-5 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                <User className="w-4 h-4 text-[#1a3a8f]" />
              </div>
              <CardTitle className="text-base font-black text-neutral-900 tracking-tight">
                البيانات الشخصية
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-5 space-y-4">
            <InfoRow 
              icon={<User className="w-4 h-4 text-neutral-400" />}
              label="الاسم الكامل"
              value={user.fullName}
            />
            <InfoRow 
              icon={<CreditCard className="w-4 h-4 text-neutral-400" />}
              label="رقم الهوية"
              value={user.nationalId || 'غير محدد'}
            />
            <InfoRow 
              icon={<Phone className="w-4 h-4 text-neutral-400" />}
              label="رقم الهاتف"
              value={user.phoneNumber || 'غير محدد'}
            />
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="border border-neutral-200 shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardHeader className="p-4 md:p-5 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <Shield className="w-4 h-4 text-[#D4A017]" />
              </div>
              <CardTitle className="text-base font-black text-neutral-900 tracking-tight">
                معلومات الحساب
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-5 space-y-4">
            <InfoRow 
              icon={<Mail className="w-4 h-4 text-neutral-400" />}
              label="البريد الإلكتروني"
              value={user.email}
            />
            <InfoRow 
              icon={<Shield className="w-4 h-4 text-neutral-400" />}
              label="الدور والصلاحيات"
              value={roleLabel}
            />
            <InfoRow 
              icon={<Calendar className="w-4 h-4 text-neutral-400" />}
              label="تاريخ التسجيل"
              value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-YE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'غير محدد'}
            />
          </CardContent>
        </Card>
      </div>

      {/* Account Status */}
      <Card className="border border-neutral-200 shadow-sm bg-white rounded-2xl overflow-hidden mt-6">
        <CardHeader className="p-4 md:p-5 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Shield className="w-4 h-4 text-emerald-600" />
            </div>
            <CardTitle className="text-base font-black text-neutral-900 tracking-tight">
              حالة الحساب
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-5">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
            <div>
              <p className="text-sm font-black text-neutral-900">الحساب نشط</p>
              <p className="text-xs text-neutral-500 font-bold">جميع الخدمات متاحة لك</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Reusable Info Row Component
function InfoRow({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50/50 border border-neutral-100/50">
      <div className="w-8 h-8 rounded-lg bg-white border border-neutral-100 flex items-center justify-center flex-shrink-0 shadow-sm">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-neutral-400 font-black uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className="text-sm font-bold text-neutral-900 truncate">
          {value}
        </p>
      </div>
    </div>
  );
}