'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Plus,
  Loader2,
  Eye,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import applicationService, { ApplicationDraftDto } from '@/services/application.service';
import { cn } from '@/lib/utils';
import { ServiceTypeLabels, LicenseCategoryLabels } from '@/types/wizard.types';

// Status mapping - Arabic with refined styling
const statusMap: Record<string, { label: string; color: string; icon: any }> = {
  'Draft': { label: 'مسودة', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: Clock },
  'Submitted': { label: 'مُقدَّم', color: 'bg-blue-50 text-[#1a3a8f] border-blue-100', icon: CheckCircle },
  'DocumentReview': { label: 'مراجعة المستندات', color: 'bg-amber-50 text-amber-700 border-amber-100', icon: FileText },
  'MedicalExam': { label: 'الفحص الطبي', color: 'bg-rose-50 text-rose-700 border-rose-100', icon: AlertCircle },
  'Training': { label: 'التدريب', color: 'bg-purple-50 text-purple-700 border-purple-100', icon: Loader2 },
  'TheoryTest': { label: 'الاختبار النظري', color: 'bg-indigo-50 text-indigo-700 border-indigo-100', icon: FileText },
  'PracticalTest': { label: 'الاختبار العملي', color: 'bg-pink-50 text-pink-700 border-pink-100', icon: AlertCircle },
  'Approved': { label: 'مقبول', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: CheckCircle },
  'Issued': { label: 'مُصدَّر', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle },
  'Active': { label: 'نشط', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle },
  'Rejected': { label: 'مرفوض', color: 'bg-red-50 text-red-700 border-red-100', icon: AlertCircle },
};

// Format date to Arabic format
const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return '-';
  }
};

// Get status info
const getStatusInfo = (status: string) => {
  return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-700', icon: AlertCircle };
};

// Get category name in Arabic
const getCategoryName = (code: any): string => {
  if (code === undefined || code === null) return '-';
  
  // Handle numeric code (0, 1, 2...)
  if (typeof code === 'number') {
    return (LicenseCategoryLabels as any)[code]?.ar || String(code);
  }
  
  // Handle string code ("A", "B", "C" or numeric string "0", "1"...)
  const numCode = parseInt(String(code));
  if (!isNaN(numCode)) {
    return (LicenseCategoryLabels as any)[numCode]?.ar || String(code);
  }
  
  // Handle string key like "B" if mapped directly
  // In LicenseCategoryCode enum: A=0, B=1, etc.
  const mapping: Record<string, string> = {
    'A': 'دراجة نارية',
    'B': 'سيارة خاصة',
    'C': 'شاحنة خفيفة',
    'D': 'حافلة',
    'E': 'شاحنة ثقيلة',
    'F': 'مركبة خاصة'
  };
  
  return mapping[String(code)] || String(code);
};

// Get service type in Arabic
const getServiceTypeName = (type: any): string => {
  if (type === undefined || type === null) return '-';
  
  // Handle numeric type
  if (typeof type === 'number') {
    return (ServiceTypeLabels as any)[type]?.ar || String(type);
  }
  
  // Handle numeric string
  const numType = parseInt(String(type));
  if (!isNaN(numType)) {
    return (ServiceTypeLabels as any)[numType]?.ar || String(type);
  }

  // Handle string key like "NewLicense"
  const mapping: Record<string, string> = {
    'NewLicense': 'طلب رخصة جديدة',
    'Renewal': 'تجديد رخصة',
    'Replacement': 'بدل رخصة',
    'CategoryUpgrade': 'ترقية فئة',
    'InternationalLicense': 'رخصة دولية',
    'StatusChange': 'تغيير حالة',
    'MedicalExtension': 'تمديد طبي',
    'TemporaryLicense': 'رخصة مؤقتة',
    'TestRetake': 'إعادة الاختبار'
  };

  return mapping[String(type)] || String(type);
};

export default function ApplicantApplicationsPage() {
  const router = useRouter();

  // Fetch applications using TanStack Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['myApplications'],
    queryFn: () => applicationService.getMyApplications(),
    staleTime: 30000, // 30 seconds
    retry: 1,
  });

  // Transform API response to array
  const applications: ApplicationDraftDto[] = data?.success && data?.data?.items
    ? data.data.items
    : [];

  // Handle row clicky
  const handleRowClick = (appId: number) => {
    router.push(`/applications/${appId}`);
  };

  // Handle payment button click
  const handlePaymentClick = (e: React.MouseEvent, appId: number) => {
    e.stopPropagation();
    router.push('/payments');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-arabic" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          طلباتي
        </h1>
        <p className="text-gray-500 text-sm">
          عرض ومتابعة جميع طلبات رخصة القيادة
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#1a3a8f]" />
            <p className="text-gray-500 font-medium">جاري تحميل الطلبات...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
          <p className="text-red-700 font-medium mb-2">حدث خطأ في تحميل البيانات</p>
          <p className="text-red-600 text-sm mb-4">يرجى التحقق من اتصال الخادم</p>
          <Button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700"
          >
            إعادة المحاولة
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && applications.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            لا توجد طلبات سابقة
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            لم تقم بتقديم أي طلبات رخصة قيادة حتى الآن
          </p>
          <Button
            onClick={() => router.push('/applications/new')}
            className="inline-flex items-center px-6 py-3 bg-[#1a3a8f] text-white rounded-md font-medium hover:bg-[#152d6f]"
          >
            <Plus className="w-5 h-5 me-2" />
            إصدار رخصة جديدة
          </Button>
        </div>
      )}

      {/* Data Table - Redesigned */}
      {!isLoading && !error && applications.length > 0 && (
        <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-neutral-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="overflow-x-auto">
            <table className="w-full text-start">
              <thead>
                <tr className="bg-neutral-50/50 border-b border-neutral-100">
                  <th className="px-6 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">رقم الطلب</th>
                  <th className="px-6 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">نوع الخدمة</th>
                  <th className="px-6 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">الفئة</th>
                  <th className="px-6 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-center">الحالة</th>
                  <th className="px-6 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-end">التاريخ</th>
                  <th className="px-6 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {applications.map((app) => {
                  const statusInfo = getStatusInfo(app.status);
                  const StatusIcon = statusInfo.icon || AlertCircle;
                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-blue-50/30 cursor-pointer transition-all duration-300 group"
                      onClick={() => handleRowClick(app.id)}
                    >
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-[#1a3a8f] tracking-tight group-hover:underline decoration-2 underline-offset-4">
                            {app.applicationNumber}
                          </span>
                          <span className="text-[10px] font-bold text-neutral-400">ID: #{app.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-bold text-neutral-700">
                          {getServiceTypeName(app.serviceType)}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#1a3a8f] text-white text-xs font-black shadow-lg shadow-blue-900/20">
                            {app.licenseCategoryCode || '-'}
                          </span>
                          <span className="text-xs font-bold text-neutral-600">
                            {getCategoryName(app.licenseCategoryCode)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={cn(
                          "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black border transition-all",
                          statusInfo.color
                        )}>
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-end">
                        <span className="text-xs font-bold text-neutral-500">
                          {formatDate(app.createdAt)}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(app.id);
                            }}
                            className="h-10 w-10 p-0 rounded-xl bg-blue-50 text-[#1a3a8f] hover:bg-[#1a3a8f] hover:text-white transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          {app.status === 'Submitted' && (
                            <Button
                              size="sm"
                              onClick={(e) => handlePaymentClick(e, app.id)}
                              className="h-10 px-4 rounded-xl bg-[#D4A017] hover:bg-[#b88a14] text-white text-xs font-black shadow-lg shadow-amber-900/10"
                            >
                              <CreditCard className="w-4 h-4 me-2" />
                              سداد
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Footer */}
      {!isLoading && !error && applications.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>إجمالي الطلبات: {applications.length}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            className="text-xs"
          >
            <Loader2 className="w-3 h-3 me-1" />
            تحديث
          </Button>
        </div>
      )}
    </div>
  );
}