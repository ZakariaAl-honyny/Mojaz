'use client';

import React, { useState } from 'react';
import {
  Plus, Search, Filter, FileText,
  Clock, CheckCircle2, AlertCircle, Eye,
  ChevronLeft, LayoutGrid, List, SlidersHorizontal, ShieldCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/shared/status-badge';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import ApplicationService from '@/services/application.service';
import { FormattedDate } from '@/components/shared/FormattedDate';
import { Loader2 } from 'lucide-react';

type FilterType = 'all' | 'pending' | 'inProgress' | 'completed';

type FilterTabProps = {
  value: FilterType;
  label: string;
  count: number;
  filter: FilterType;
  onFilterChange: (value: FilterType) => void;
};

function FilterTab({ value, label, count, filter, onFilterChange }: FilterTabProps) {
  const isActive = filter === value;
  return (
    <button
      onClick={() => onFilterChange(value)}
      className={cn(
        "px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all gap-3 flex items-center border shadow-none",
        isActive
          ? "bg-[#1a3a8f] text-white border-[#1a3a8f] shadow-lg shadow-blue-900/20 scale-105 z-10"
          : "bg-white text-neutral-400 border-neutral-200 hover:bg-neutral-50"
      )}
    >
      {label}
      <span className={cn(
        "min-w-[1.5rem] h-5 px-1.5 rounded-md flex items-center justify-center text-[10px] font-black",
        isActive ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-400"
      )}>
        {count}
      </span>
    </button>
  );
}

// Mock data removed in favor of real API data

export default function ApplicantApplicationsPage() {
  const router = useRouter();

  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch real applications
  const { data: applicationsResponse, isLoading } = useQuery({
    queryKey: ['my-applications', filter, searchQuery],
    queryFn: () => ApplicationService.getApplications({
      search: searchQuery || undefined,
      // Status mapping for filters
      status: filter === 'all' ? undefined : (
        filter === 'pending' ? 'Draft,Submitted' : (
          filter === 'inProgress' ? 'DocumentReview,InReview,MedicalExam,Training,TheoryTest,PracticalTest,Payment' : (
            filter === 'completed' ? 'Approved,Issued,Active' : undefined
          )
        )
      ),
      pageSize: 50,
      page: 1
    }),
  });

  const applications = applicationsResponse?.data?.items || [];

  return (
    <div className="space-y-6 md:space-y-10 font-arabic" dir="rtl">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 px-4">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-1 h-12 md:h-16 bg-[#1a3a8f] rounded-full" />
          <div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight leading-none mb-2 md:mb-3">
              طلباتي والمتابعة
            </h1>
            <p className="text-neutral-500 font-bold text-xs md:text-sm leading-relaxed max-w-sm md:max-w-lg">
              مركز إدارة ومتابعة جميع طلباتك الإلكترونية الصادرة عن الإدارة العامة للمرور.
            </p>
          </div>
        </div>
        <Link href="/applications/new" className="w-full md:w-auto">
<Button className="h-10 md:h-12 w-full md:w-auto px-6 md:px-8 rounded-md bg-[#D4A017] hover:bg-[#b88a14] text-white text-sm md:text-base font-black transition-all gap-3">
             <Plus className="w-4 h-4 md:w-5 md:h-5" />
             طلب إصدار جديد
           </Button>
        </Link>
      </header>

      {/* Toolbar Section */}
      <div className="space-y-4 md:space-y-6 bg-white border border-neutral-200 p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm mx-4">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 justify-between">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            <FilterTab
              value="all"
              label="عرض الكل"
              count={applications.length} // Simplified count for now
              filter={filter}
              onFilterChange={setFilter}
            />
            {/* Other tabs */}
            <FilterTab
              value="pending"
              label="قيد الانتظار"
              count={filter === 'pending' ? applications.length : 0}
              filter={filter}
              onFilterChange={setFilter}
            />
            <FilterTab
              value="inProgress"
              label="تحت المعالجة"
              count={filter === 'inProgress' ? applications.length : 0}
              filter={filter}
              onFilterChange={setFilter}
            />
            <FilterTab
              value="completed"
              label="المنجزة"
              count={filter === 'completed' ? applications.length : 0}
              filter={filter}
              onFilterChange={setFilter}
            />
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-80 h-10 group">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-[#1a3a8f] transition-colors" />
            <Input
              className="h-10 ps-10 rounded-lg border-neutral-100 bg-neutral-50/50 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-bold text-xs text-end"
              placeholder="البحث برقم الطلب المعرّف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 gap-5 px-4 min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#1a3a8f] mb-4" />
            <p className="text-neutral-500 font-bold">جاري تحميل طلباتك...</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout" initial={false}>
            {applications.length > 0 ? (
              applications.map((app: any, index: number) => (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Card
                    className="border border-neutral-200 shadow-sm hover:shadow-lg hover:border-[#1a3a8f]/20 transition-all duration-300 p-1 bg-white rounded-2xl md:rounded-3xl cursor-pointer group"
                    onClick={() => router.push(`/applications/${app.id}`)}
                  >
                    <CardContent className="p-4 md:p-7 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-10">
                      <div className="flex items-center gap-4 md:gap-6 flex-1 w-full lg:w-auto">
                        <div className={cn(
                          "w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center p-3 md:p-4 shadow-sm border transition-transform group-hover:scale-105",
                          app.status === 'Issued' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-primary-50 text-[#1a3a8f] border-primary-100"
                        )}>
                          <FileText className="w-6 h-6 md:w-8 md:h-8" />
                        </div>
                        <div className="space-y-1 md:space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 md:gap-3">
                            <h3 className="text-base md:text-xl font-black text-neutral-900 group-hover:text-[#1a3a8f] transition-colors tracking-tight">
                              {app.serviceTypeAr || app.serviceType || 'طلب رخصة قيادة'}
                            </h3>
                            <span className="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg bg-neutral-100 text-neutral-900 text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-neutral-200">
                              {app.licenseCategoryCode || 'B'}
                            </span>
                          </div>
                          <p className="text-[8px] md:text-[10px] font-black text-neutral-400 uppercase tracking-[0.1em] md:tracking-[0.2em] leading-none">
                            مرجع العمليات: <span className="text-[#1a3a8f]">{app.applicationNumber}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-row items-center gap-6 md:gap-14 flex-1 justify-between md:justify-center w-full lg:w-auto">
                        <div className="text-right min-w-[100px] md:min-w-[120px]">
                          <p className="text-[8px] md:text-[9px] text-neutral-400 font-black uppercase tracking-[0.1em] md:tracking-[0.2em] mb-1 md:mb-2">
                            الحالة الراهنة
                          </p>
                          <StatusBadge status={app.status as any} />
                        </div>

                        <div className="flex-1 max-w-[200px] md:max-w-[240px] w-full hidden sm:block">
                          <div className="flex justify-between items-center mb-1 md:mb-2">
                            <p className="text-[8px] md:text-[9px] text-neutral-400 font-black uppercase tracking-[0.1em] md:tracking-[0.2em]">
                              نسبة الإنجاز
                            </p>
                            <span className="text-[10px] md:text-xs font-black text-[#1a3a8f] tracking-tighter">{app.progress || 0}%</span>
                          </div>
                          <div className="w-full h-1 md:h-1.5 bg-neutral-100 rounded-full overflow-hidden shadow-inner">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${app.progress || 0}%` }}
                              transition={{ delay: 0.5, duration: 1.5, ease: "circOut" }}
                              className={cn(
                                "h-full rounded-full transition-colors",
                                app.status === 'Issued' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-[#1a3a8f]"
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 md:gap-4 w-full lg:w-auto justify-end">
                        <div className="text-start hidden lg:block">
                          <p className="text-[8px] md:text-[9px] text-neutral-400 font-black uppercase tracking-[0.1em] md:tracking-[0.2em] mb-1">تاريخ تحديث الملف</p>
                          <p className="text-[10px] md:text-xs font-black text-neutral-900 tracking-tight">
                            <FormattedDate date={app.updatedAt || app.createdAt} />
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-neutral-50 text-neutral-400 hover:bg-[#1a3a8f]/5 hover:text-[#1a3a8f] transition-all border border-neutral-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/applications/${app.id}`);
                          }}
                        >
                          <Eye className="w-5 h-5 md:w-6 md:h-6" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 px-4"
              >
                <Card className="border border-neutral-200 border-dashed bg-neutral-50/50 rounded-[3rem] p-16">
                  <CardContent className="flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 rounded-[2rem] bg-white shadow-xl shadow-black/5 flex items-center justify-center mb-8 border border-neutral-100">
                      <FileText className="w-10 h-10 text-neutral-200" />
                    </div>
                    <h3 className="text-2xl font-black text-neutral-900 mb-3 tracking-tight">
                      أرشيفك وسجلاتك خالية
                    </h3>
                    <p className="text-neutral-500 font-bold mb-8 max-w-md leading-relaxed">
                      لا توجد أي طلبات نشطة أو مؤرشفة حالياً. اضغط على الزر أدناه لبدء معاملة جديدة ومتابعتها من هنا.
                    </p>
                    <Button
                      size="lg"
                      className="h-16 px-10 rounded-2xl bg-[#1a3a8f] hover:bg-[#152d6f] text-white shadow-xl shadow-blue-900/10 font-black text-base"
                      onClick={() => router.push('/applications/new')}
                    >
                      <Plus className="w-5 h-5 ms-3" />
                      البدء بمعاملة جديدة
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      <div className="flex justify-center pb-10 opacity-30 select-none">
        <div className="flex items-center gap-4 py-3 px-6 rounded-full border border-neutral-200">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em]">مركز المعلومات الوطني - آمن وموثق</span>
        </div>
      </div>
    </div>
  );
}