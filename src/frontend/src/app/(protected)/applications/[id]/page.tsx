import { ApplicationTimeline, TimelineStage } from "@/components/domain/application/ApplicationTimeline";
import { StatusBadge } from "@/components/domain/application/StatusBadge";
import { ApplicationStatus } from "@/types/api.types";
import { LicenseCategoryCode } from "@/lib/enums";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CreditCard, Activity, CalendarClock } from "lucide-react";
import Link from "next/link";
import { GateLockIndicator } from "@/components/domain/training/GateLockIndicator";
import { TheoryTestHistory } from "@/components/domain/theory/TheoryTestHistory";
import { PaymentSection } from "@/components/domain/payment/PaymentSection";
import { ApplicationService, convertToTimelineStageArray } from "@/services/application.service";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return {
    title: `تفاصيل الطلب - ${id} | مُجاز`,
  };
}

export default async function ApplicationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch real application data from API
  const appResponse = await ApplicationService.getApplicationById(id);
  
  if (!appResponse.success || !appResponse.data) {
    notFound();
  }
  
  const appData = appResponse.data;
  
  // Fetch timeline data from API
  const timelineResponse = await ApplicationService.getTimeline(id);
  
  let timelineStages: TimelineStage[] = [];
  if (timelineResponse.success && timelineResponse.data) {
    timelineStages = convertToTimelineStageArray(timelineResponse.data);
  }

  // Determine if agricultural category based on category code (F = 5)
  const isAgricultural = appData.licenseCategoryCode === LicenseCategoryCode.F;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 md:space-y-10 px-4 md:px-0 py-6 md:py-12 font-arabic">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-5 md:p-8 rounded-xl md:rounded-2xl border border-[#1a3a8f]/10 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#1a3a8f]/5 to-transparent rounded-full -mr-16 -mt-16 blur-3xl transition-all duration-700 group-hover:scale-150" />
        
        <div className="flex-1 relative z-10">
          <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-2 md:mb-3">
            <h1 className="text-2xl md:text-3xl font-black text-[#1a3a8f] tracking-tight">{appData.applicationNumber}</h1>
            <StatusBadge status={appData.status} className="h-6 md:h-8" />
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-neutral-500 font-bold">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-50 rounded-full border border-neutral-100">
               <CalendarClock className="w-4 h-4 text-[#1a3a8f]/60" />
               <span className="opacity-70">تقديم:</span>
               {new Date(appData.createdAt).toLocaleDateString('ar-YE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-50 rounded-full border border-neutral-100">
               <FileText className="w-4 h-4 text-[#1a3a8f]/60" />
               <span className="opacity-70">الفئة:</span>
               {isAgricultural ? "زراعية (فئة F)" : appData.licenseCategoryNameAr}
            </div>
          </div>
        </div>

        <div className="flex gap-2 md:gap-4 shrink-0 relative z-10 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none h-10 md:h-12 px-5 md:px-6 rounded-md text-sm md:text-base text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100 font-black transition-all">
            إلغاء الطلب
          </Button>
          <Button className="flex-1 sm:flex-none h-10 md:h-12 px-6 md:px-8 rounded-md bg-[#D4A017] hover:bg-[#b88a14] text-white text-sm md:text-base font-black transition-all active:scale-95">
            سداد الرسوم
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Timeline (Main Content Area) */}
        <div className="lg:col-span-2 space-y-8 md:space-y-12">
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-4 px-2">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1a3a8f]/5 rounded-xl md:rounded-2xl flex items-center justify-center">
                 <Activity className="w-5 h-5 md:w-6 md:h-6 text-[#1a3a8f]" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-neutral-900 tracking-tight">الجدول الزمني للطلب</h2>
                <p className="text-xs md:text-sm text-neutral-500 font-bold">تتبع مراحل معالجة طلبك لحظة بلحظة</p>
              </div>
            </div>
            
            <div className="bg-neutral-50/30 p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-neutral-100/50">
              <ApplicationTimeline stages={timelineStages} />
            </div>
          </div>

          <TheoryTestHistory applicationId={id} />
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="shadow-xl shadow-neutral-100/50 border-neutral-100 rounded-2xl md:rounded-3xl overflow-hidden">
            <CardHeader className="pb-4 border-b border-neutral-50 bg-neutral-50/50">
              <CardTitle className="text-base md:text-lg flex items-center gap-3 font-black text-[#1a3a8f]">
                <FileText className="w-5 h-5 opacity-60" />
                المستندات المرفقة
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-sm space-y-4">
              <div className="flex justify-between items-center p-4 bg-emerald-50/50 rounded-xl md:rounded-2xl border border-emerald-100/50">
                <div className="flex flex-col">
                  <span className="font-black text-emerald-900">إثبات الهوية</span>
                  <span className="text-[10px] text-emerald-600/70 font-bold uppercase tracking-widest">Document Provided</span>
                </div>
                <StatusBadge showIcon={false} status="Approved" className="text-[10px] px-3 py-1 rounded-full bg-emerald-500 text-white border-0" />
              </div>
              <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-xl md:rounded-2xl border border-neutral-100">
                <div className="flex flex-col">
                  <span className="font-black text-neutral-700">التقرير الطبي</span>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Awaiting Verification</span>
                </div>
                <StatusBadge showIcon={false} status="Pending" className="text-[10px] px-3 py-1 rounded-full" />
              </div>
              <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-xl md:rounded-2xl border border-neutral-100">
                <div className="flex flex-col">
                  <span className="font-black text-neutral-700">شهادة التدريب</span>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Under Training</span>
                </div>
                <StatusBadge showIcon={false} status="Pending" className="text-[10px] px-3 py-1 rounded-full" />
              </div>

              <Link href={`/applications/${id}/documents`} className="block pt-2">
                <Button variant="outline" className="w-full h-12 rounded-xl border-[#1a3a8f]/10 text-[#1a3a8f] font-black hover:bg-blue-50 transition-all">
                  إدارة المستندات والملفات
                </Button>
              </Link>
            </CardContent>
          </Card>

          <PaymentSection
            applicationId={id}
            applicationNumber={appData.applicationNumber}
            amount={100}
          />

        </div>
      </div>
    </div>
  );
}
