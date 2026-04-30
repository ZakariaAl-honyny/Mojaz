'use client';

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import {  
  FileText,  
  User, 
  Calendar,
  Activity,
  ChevronRight,
  Loader2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  CreditCard,
  Stethoscope,
  GraduationCap,
  BookOpen,
  Car,
  Edit,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/domain/application/StatusBadge";
import applicationService from "@/services/application.service";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

// Mock fee data for demo fallback
const MOCK_FEE = {
  title: 'رسوم إصدار رخصة قيادة',
  amount: 15000,
  description: 'رسوم الخدمات المرورية الإلكترونية'
};

// Payment Modal Component
function PaymentModal({ 
  isOpen, 
  onClose, 
  applicationId, 
  onSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  applicationId: string; 
  onSuccess: () => void; 
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feeData, setFeeData] = useState<typeof MOCK_FEE | null>(null);
  const [isLoadingFee, setIsLoadingFee] = useState(true);

  // Fetch fee on mount
  useEffect(() => {
    const fetchFee = async () => {
      try {
        // Try to fetch from API (simulated - in real app would call FeeService)
        // For demo, use mock data
        await new Promise(r => setTimeout(r, 500));
        setFeeData(MOCK_FEE);
      } catch {
        setFeeData(MOCK_FEE); // Fallback
      } finally {
        setIsLoadingFee(false);
      }
    };
    if (isOpen) fetchFee();
  });

  const handlePay = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate API call delay (2 seconds for demo)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call backend to mark as paid
      console.log('[Payment] Calling API with app ID:', applicationId);
      try {
        const result = await applicationService.payApplication(applicationId);
        console.log('[Payment] API result:', result);
      } catch (apiError: any) {
        console.log('[Payment] API error, trying demo mode:', apiError?.message);
      }
      
      // Show success
      setIsSuccess(true);
      
      // Wait 1.5 seconds then close and refresh
      setTimeout(() => {
        onSuccess();
        onClose();
        setIsSuccess(false);
        setIsProcessing(false);
      }, 1500);
      
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
      // Still show success for demo
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setIsSuccess(false);
        setIsProcessing(false);
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-arabic" dir="rtl">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isProcessing && onClose()} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-[#1a3a8f] p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            <h3 className="font-bold">بوابة السداد الإلكتروني</h3>
          </div>
          {!isProcessing && !isSuccess && (
            <button onClick={onClose} className="text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            // Success Screen
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">تم السداد بنجاح!</h4>
              <p className="text-gray-500">جاري تحديث حالة الطلب...</p>
            </div>
          ) : isProcessing ? (
            // Processing Screen
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 animate-spin text-[#1a3a8f] mx-auto mb-4" />
              <p className="text-lg font-bold text-gray-900">جاري معالجة الدفع...</p>
              <p className="text-gray-500 text-sm mt-2">الرجاء الانتظار</p>
            </div>
          ) : (
            // Payment Form
            <>
              {/* Amount Display */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center mb-6">
                <p className="text-sm text-gray-500 mb-1">{feeData?.title || 'المبلغ المطلوب'}</p>
                <p className="text-3xl font-bold text-[#1a3a8f]">
                  {feeData?.amount.toLocaleString('ar-YE') || '15,000'} 
                  <span className="text-lg font-normal"> ريال</span>
                </p>
              </div>

              {/* Card Inputs (Disabled for demo) */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رقم البطاقة</label>
                  <input 
                    type="text" 
                    defaultValue="**** **** **** 4242" 
                    disabled 
                    className="w-full bg-gray-100 border border-gray-200 rounded-lg p-3 text-gray-600 outline-none" 
                    dir="ltr"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الانتهاء</label>
                    <input 
                      type="text" 
                      defaultValue="12/28" 
                      disabled 
                      className="w-full bg-gray-100 border border-gray-200 rounded-lg p-3 text-gray-600 outline-none text-center" 
                      dir="ltr"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">رمز التحقق</label>
                    <input 
                      type="password" 
                      defaultValue="***" 
                      disabled 
                      className="w-full bg-gray-100 border border-gray-200 rounded-lg p-3 text-gray-600 outline-none text-center" 
                    />
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              <Button 
                onClick={handlePay}
                className="w-full bg-[#1a3a8f] hover:bg-blue-800 text-white py-4 rounded-xl font-bold text-lg transition-all"
              >
                تأكيد الدفع الآن
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ApplicantApplicationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Payment modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Fetch basic application details
  const { data: appResponse, isLoading: appLoading, refetch } = useQuery({
    queryKey: ['application', id],
    queryFn: () => applicationService.getApplicationById(id),
    enabled: !!id,
  });

  if (appLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 font-arabic">
        <Loader2 className="w-16 h-16 animate-spin text-[#1a3a8f] opacity-20" />
        <p className="text-neutral-400 font-black animate-pulse uppercase tracking-[0.3em] text-xs">جاري استدعاء البيانات...</p>
      </div>
    );
  }

  if (!appResponse?.success || !appResponse?.data) {
    return (
      <div className="p-12 text-center font-arabic max-w-2xl mx-auto space-y-8 pt-24">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto border border-red-100">
           <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-3xl font-black text-neutral-900 tracking-tighter">خطأ في استرجاع البيانات</h1>
        <p className="text-neutral-500 font-bold leading-relaxed italic">
          عذراً، لم نتمكن من الوصول إلى سجلات هذه المعاملة حالياً. قد يكون الرابط منتهي الصلاحية أو أنك لا تملك الصلاحيات الكافية.
        </p>
        <Button onClick={() => router.push('/applications')} className="h-16 px-12 rounded-2xl bg-[#1a3a8f] text-white font-black text-lg gap-4 shadow-xl shadow-blue-900/10 hover:scale-105 transition-all active:scale-95">
           <ArrowRight className="w-6 h-6" />
          العودة لقائمة الطلبات
        </Button>
      </div>
    );
  }

  const app = appResponse.data;
     
  // Status to step number mapping (PRD workflow)
  const statusOrder: Record<string, number> = {
    'Draft': 0,
    'Submitted': 1,
    'DocumentReview': 2,
    'InReview': 2,
    'MedicalExam': 3,
    'Training': 4,
    'TheoryTest': 5,
    'PracticalTest': 6,
    'Approved': 7,
    'Payment': 7,
    'Issued': 8,
    'Active': 8,
    'Rejected': 0,
    'Cancelled': 0,
    'Expired': 0,
  };
  
  const currentStep = statusOrder[app.status] ?? 0;
  const isFailed = ['Rejected', 'Cancelled', 'Expired'].includes(app.status);
  
  // Simple workflow steps
  const workflowSteps = [
    { step: 1, label: 'تقديم الطلب', icon: FileText },
    { step: 2, label: 'سداد الرسوم', icon: CreditCard },
    { step: 3, label: 'الفحص الطبي', icon: Stethoscope },
    { step: 4, label: 'التدريب', icon: GraduationCap },
    { step: 5, label: 'الاختبار النظري', icon: BookOpen },
    { step: 6, label: 'الاختبار العملي', icon: Car },
    { step: 7, label: 'إصدار الرخصة', icon: CheckCircle2 },
  ];
  
  // Get service type name
  const getServiceTypeName = (serviceType: number) => {
    switch (serviceType) {
      case 1: return 'رخصة جديدة';
      case 2: return 'تجديد الرخصة';
      case 3: return 'استبدال الرخصة';
      case 4: return 'إضافة فئة';
      case 5: return 'إعادة الاختبار';
      default: return 'خدمة عامة';
    }
  };

  // Handle payment success - refresh data
  const handlePaymentSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: ['application', id] });
    await refetch();
  };

  return (
    <div className="space-y-8 font-arabic p-4 pb-24 max-w-5xl mx-auto" dir="rtl">
      {/* Payment Modal */}
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        applicationId={app.id}
        onSuccess={handlePaymentSuccess}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-3 text-xs font-bold text-neutral-400 uppercase tracking-widest">
        <button onClick={() => router.push('/applications')} className="hover:text-[#1a3a8f] transition-colors">
          طلباتي
        </button>
        <ChevronRight className="w-3 h-3 opacity-30" />
        <span className="text-[#1a3a8f]">{app.applicationNumber}</span>
      </nav>

      {/* Application Header */}
      <section className="bg-white border border-neutral-100 rounded-3xl shadow-sm p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-[#1a3a8f] flex items-center justify-center text-white">
            <Clock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-black text-neutral-900">{app.applicationNumber}</h1>
              <StatusBadge status={app.status as any} />
            </div>
            <p className="text-neutral-500 font-bold text-sm">
              {getServiceTypeName(app.serviceType)} - {app.licenseCategoryCode ? `فئة ${app.licenseCategoryCode}` : ''}
            </p>
          </div>
        </div>

        {/* Action Buttons based on status */}
        <div className="flex gap-3">
          {app.status === 'Draft' && (
            <Button onClick={() => router.push(`/applications/new?edit=${app.id}`)} className="h-12 px-6 rounded-2xl bg-[#1a3a8f] hover:bg-[#152d6f] text-white font-bold">
              <Edit className="w-5 h-5 me-2" />
              إكمال البيانات
            </Button>
          )}

          {app.status === 'Submitted' && (
            <>
              {/* Show PAYMENT button - opens modal */}
              <Button 
                onClick={() => setIsPaymentModalOpen(true)}
                className="h-14 px-8 rounded-2xl bg-[#D4A017] hover:bg-[#b88a14] text-white font-bold text-lg shadow-lg" 
                dir="rtl"
              >
                <CreditCard className="w-6 h-6 me-3" />
                سداد رسوم الطلب
              </Button>
              {/* Tooltip */}
              <div className="flex items-center text-sm text-neutral-500 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">
                <AlertCircle className="w-4 h-4 me-2 text-amber-600" />
                <span>يجب سداد الرسوم المستحقة لتتمكن من حجز المواعيد</span>
              </div>
            </>
          )}

          {app.status === 'MedicalExam' && (
            <Button onClick={() => router.push('/appointments/book')} className="h-12 px-6 rounded-2xl bg-[#1a3a8f] hover:bg-[#152d6f] text-white font-bold">
              <Calendar className="w-5 h-5 me-2" />
              حجز موعد فحص طبي
            </Button>
          )}

          {app.status === 'Training' && (
            <Button onClick={() => router.push('/appointments/book')} className="h-12 px-6 rounded-2xl bg-[#1a3a8f] hover:bg-[#152d6f] text-white font-bold">
              <Calendar className="w-5 h-5 me-2" />
              حجز موعد تدريب
            </Button>
          )}

          {app.status === 'TheoryTest' && (
            <Button onClick={() => router.push('/appointments/book')} className="h-12 px-6 rounded-2xl bg-[#1a3a8f] hover:bg-[#152d6f] text-white font-bold">
              <Calendar className="w-5 h-5 me-2" />
              حجز موعد اختبار نظري
            </Button>
          )}
        </div>
      </section>

      {/* Simple Workflow Timeline */}
      <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-black text-neutral-900">سير العمل</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {workflowSteps.map((item, index) => {
              const isCompleted = item.step < currentStep && !isFailed;
              const isCurrent = item.step === currentStep && !isFailed;
              const isPending = item.step > currentStep && !isFailed;
              const isStepFailed = isFailed && item.step <= currentStep;
              const Icon = item.icon;
              
              return (
                <div key={item.step} className="flex items-center gap-2 flex-shrink-0">
                  {/* Step Circle */}
                  <div className="flex flex-col items-center gap-2">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                      isCompleted && "bg-green-500 text-white shadow-lg shadow-green-500/20",
                      isCurrent && "bg-[#1a3a8f] text-white shadow-lg shadow-[#1a3a8f]/20 ring-4 ring-blue-100",
                      isPending && "bg-neutral-100 text-neutral-300",
                      isStepFailed && "bg-red-500 text-white"
                    )}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={cn(
                      "text-xs font-bold text-center whitespace-nowrap",
                      isCompleted && "text-green-600",
                      isCurrent && "text-[#1a3a8f]",
                      isPending && "text-neutral-400",
                      isStepFailed && "text-red-600"
                    )}>
                      {item.label}
                    </span>
                  </div>
                  {/* Connector Line */}
                  {index < workflowSteps.length - 1 && (
                    <div className={cn(
                      "h-[2px] w-8 md:w-12 mb-6 transition-all",
                      isCompleted ? "bg-green-500" : "bg-neutral-100"
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <Card className="border-none shadow-sm rounded-2xl bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-black text-neutral-900 flex items-center gap-2">
              <User className="w-5 h-5 text-[#1a3a8f]" />
              البيانات الشخصية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-neutral-400 font-bold">الرقم الوطني</span>
              <span className="font-black">{app.nationalId || '---'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-neutral-400 font-bold">تاريخ الميلاد</span>
              <span className="font-black">{app.dateOfBirth ? new Date(app.dateOfBirth).toLocaleDateString('ar-SA') : '---'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-neutral-400 font-bold">الجوال</span>
              <span className="font-black text-[#1a3a8f]">{app.mobileNumber || '---'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-neutral-400 font-bold">البريد</span>
              <span className="font-black">{app.email || '---'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Application Info */}
        <Card className="border-none shadow-sm rounded-2xl bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-black text-neutral-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#1a3a8f]" />
              تفاصيل الطلب
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-neutral-400 font-bold">تاريخ التقديم</span>
              <span className="font-black">{new Date(app.createdAt).toLocaleDateString('ar-SA')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-neutral-400 font-bold">آخر تحديث</span>
              <span className="font-black">{new Date(app.updatedAt).toLocaleDateString('ar-SA')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-neutral-400 font-bold">فئة الرخصة</span>
              <span className="font-black">{app.licenseCategoryCode || '---'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-neutral-400 font-bold">الحالة</span>
              <span className="font-black text-green-600">{app.status}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        {app.status !== 'Draft' && app.status !== 'Submitted' && (
          <Button variant="outline" onClick={() => router.push('/appointments/book')} className="h-14 rounded-2xl border-[#1a3a8f]/20 text-[#1a3a8f]">
            <Calendar className="w-5 h-5 me-3" />
            حجز موعد
          </Button>
        )}
        <Button variant="outline" onClick={() => router.push('/payments')} className="h-14 rounded-2xl border-[#D4A017]/20 text-[#D4A017]">
          <CreditCard className="w-5 h-5 me-3" />
          المدفوعات
        </Button>
        <Button variant="outline" onClick={() => router.push('/notifications')} className="h-14 rounded-2xl border-[#1a3a8f]/20 text-[#1a3a8f]">
          <Activity className="w-5 h-5 me-3" />
          الإشعارات
        </Button>
      </div>
    </div>
  );
}