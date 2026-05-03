'use client';

import { ShieldCheck, Activity, Users, Lock, ArrowLeft, Search, Clock, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function SecurityDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 font-arabic space-y-8" dir="rtl">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-2 h-16 bg-[#1a3a8f] rounded-full shadow-lg shadow-blue-900/30" />
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-neutral-900 tracking-tighter">
                بوابة التحقق الأمني
              </h1>
              <Badge className="bg-blue-50 text-[#1a3a8f] border-blue-100 font-black gap-1 h-6">
                 <ShieldCheck className="w-3.5 h-3.5" />
                 صلاحيات أمنية
              </Badge>
            </div>
            <p className="text-neutral-500 font-bold text-xs uppercase tracking-widest">
              إدارة التدقيق الأمني والتحقق من هويات المستخدمين
            </p>
          </div>
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-lg rounded-2xl bg-white p-6 flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Activity className="w-6 h-6 text-[#1a3a8f]" />
           </div>
           <div>
              <p className="text-2xl font-black text-neutral-900">12</p>
              <p className="text-xs text-neutral-400 font-bold">بانتظار المراجعة</p>
           </div>
        </Card>
        <Card className="border-none shadow-lg rounded-2xl bg-white p-6 flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
           </div>
           <div>
              <p className="text-2xl font-black text-neutral-900">142</p>
              <p className="text-xs text-neutral-400 font-bold">تم التحقق منهم</p>
           </div>
        </Card>
        <Card className="border-none shadow-lg rounded-2xl bg-white p-6 flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
           </div>
           <div>
              <p className="text-2xl font-black text-neutral-900">3</p>
              <p className="text-xs text-neutral-400 font-bold">تحذيرات أمنية</p>
           </div>
        </Card>
        <Card className="border-none shadow-lg rounded-2xl bg-white p-6 flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-rose-600" />
           </div>
           <div>
              <p className="text-2xl font-black text-neutral-900">0</p>
              <p className="text-xs text-neutral-400 font-bold">اختراقات مكتشفة</p>
           </div>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Security Tasks */}
         <Link href="/employee/security/queue" className="group">
           <Card className="border-none shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all cursor-pointer h-full">
             <CardHeader className="bg-[#1a3a8f] text-white p-8">
                <Activity className="w-10 h-10 mb-4 opacity-50" />
                <CardTitle className="text-2xl font-black">طابور المراجعة</CardTitle>
                <p className="text-blue-100 font-bold text-sm mt-2">مراجعة طلبات التحقق الأمني المعلقة</p>
             </CardHeader>
             <CardContent className="p-8 flex justify-between items-center">
                <span className="font-black text-neutral-400">عرض التفاصيل</span>
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-[#1a3a8f] group-hover:text-white transition-all">
                   <ArrowLeft className="w-5 h-5" />
                </div>
             </CardContent>
           </Card>
         </Link>

         <Link href="/employee/security/users" className="group">
           <Card className="border-none shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all cursor-pointer h-full">
             <CardHeader className="bg-emerald-600 text-white p-8">
                <Users className="w-10 h-10 mb-4 opacity-50" />
                <CardTitle className="text-2xl font-black">إدارة المستخدمين</CardTitle>
                <p className="text-emerald-50 font-bold text-sm mt-2">التحقق من هويات المستخدمين وصلاحياتهم</p>
             </CardHeader>
             <CardContent className="p-8 flex justify-between items-center">
                <span className="font-black text-neutral-400">إدارة الحسابات</span>
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                   <ArrowLeft className="w-5 h-5" />
                </div>
             </CardContent>
           </Card>
         </Link>

         <Link href="/employee/reports" className="group">
           <Card className="border-none shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all cursor-pointer h-full">
             <CardHeader className="bg-[#D4A017] text-white p-8">
                <Lock className="w-10 h-10 mb-4 opacity-50" />
                <CardTitle className="text-2xl font-black">سجل الرقابة</CardTitle>
                <p className="text-amber-50 font-bold text-sm mt-2">عرض سجلات الدخول والعمليات الحساسة</p>
             </CardHeader>
             <CardContent className="p-8 flex justify-between items-center">
                <span className="font-black text-neutral-400">فتح السجلات</span>
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-[#D4A017] group-hover:text-white transition-all">
                   <ArrowLeft className="w-5 h-5" />
                </div>
             </CardContent>
           </Card>
         </Link>
      </div>
    </div>
  );
}
