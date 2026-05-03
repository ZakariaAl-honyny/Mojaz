'use client';

import React from 'react';
import { DashboardSurface } from '@/components/layout/dashboard-surface';
import { FileKey2, Search, Filter, Printer, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function LicenseIssuancePage() {
  return (
    <DashboardSurface className="py-8 font-arabic" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8 px-4"  >
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-2 h-16 bg-emerald-600 rounded-full shadow-lg shadow-emerald-900/30" />
            <div>
              <h1 className="text-3xl font-black text-neutral-900 tracking-tighter mb-1">وحدة إصدار الرخص</h1>
              <p className="text-neutral-500 font-bold text-xs uppercase tracking-widest opacity-70">طباعة وتسليم الرخص الرسمية المعتمدة</p>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="border-none shadow-lg rounded-3xl bg-emerald-50/30 p-6 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-xl shadow-emerald-900/20">
                 <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                 <p className="text-3xl font-black text-neutral-900 tracking-tighter">١٤</p>
                 <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">جاهزة للطباعة</p>
              </div>
           </Card>
           <Card className="border-none shadow-lg rounded-3xl bg-amber-50/30 p-6 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-xl shadow-amber-900/20">
                 <Printer className="w-8 h-8" />
              </div>
              <div>
                 <p className="text-3xl font-black text-neutral-900 tracking-tighter">٣</p>
                 <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">جاري الطباعة</p>
              </div>
           </Card>
           <Card className="border-none shadow-lg rounded-3xl bg-blue-50/30 p-6 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#1a3a8f] flex items-center justify-center text-white shadow-xl shadow-blue-900/20">
                 <FileKey2 className="w-8 h-8" />
              </div>
              <div>
                 <p className="text-3xl font-black text-neutral-900 tracking-tighter">١٢٨</p>
                 <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">إجمالي المطبوع</p>
              </div>
           </Card>
        </div>

        {/* List */}
        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
           <CardHeader className="p-8 border-b border-neutral-50 flex flex-row items-center justify-between bg-neutral-50/30">
              <CardTitle className="text-xl font-black text-neutral-900 flex items-center gap-3">
                 <Printer className="w-6 h-6 text-emerald-600" />
                 طلبات بانتظار الطباعة
              </CardTitle>
              <div className="flex gap-2">
                 <Button variant="outline" className="h-10 rounded-xl font-black text-xs border-neutral-200">تحديث</Button>
                 <Button className="h-10 rounded-xl bg-emerald-600 font-black text-xs gap-2">
                    <Printer className="w-4 h-4" />
                    طباعة الكل
                 </Button>
              </div>
           </CardHeader>
           <CardContent className="p-0">
              <div className="divide-y divide-neutral-50">
                 {[1, 2, 3, 4].map((i) => (
                   <div key={i} className="p-6 flex items-center justify-between hover:bg-neutral-50/50 transition-all group">
                      <div className="flex items-center gap-5">
                         <div className="w-14 h-14 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center font-black text-neutral-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                            {i}
                         </div>
                         <div>
                            <h3 className="font-black text-neutral-900 leading-none mb-1 text-lg">سالم عوض القحطاني</h3>
                            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest italic opacity-70">رقم الطلب: MOJ-2024-00{i*127}</p>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                         <div className="text-end hidden md:block">
                            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">فئة الرخصة</p>
                            <Badge className="bg-blue-50 text-blue-600 border-none font-black">ب - خصوصي</Badge>
                         </div>
                         <Button className="h-12 rounded-xl bg-white border border-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white font-black px-6 shadow-sm transition-all gap-2">
                            <Printer className="w-4 h-4" />
                            طباعة الآن
                         </Button>
                      </div>
                   </div>
                 ))}
              </div>
           </CardContent>
        </Card>

        {/* Empty State / Info */}
        <div className="p-12 text-center bg-emerald-50/50 rounded-[3rem] border border-emerald-100">
           <AlertCircle className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
           <p className="text-emerald-700 font-bold max-w-lg mx-auto">
             تأكد من سلامة الطابعة وتوفر مخزون بطاقات الرخص قبل بدء عملية الطباعة الجماعية. كافة الرخص في هذه القائمة معتمدة ومسددة الرسوم.
           </p>
        </div>
      </div>
    </DashboardSurface>
  );
}
