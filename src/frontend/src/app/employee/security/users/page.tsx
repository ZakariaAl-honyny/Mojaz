'use client';

import React from 'react';
import { DashboardSurface } from '@/components/layout/dashboard-surface';
import { ShieldCheck, User, Search, Filter, MoreVertical, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SecurityUsersPage() {
  return (
    <DashboardSurface className="py-8 font-arabic" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8 px-4">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-2 h-16 bg-[#1a3a8f] rounded-full shadow-lg shadow-blue-900/30" />
            <div>
              <h1 className="text-3xl font-black text-neutral-900 tracking-tighter mb-1">إدارة مستخدمي النظام</h1>
              <p className="text-neutral-500 font-bold text-xs uppercase tracking-widest opacity-70">التحقق من الصلاحيات والمراقبة الأمنية</p>
            </div>
          </div>
          
          <Button className="h-12 rounded-2xl bg-[#1a3a8f] font-black gap-2 px-8 shadow-xl shadow-blue-900/20 hover:scale-105 transition-all">
            <Plus className="w-5 h-5" />
            إضافة مستخدم جديد
          </Button>
        </header>

        {/* Search & Filter */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white border border-neutral-100 p-6 rounded-3xl shadow-sm">
           <div className="relative w-full lg:w-[420px]">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input 
                type="text" 
                placeholder="البحث بالاسم، الرقم الوطني، أو الدور..." 
                className="w-full h-12 pr-12 pl-4 rounded-xl bg-neutral-50 border border-neutral-100 font-bold text-sm outline-none focus:ring-2 focus:ring-[#1a3a8f] focus:bg-white transition-all"
              />
           </div>
           <Button variant="outline" className="h-12 gap-3 border-neutral-200 rounded-xl px-6 font-black text-xs">
              <Filter className="w-4 h-4" />
              تصفية الموظفين
           </Button>
        </div>

        {/* Users List Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[1, 2, 3].map((i) => (
             <Card key={i} className="border-none shadow-lg rounded-3xl overflow-hidden hover:shadow-2xl transition-all group">
                <CardHeader className="bg-neutral-50/50 p-6 border-b border-neutral-50 flex flex-row items-center justify-between">
                   <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center text-[#1a3a8f] group-hover:bg-[#1a3a8f] group-hover:text-white transition-all">
                      <User className="w-6 h-6" />
                   </div>
                   <Badge variant="outline" className="h-6 px-2 border-emerald-100 bg-emerald-50 text-emerald-600 font-black text-[9px]">نشط</Badge>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                   <div>
                      <h3 className="text-lg font-black text-neutral-900 mb-1">أحمد محمد اليماني</h3>
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">ضابط أمن • مرور الأمانة</p>
                   </div>
                   
                   <div className="space-y-3 pt-2 border-t border-neutral-50">
                      <div className="flex justify-between items-center text-[11px] font-bold">
                         <span className="text-neutral-400">آخر ظهور:</span>
                         <span className="text-neutral-700">منذ ١٠ دقائق</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] font-bold">
                         <span className="text-neutral-400">عدد العمليات:</span>
                         <span className="text-neutral-700">١٢٨ عملية</span>
                      </div>
                   </div>

                   <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 h-10 rounded-xl font-black text-xs gap-2 border-neutral-200">
                         تعديل الصلاحيات
                      </Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl border border-neutral-200">
                         <MoreVertical className="w-4 h-4" />
                      </Button>
                   </div>
                </CardContent>
             </Card>
           ))}
        </div>

        {/* Empty State / Footer */}
        <div className="py-20 text-center bg-[#1a3a8f]/5 rounded-[3rem] border-2 border-dashed border-[#1a3a8f]/10">
           <ShieldCheck className="w-16 h-16 text-[#1a3a8f]/20 mx-auto mb-6" />
           <h3 className="text-xl font-black text-[#1a3a8f] mb-2 tracking-tight">سجل الرقابة الأمنية</h3>
           <p className="text-neutral-500 font-bold max-w-md mx-auto leading-relaxed">
             هذه الواجهة مخصصة لمسؤولي الأمن الرقمي لإدارة هويات الموظفين وضبط معايير الدخول الموحد.
           </p>
        </div>
      </div>
    </DashboardSurface>
  );
}
