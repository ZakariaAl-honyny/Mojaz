'use client';

import React from 'react';
import { DashboardSurface } from '@/components/layout/dashboard-surface';
import { Stethoscope, Search, Filter, Activity, CheckCircle2, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/domain/application/StatusBadge';

export default function MedicalResultsPage() {
  return (
    <DashboardSurface className="py-8 font-arabic" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8 px-4" >
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-2 h-16 bg-rose-600 rounded-full shadow-lg shadow-rose-900/30" />
            <div>
              <h1 className="text-3xl font-black text-neutral-900 tracking-tighter mb-1">مركز التقارير الطبية</h1>
              <p className="text-neutral-500 font-bold text-xs uppercase tracking-widest opacity-70">استعراض كافة نتائج الفحوصات الطبية للمتقدمين</p>
            </div>
          </div>
        </header>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white border border-neutral-100 p-6 rounded-3xl shadow-sm">
           <div className="relative w-full lg:w-[420px]">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input 
                type="text" 
                placeholder="البحث برقم المعاملة أو اسم المتقدم..." 
                className="w-full h-12 pr-12 pl-4 rounded-xl bg-neutral-50 border border-neutral-100 font-bold text-sm outline-none focus:ring-2 focus:ring-rose-200 focus:bg-white transition-all"
              />
           </div>
           <div className="flex gap-2">
              <Button variant="outline" className="h-12 gap-3 border-neutral-200 rounded-xl px-6 font-black text-xs">
                 <Filter className="w-4 h-4" />
                 تصفية حسب الحالة
              </Button>
           </div>
        </div>

        {/* Table/List */}
        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
           <CardContent className="p-0">
              <div className="overflow-x-auto">
                 <table className="w-full text-start">
                    <thead>
                       <tr className="bg-neutral-50/50 border-b border-neutral-50">
                          <th className="px-8 py-5 text-start text-[10px] font-black text-neutral-400 uppercase tracking-widest">المتقدم</th>
                          <th className="px-8 py-5 text-start text-[10px] font-black text-neutral-400 uppercase tracking-widest">رقم المعاملة</th>
                          <th className="px-8 py-5 text-start text-[10px] font-black text-neutral-400 uppercase tracking-widest">الحالة الطبية</th>
                          <th className="px-8 py-5 text-start text-[10px] font-black text-neutral-400 uppercase tracking-widest">تاريخ الفحص</th>
                          <th className="px-8 py-5 text-end text-[10px] font-black text-neutral-400 uppercase tracking-widest">الإجراءات</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50">
                       {[1, 2, 3, 4, 5].map((i) => (
                         <tr key={i} className="hover:bg-neutral-50/50 transition-colors group">
                            <td className="px-8 py-5">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-200">
                                     <User className="w-4 h-4 text-neutral-400" />
                                  </div>
                                  <span className="font-black text-neutral-900 text-sm">ياسر عبد الله الحميري</span>
                               </div>
                            </td>
                            <td className="px-8 py-5">
                               <span className="font-black text-[#1a3a8f] text-sm tabular-nums">MOJ-2024-9182{i}</span>
                            </td>
                            <td className="px-8 py-5">
                               <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px] py-1 rounded-lg">لائق طبياً</Badge>
                            </td>
                            <td className="px-8 py-5">
                               <span className="text-xs font-bold text-neutral-500 tabular-nums">٢٠٢٤/٠٥/١{i}</span>
                            </td>
                            <td className="px-8 py-5 text-end">
                               <Button variant="ghost" size="sm" className="h-9 rounded-lg font-black text-xs text-[#1a3a8f] hover:bg-blue-50 gap-2">
                                  عرض التقرير
                               </Button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </CardContent>
        </Card>

        {/* Info Box */}
        <div className="p-10 rounded-[3rem] bg-rose-50/30 border border-rose-100 flex flex-col md:flex-row items-center gap-8">
           <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center text-rose-600">
              <Stethoscope className="w-10 h-10" />
           </div>
           <div className="flex-1 text-center md:text-start space-y-2">
              <h3 className="text-xl font-black text-rose-900">نظام الربط الطبي الموحد</h3>
              <p className="text-rose-700/70 font-bold leading-relaxed italic">
                يتم مزامنة نتائج الفحص الطبي آلياً من المراكز المعتمدة. في حال عدم ظهور النتيجة، يرجى التحقق من حالة الربط مع المنصة الوطنية للصحة.
              </p>
           </div>
           <Button className="h-12 px-8 rounded-xl bg-rose-600 hover:bg-rose-700 font-black shadow-lg shadow-rose-900/10">تحديث البيانات</Button>
        </div>
      </div>
    </DashboardSurface>
  );
}
