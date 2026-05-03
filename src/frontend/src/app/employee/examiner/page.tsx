'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ClipboardCheck, 
  ArrowRight, 
  User, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  Activity,
  FileText,
  Target,
  ArrowLeft,
  ChevronLeft,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function ExaminerDashboardPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  const tests = [
    { id: '1', name: 'أحمد محمد علي', type: 'نظري', number: 'MOJ-2025-48291037', status: 'Pending', date: '2025-04-15', time: '09:00 ص' },
    { id: '2', name: 'خالد عمر سعيد', type: 'عملي', number: 'MOJ-2025-39182746', status: 'Pending', date: '2025-04-16', time: '10:30 ص' },
    { id: '3', name: 'سارة عمران', type: 'نظري', number: 'MOJ-2025-71384926', status: 'Passed', date: '2025-04-14', time: '08:15 ص' },
    { id: '4', name: 'محمد علي', type: 'عملي', number: 'MOJ-2025-62847190', status: 'Passed', date: '2025-04-14', time: '11:45 ص' },
  ];

  const pendingTests = tests.filter(t => t.status === 'Pending');
  const completedTests = tests.filter(t => t.status !== 'Pending');

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 font-arabic space-y-8" dir="rtl">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-2 h-16 bg-emerald-600 rounded-full shadow-lg shadow-emerald-900/30" />
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-neutral-900 tracking-tighter">
                لوحة تحكم المختبر
              </h1>
              <Badge variant="outline" className="h-6 px-2 border-emerald-200 bg-emerald-50 text-emerald-600 text-[10px] font-black gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                نشط الآن
              </Badge>
            </div>
            <p className="text-neutral-500 font-bold text-xs uppercase tracking-widest">
              إدارة الاختبارات النظرية والعملية وتقييم المتقدمين
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative group">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input 
                type="text" 
                placeholder="بحث عن متقدم..." 
                className="h-11 w-64 pr-10 rounded-xl bg-white border border-neutral-200 text-sm font-bold focus:ring-2 focus:ring-[#1a3a8f] focus:border-transparent transition-all outline-none"
              />
           </div>
           <Button className="h-11 rounded-xl bg-[#1a3a8f] font-black gap-2 px-6 shadow-lg shadow-blue-900/20">
              <Filter className="w-4 h-4" />
              تصفية
           </Button>
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-lg rounded-2xl bg-white p-6 flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
           </div>
           <div>
              <p className="text-2xl font-black text-neutral-900">{pendingTests.length}</p>
              <p className="text-xs text-neutral-400 font-bold">اختبارات مجدولة</p>
           </div>
        </Card>
        <Card className="border-none shadow-lg rounded-2xl bg-white p-6 flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
           </div>
           <div>
              <p className="text-2xl font-black text-neutral-900">{completedTests.length}</p>
              <p className="text-xs text-neutral-400 font-bold">تم اختبارهم اليوم</p>
           </div>
        </Card>
        <Card className="border-none shadow-lg rounded-2xl bg-white p-6 flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
              <Activity className="w-6 h-6 text-orange-600" />
           </div>
           <div>
              <p className="text-2xl font-black text-neutral-900">85%</p>
              <p className="text-xs text-neutral-400 font-bold">نسبة النجاح</p>
           </div>
        </Card>
        <Card className="border-none shadow-lg rounded-2xl bg-white p-6 flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-[#1a3a8f]/5 flex items-center justify-center">
              <User className="w-6 h-6 text-[#1a3a8f]" />
           </div>
           <div>
              <p className="text-2xl font-black text-neutral-900">12</p>
              <p className="text-xs text-neutral-400 font-bold">إجمالي المتقدمين</p>
           </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-100 gap-8">
        <button 
          onClick={() => setActiveTab('pending')}
          className={cn(
            "pb-4 text-sm font-black transition-all relative",
            activeTab === 'pending' ? "text-[#1a3a8f]" : "text-neutral-400 hover:text-neutral-600"
          )}
        >
          الاختبارات المنتظرة ({pendingTests.length})
          {activeTab === 'pending' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1a3a8f] rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          className={cn(
            "pb-4 text-sm font-black transition-all relative",
            activeTab === 'completed' ? "text-[#1a3a8f]" : "text-neutral-400 hover:text-neutral-600"
          )}
        >
          النتائج المسجلة ({completedTests.length})
          {activeTab === 'completed' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1a3a8f] rounded-full" />}
        </button>
      </div>

      {/* Test List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {(activeTab === 'pending' ? pendingTests : completedTests).map((item) => (
           <Card key={item.id} className="border-none shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all group">
             <CardContent className="p-0">
               <div className="p-5 flex items-center justify-between border-b border-neutral-50 bg-neutral-50/30">
                  <div className="flex items-center gap-3">
                     <div className={cn(
                       "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110",
                       item.type === 'نظري' ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
                     )}>
                        <FileText className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none mb-1">اختبار {item.type}</p>
                        <p className="font-black text-neutral-900">{item.number}</p>
                     </div>
                  </div>
                  <Badge className={cn(
                    "border-none font-black px-3 py-1 rounded-lg",
                    item.status === 'Pending' ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                  )}>
                    {item.status === 'Pending' ? 'منتظر' : 'مكتمل'}
                  </Badge>
               </div>
               
               <div className="p-6 space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center border-2 border-white shadow-inner">
                        <User className="w-6 h-6 text-neutral-400" />
                     </div>
                     <div>
                        <h3 className="text-lg font-black text-neutral-900 group-hover:text-[#1a3a8f] transition-colors">{item.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="text-xs font-bold text-neutral-400 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {item.date}
                           </span>
                           <span className="text-xs font-bold text-neutral-400 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {item.time}
                           </span>
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-2">
                     {item.status === 'Pending' ? (
                       <>
                         <Button className="flex-1 bg-[#1a3a8f] rounded-xl font-black h-11 gap-2 shadow-lg shadow-blue-900/10">
                            بدء الاختبار
                            <ArrowLeft className="w-4 h-4" />
                         </Button>
                         <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-neutral-200">
                            <MoreVertical className="w-4 h-4" />
                         </Button>
                       </>
                     ) : (
                       <Button variant="outline" className="w-full rounded-xl font-black h-11 gap-2 border-neutral-200 hover:bg-neutral-50 transition-colors">
                          <Eye className="w-4 h-4" />
                          عرض تقرير التقييم
                       </Button>
                     )}
                  </div>
               </div>
             </CardContent>
           </Card>
         ))}

         {(activeTab === 'pending' ? pendingTests : completedTests).length === 0 && (
           <div className="col-span-full py-20 text-center bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-200">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                 <ClipboardCheck className="w-8 h-8 text-neutral-300" />
              </div>
              <p className="text-neutral-400 font-bold">لا توجد اختبارات في هذه القائمة حالياً</p>
           </div>
         )}
      </div>
    </div>
  );
}

// CheckCircle2 is imported from lucide-react

function Eye(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
