'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Stethoscope, 
  ArrowRight, 
  User, 
  Eye, 
  Heart, 
  X, 
  Check,
  Activity,
  Calendar,
  Search,
  ChevronLeft,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function DoctorDashboardPage() {
  const [examMode, setExamMode] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const pending = [
    { id: '1', name: 'أحمد محمد علي', number: 'MOJ-2025-48291037', category: 'ب - خصوصي', time: '09:30 ص' },
    { id: '2', name: 'خالد عمر سعيد', number: 'MOJ-2025-39182746', category: 'أ - دراجة', time: '10:00 ص' },
    { id: '3', name: 'علياء أحمد', number: 'MOJ-2025-57483910', category: 'د - حافلة', time: '10:15 ص' },
  ];

  const completed = [
    { id: '4', name: 'سارة عمران', number: 'MOJ-2025-71384926', result: 'لائق', time: '08:45 ص' },
    { id: '5', name: 'محمد علي', number: 'MOJ-2025-62847190', result: 'لائق', time: '09:00 ص' },
  ];

  if (examMode && selected) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 font-arabic space-y-6" dir="rtl">
        {/* Exam Header */}
        <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-neutral-100">
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" onClick={() => setExamMode(false)} className="rounded-xl">
               <ArrowRight className="w-5 h-5" />
             </Button>
             <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-100">
                <Stethoscope className="w-7 h-7 text-rose-600" />
             </div>
             <div>
                <h1 className="text-2xl font-black text-neutral-900 leading-none mb-1">إجراء الفحص الطبي</h1>
                <p className="text-neutral-500 font-bold text-xs uppercase tracking-widest">{selected.name}</p>
             </div>
          </div>
          <Badge className="bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-50 font-black px-4 py-1.5 rounded-xl">
             قيد الفحص
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Info */}
          <Card className="lg:col-span-1 border-none shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-neutral-50 border-b border-neutral-100 pb-4">
               <CardTitle className="text-lg font-black flex items-center gap-2">
                  <User className="w-5 h-5 text-[#1a3a8f]" />
                  بيانات المتقدم
               </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
               <div className="space-y-1">
                  <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">الاسم الكامل</span>
                  <p className="font-black text-[#1a3a8f]">{selected.name}</p>
               </div>
               <div className="space-y-1">
                  <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">رقم الطلب</span>
                  <p className="font-black text-neutral-900">{selected.number}</p>
               </div>
               <div className="space-y-1">
                  <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">فئة الرخصة</span>
                  <p className="font-black text-neutral-900">{selected.category}</p>
               </div>
            </CardContent>
          </Card>

          {/* Exam Steps */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               <Card className="border-none shadow-lg rounded-2xl bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer border border-blue-100">
                  <CardContent className="p-6 text-center space-y-2">
                     <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center mx-auto text-white shadow-lg shadow-blue-500/20">
                        <Eye className="w-6 h-6" />
                     </div>
                     <p className="font-black text-neutral-900">فحص النظر</p>
                     <p className="text-green-600 font-bold text-xs bg-green-50 py-1 rounded-lg">سليم (6/6)</p>
                  </CardContent>
               </Card>
               <Card className="border-none shadow-lg rounded-2xl bg-purple-50/50 hover:bg-purple-50 transition-colors cursor-pointer border border-purple-100">
                  <CardContent className="p-6 text-center space-y-2">
                     <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center mx-auto text-white shadow-lg shadow-purple-500/20">
                        <Activity className="w-6 h-6" />
                     </div>
                     <p className="font-black text-neutral-900">السمع والنطق</p>
                     <p className="text-green-600 font-bold text-xs bg-green-50 py-1 rounded-lg">سليم</p>
                  </CardContent>
               </Card>
               <Card className="border-none shadow-lg rounded-2xl bg-rose-50/50 hover:bg-rose-50 transition-colors cursor-pointer border border-rose-100">
                  <CardContent className="p-6 text-center space-y-2">
                     <div className="w-12 h-12 rounded-xl bg-rose-500 flex items-center justify-center mx-auto text-white shadow-lg shadow-rose-500/20">
                        <Heart className="w-6 h-6" />
                     </div>
                     <p className="font-black text-neutral-900">فحص القلب</p>
                     <p className="text-green-600 font-bold text-xs bg-green-50 py-1 rounded-lg">سليم</p>
                  </CardContent>
               </Card>
            </div>

            <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
               <CardHeader className="bg-[#1a3a8f] text-white pb-6 pt-8">
                  <CardTitle className="text-2xl font-black text-center">القرار الطبي النهائي</CardTitle>
                  <p className="text-blue-100 text-center font-bold text-sm mt-2 opacity-80 uppercase tracking-tighter">بناءً على نتائج الفحوصات أعلاه</p>
               </CardHeader>
               <CardContent className="p-8 flex gap-4">
                  <Button 
                    onClick={() => { alert('تم اعتماد الحالة: لائق طبياً'); setExamMode(false); }}
                    className="flex-1 h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-xl shadow-emerald-900/20 transition-all active:scale-95 gap-3"
                  >
                    <Check className="w-6 h-6" />
                    لائق طبياً
                  </Button>
                  <Button 
                    onClick={() => { alert('تم اعتماد الحالة: غير لائق طبياً'); setExamMode(false); }}
                    variant="outline"
                    className="flex-1 h-16 rounded-2xl border-rose-200 text-rose-600 hover:bg-rose-50 font-black text-lg transition-all active:scale-95 gap-3"
                  >
                    <X className="w-6 h-6" />
                    غير لائق
                  </Button>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 font-arabic space-y-8" dir="rtl">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-2 h-16 bg-rose-600 rounded-full shadow-lg shadow-rose-900/30" />
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-neutral-900 tracking-tighter">
                لوحة تحكم الطبيب
              </h1>
              <Badge variant="outline" className="h-6 px-2 border-rose-200 bg-rose-50 text-rose-600 text-[10px] font-black gap-1">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                متصل
              </Badge>
            </div>
            <p className="text-neutral-500 font-bold text-xs uppercase tracking-widest">
              إدارة فحوصات المتقدمين وإصدار التقارير الطبية
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative group">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input 
                type="text" 
                placeholder="بحث برقم الطلب..." 
                className="h-11 w-64 pr-10 rounded-xl bg-white border border-neutral-200 text-sm font-bold focus:ring-2 focus:ring-[#1a3a8f] focus:border-transparent transition-all outline-none"
              />
           </div>
           <Button className="h-11 rounded-xl bg-[#1a3a8f] font-black gap-2 px-6 shadow-lg shadow-blue-900/20">
              <Calendar className="w-4 h-4" />
              جدول اليوم
           </Button>
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-lg rounded-2xl bg-white p-6 flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
           </div>
           <div>
              <p className="text-2xl font-black text-neutral-900">{pending.length}</p>
              <p className="text-xs text-neutral-400 font-bold">بانتظار الفحص</p>
           </div>
        </Card>
        <Card className="border-none shadow-lg rounded-2xl bg-white p-6 flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
           </div>
           <div>
              <p className="text-2xl font-black text-neutral-900">{completed.length}</p>
              <p className="text-xs text-neutral-400 font-bold">فحوصات مكتملة</p>
           </div>
        </Card>
        <Card className="border-none shadow-lg rounded-2xl bg-white p-6 flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
           </div>
           <div>
              <p className="text-2xl font-black text-neutral-900">100%</p>
              <p className="text-xs text-neutral-400 font-bold">دقة التقارير</p>
           </div>
        </Card>
        <Card className="border-none shadow-lg rounded-2xl bg-white p-6 flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-[#1a3a8f]/5 flex items-center justify-center">
              <User className="w-6 h-6 text-[#1a3a8f]" />
           </div>
           <div>
              <p className="text-2xl font-black text-neutral-900">5</p>
              <p className="text-xs text-neutral-400 font-bold">إجمالي المراجعين</p>
           </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Queue */}
        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-amber-50/50 border-b border-amber-100 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-black text-neutral-900">طابور الفحص اليوم</CardTitle>
                  <CardDescription className="text-amber-600 font-bold text-xs">{pending.length} متقدم بانتظار دورهم</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-neutral-50">
              {pending.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-neutral-50 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center font-black text-neutral-400 group-hover:bg-[#1a3a8f] group-hover:text-white transition-colors">
                       {item.id}
                    </div>
                    <div>
                      <p className="font-black text-neutral-900 group-hover:text-[#1a3a8f] transition-colors">{item.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-black text-neutral-400 flex items-center gap-1">
                           <FileText className="w-3 h-3" />
                           {item.number}
                        </span>
                        <span className="text-[10px] font-black text-neutral-400 flex items-center gap-1">
                           <Clock className="w-3 h-3" />
                           {item.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => { setSelected(item); setExamMode(true); }}
                    className="rounded-xl bg-amber-600 hover:bg-amber-700 font-black h-10 px-6 gap-2"
                  >
                    بدء الفحص
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Completed List */}
        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-emerald-50/50 border-b border-emerald-100 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-black text-neutral-900">تم فحصهم مؤخراً</CardTitle>
                  <CardDescription className="text-emerald-600 font-bold text-xs">{completed.length} مكتمل بنجاح</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-neutral-50">
              {completed.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                       <User className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-black text-neutral-900">{item.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-black text-neutral-400 flex items-center gap-1">
                           {item.number}
                        </span>
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none font-black px-2 py-0 h-4 text-[9px]">
                           {item.result}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" className="rounded-xl font-bold h-10 gap-2">
                    عرض التقرير
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            {completed.length === 0 && (
               <div className="p-12 text-center text-neutral-400 font-bold">
                  لا توجد سجلات مكتملة اليوم
               </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Add these to imports or local components if missing
function CheckCircle2(props: any) {
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
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function FileText(props: any) {
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
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}
