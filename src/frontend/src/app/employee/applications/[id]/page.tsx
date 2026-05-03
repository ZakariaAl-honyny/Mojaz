'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { 
  FileText, 
  User, 
  Activity, 
  ChevronRight, 
  Loader2, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Calendar,
  MoreHorizontal,
  Download,
  ShieldCheck,
  Stethoscope,
  Briefcase,
  MapPin,
  Check,
  X,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/domain/application/StatusBadge';
import { ApplicationTimeline } from '@/components/domain/application/ApplicationTimeline';
import ApplicationService, { convertToTimelineStageArray } from '@/services/application.service';
import { ServiceTypeLabels, LicenseCategoryLabels } from '@/types/wizard.types';
import { ApplicationStageLabels } from '@/lib/enumMappers';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { exportApplicationToHtml } from '@/lib/export-utils';

export default function EmployeeReviewPage() {
  const params = useParams();
  const idStr = params.id as string;
  const id = parseInt(idStr, 10);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch full application details
  const { data: appResponse, isLoading: appLoading, refetch } = useQuery({
    queryKey: ['application', id, 'details'],
    queryFn: () => ApplicationService.getApplicationDetails(id),
    enabled: !!id,
  });

  // Fetch timeline
  const { data: timelineResponse, isLoading: timelineLoading } = useQuery({
    queryKey: ['application', id, 'timeline'],
    queryFn: () => ApplicationService.getTimeline(id),
    enabled: !!id,
  });

  // Actions mutation
  const approveMutation = useMutation({
    mutationFn: (reason?: string) => ApplicationService.approveApplication(id, reason),
    onSuccess: () => {
      toast.success('تم قبول الطلب بنجاح');
      queryClient.invalidateQueries({ queryKey: ['application', id] });
      refetch();
    },
    onError: (err: any) => {
      toast.error(err.message || 'فشل في معالجة الطلب');
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (reason: string) => ApplicationService.rejectApplication(id, reason),
    onSuccess: () => {
      toast.success('تم رفض الطلب بنجاح');
      queryClient.invalidateQueries({ queryKey: ['application', id] });
      refetch();
    },
    onError: (err: any) => {
      toast.error(err.message || 'فشل في معالجة الطلب');
    }
  });

  if (appLoading || timelineLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 font-arabic" dir="rtl">
        <Loader2 className="w-16 h-16 animate-spin text-[#1a3a8f] opacity-20" />
        <p className="text-neutral-400 font-black animate-pulse uppercase tracking-[0.3em] text-xs">جاري جلب بيانات المعاملة...</p>
      </div>
    );
  }

  if (!appResponse?.success || !appResponse?.data) {
    return (
      <div className="p-12 text-center font-arabic max-w-2xl mx-auto space-y-8 pt-24" dir="rtl">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto border border-red-100">
           <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-3xl font-black text-neutral-900 tracking-tighter">تعذر الوصول للمعاملة</h1>
        <p className="text-neutral-500 font-bold leading-relaxed italic">
          لم نتمكن من العثور على المعاملة المطلوبة في قاعدة البيانات.
        </p>
        <Button onClick={() => router.push('/employee/applications')} className="h-16 px-12 rounded-2xl bg-[#1a3a8f] text-white font-black text-lg gap-4 shadow-xl hover:scale-105 transition-all">
           <ArrowRight className="w-6 h-6" />
          العودة لقائمة المهام
        </Button>
      </div>
    );
  }

  const app = appResponse.data;
  const timelineStages = timelineResponse?.success && timelineResponse.data 
    ? convertToTimelineStageArray(timelineResponse.data)
    : [];

  const getServiceLabel = (type: any) => (ServiceTypeLabels as any)[type]?.ar || type;
  const getCategoryLabel = (code: any) => (LicenseCategoryLabels as any)[code]?.ar || code;

  return (
    <div className="space-y-8 font-arabic p-4 pb-24 max-w-7xl mx-auto" dir="rtl">
      {/* Header / Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <nav className="flex items-center gap-3 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-4">
            <button onClick={() => router.push('/employee/applications')} className="hover:text-[#1a3a8f] transition-colors">إدارة الطلبات</button>
            <ChevronRight className="w-3 h-3 opacity-30" />
            <span className="text-[#1a3a8f]">{app.applicationNumber}</span>
          </nav>
          <div className="flex items-center gap-5">
             <div className="w-2 h-12 bg-[#1a3a8f] rounded-full shadow-lg shadow-blue-900/20" />
             <div>
                <h1 className="text-3xl font-black text-neutral-900 tracking-tighter leading-none mb-1">مراجعة المعاملة السيادية</h1>
                <p className="text-neutral-400 font-bold text-xs uppercase tracking-widest opacity-80">نظام التدقيق المركزي • {app.applicationNumber}</p>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="h-12 rounded-xl border-neutral-200 font-black text-xs gap-2 hover:bg-neutral-50 transition-colors"
            onClick={() => exportApplicationToHtml(app)}
          >
            <Download className="w-4 h-4" />
            تصدير ملف المعاملة
          </Button>
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl border border-neutral-200">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          {/* Status Banner */}
          <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden relative group transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/5">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#1a3a8f]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-[#1a3a8f] flex items-center justify-center text-white shadow-2xl shadow-blue-900/20">
                    <Briefcase className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                       <h2 className="text-2xl font-black text-neutral-900 tracking-tight">{app.applicationNumber}</h2>
                       <StatusBadge status={app.status} />
                    </div>
                    <p className="text-neutral-500 font-bold text-sm flex items-center gap-2">
                       <ShieldCheck className="w-4 h-4 text-emerald-600" />
                       {getServiceLabel(app.serviceType)} • فئة {getCategoryLabel(app.licenseCategoryCode)}
                    </p>
                  </div>
                </div>
                
                <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100 flex flex-col items-center justify-center min-w-[160px]">
                   <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">المرحلة الحالية</span>
                   <p className="text-lg font-black text-[#1a3a8f] leading-none mb-1">مرحلة {app.currentStageNumber || '---'}</p>
                   <p className="text-[11px] font-bold text-neutral-500">{app.currentStage ? (ApplicationStageLabels[app.currentStage] || app.currentStage) : '---'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-6">
             {/* Applicant Card */}
             <Card className="border-none shadow-lg rounded-3xl bg-white overflow-hidden">
                <CardHeader className="pb-4 border-b border-neutral-50">
                   <CardTitle className="text-lg font-black flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <User className="w-5 h-5 text-[#1a3a8f]" />
                      </div>
                      معلومات المتقدم
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                   <div className="flex justify-between items-end border-b border-neutral-50 pb-3">
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">الاسم الكامل</span>
                      <span className="font-black text-neutral-900">{app.applicantName || app.fullName || '---'}</span>
                   </div>
                   <div className="flex justify-between items-end border-b border-neutral-50 pb-3">
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">الرقم الوطني</span>
                      <span className="font-black text-neutral-900 tabular-nums">{app.nationalId || '---'}</span>
                   </div>
                   <div className="flex justify-between items-end border-b border-neutral-50 pb-3">
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">الجنسية</span>
                      <span className="font-black text-neutral-900">{app.nationality || 'يمني'}</span>
                   </div>
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">رقم الجوال</span>
                      <span className="font-black text-[#1a3a8f] tabular-nums" dir="ltr">{app.mobileNumber || '---'}</span>
                   </div>
                </CardContent>
             </Card>

             {/* Geography Card */}
             <Card className="border-none shadow-lg rounded-3xl bg-white overflow-hidden">
                <CardHeader className="pb-4 border-b border-neutral-50">
                   <CardTitle className="text-lg font-black flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-amber-600" />
                      </div>
                      النطاق الجغرافي
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                   <div className="flex justify-between items-end border-b border-neutral-50 pb-3">
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">المحافظة</span>
                      <span className="font-black text-neutral-900">{app.region || 'أمانة العاصمة'}</span>
                   </div>
                   <div className="flex justify-between items-end border-b border-neutral-50 pb-3">
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">المدينة</span>
                      <span className="font-black text-neutral-900">{app.city || 'صنعاء'}</span>
                   </div>
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">مركز الفحص</span>
                      <span className="font-black text-[#1a3a8f]">{app.branchId ? `فرع رقم ${app.branchId}` : 'لم يحدد'}</span>
                   </div>
                </CardContent>
             </Card>
          </div>

          {/* Documents Section */}
          <Card className="border-none shadow-xl rounded-3xl bg-white overflow-hidden">
            <CardHeader className="p-8 border-b border-neutral-50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black text-neutral-900 flex items-center gap-3">
                  <FileText className="w-7 h-7 text-[#1a3a8f]" />
                  المستندات والوثائق المرفوعة
                </CardTitle>
                <CardDescription className="text-neutral-400 font-bold text-xs mt-1">يرجى التحقق من صحة ووضوح كافة الوثائق الرسمية</CardDescription>
              </div>
              <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-50 font-black px-4 py-1.5 rounded-xl">
                 {app.documents?.length || 0} مستندات
              </Badge>
            </CardHeader>
            <CardContent className="p-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {app.documents && app.documents.length > 0 ? (
                    app.documents.map((doc: any) => (
                      <div key={doc.id} className="group p-5 rounded-2xl border border-neutral-100 bg-neutral-50/50 hover:bg-white hover:border-[#1a3a8f]/30 hover:shadow-xl transition-all duration-500">
                        <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-neutral-200 group-hover:bg-[#1a3a8f] group-hover:text-white transition-colors">
                                 <FileText className="w-6 h-6" />
                              </div>
                              <div>
                                 <p className="font-black text-neutral-900 text-sm leading-none mb-1">{doc.documentTypeName}</p>
                                 <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest">{doc.originalFileName}</p>
                              </div>
                           </div>
                           <StatusBadge status={doc.status} showIcon={false} className="text-[9px] h-6 px-2" />
                        </div>
                        <div className="flex items-center gap-2">
                           <Button variant="outline" className="flex-1 h-10 rounded-xl text-xs font-black gap-2 border-neutral-200 hover:bg-[#1a3a8f] hover:text-white transition-all">
                              <Eye className="w-4 h-4" />
                              معاينة الوثيقة
                           </Button>
                           <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl border border-neutral-200">
                              <Download className="w-4 h-4" />
                           </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="md:col-span-2 py-12 text-center border-2 border-dashed border-neutral-100 rounded-[2rem] bg-neutral-50/50">
                       <FileText className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
                       <p className="text-neutral-400 font-bold">لا توجد مستندات مرفوعة لهذه المعاملة حالياً.</p>
                    </div>
                  )}
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar / Processing Panel */}
        <div className="lg:col-span-4 space-y-8">
          {/* Action Panel */}
          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden sticky top-8">
             <CardHeader className="bg-[#1a3a8f] text-white p-8 pb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                <div className="relative z-10">
                   <CardTitle className="text-2xl font-black mb-2">اتخاذ قرار إجرائي</CardTitle>
                   <CardDescription className="text-blue-100/70 font-bold text-xs uppercase tracking-widest italic">قسم معالجة المعاملات السيادية</CardDescription>
                </div>
             </CardHeader>
             <CardContent className="p-8 -mt-8 bg-white rounded-t-[2.5rem] relative z-20 space-y-8">
                {/* Decision Section */}
                <div className="space-y-4 pt-4">
                   <div className="flex items-center gap-3 px-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">توجيه المعاملة</span>
                   </div>
                   
                   <div className="space-y-4">
                      <Button 
                        onClick={() => approveMutation.mutate(undefined)}
                        disabled={approveMutation.isPending || app.status === 'Approved'}
                        className="w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-xl shadow-emerald-900/20 transition-all active:scale-95 gap-3"
                      >
                        {approveMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
                        اعتماد ونقل للمرحلة التالية
                      </Button>

                      <Button 
                        onClick={() => {
                          const reason = prompt('يرجى ذكر سبب الرفض:');
                          if (reason) rejectMutation.mutate(reason);
                        }}
                        disabled={rejectMutation.isPending || app.status === 'Rejected'}
                        variant="outline"
                        className="w-full h-16 rounded-2xl border-rose-200 text-rose-600 hover:bg-rose-50 font-black text-lg transition-all active:scale-95 gap-3"
                      >
                        {rejectMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <X className="w-6 h-6" />}
                        رفض الطلب نهائياً
                      </Button>

                      <Button 
                        variant="ghost"
                        className="w-full h-14 rounded-2xl text-neutral-400 font-bold hover:bg-neutral-50 gap-2 border border-dashed border-neutral-100"
                      >
                         طلب استكمال نواقص
                      </Button>
                   </div>
                </div>

                <div className="pt-8 border-t border-neutral-50 space-y-6">
                   <div className="flex items-center gap-3 px-2">
                      <Activity className="w-4 h-4 text-neutral-300" />
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">المسار الزمني الرقمي</span>
                   </div>
                   
                   <div className="px-2">
                      <ApplicationTimeline stages={timelineStages} />
                   </div>
                </div>

                {/* Footer Info */}
                <div className="pt-8 border-t border-neutral-50 flex items-center justify-center gap-3 text-neutral-300 opacity-60">
                   <ShieldCheck className="w-4 h-4" />
                   <span className="text-[9px] font-black uppercase tracking-[0.2em]">الرقابة الموحدة • ٢٠٢٤</span>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
