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

// License category mapping - Arabic
const categoryMap: Record<string, string> = {
  'A': 'دراجة نارية',
  'B': 'خصوصي',
  'C': 'حكومي',
  'D': 'أجرة',
  'E': 'حميل',
  'F': 'تعليم',
};

// Service type mapping - Arabic
const serviceTypeMap: Record<string, string> = {
  'NewLicense': 'إصدار رخصة جديدة',
  'Renewal': 'تجديد الرخصة',
  'Replacement': 'بدل فاقد/تالف',
  'CategoryAddition': 'إضافة فئة',
  'International': 'رخصة دولية',
  'Retest': 'إعادة الاختبار',
};

// Status mapping - Arabic
const statusMap: Record<string, { label: string; color: string }> = {
  'Draft': { label: 'مسودة', color: 'bg-gray-100 text-gray-700' },
  'Submitted': { label: 'مُقدَّم', color: 'bg-blue-100 text-blue-700' },
  'DocumentReview': { label: 'مراجعة المستندات', color: 'bg-yellow-100 text-yellow-700' },
  'MedicalExam': { label: 'الفحص الطبي', color: 'bg-orange-100 text-orange-700' },
  'Training': { label: 'التدريب', color: 'bg-purple-100 text-purple-700' },
  'TheoryTest': { label: 'الاختبار النظري', color: 'bg-indigo-100 text-indigo-700' },
  'PracticalTest': { label: 'الاختبار العملي', color: 'bg-pink-100 text-pink-700' },
  'Approved': { label: 'مقبول', color: 'bg-green-100 text-green-700' },
  'Issued': { label: 'مُصدَّر', color: 'bg-emerald-100 text-emerald-700' },
  'Active': { label: 'نشط', color: 'bg-emerald-100 text-emerald-700' },
  'Rejected': { label: 'مرفوض', color: 'bg-red-100 text-red-700' },
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
  return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-700' };
};

// Get category name in Arabic
const getCategoryName = (code: number | null): string => {
  if (!code) return '-';
  return categoryMap[code] || "غير معروف";
};

// Get service type in Arabic
const getServiceTypeName = (type: string | number): string => {
  const typeStr = String(type);
  return serviceTypeMap[typeStr] || typeStr;
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

      {/* Data Table */}
      {!isLoading && !error && applications.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-start text-xs font-bold text-gray-600 uppercase tracking-wider">
                    رقم الطلب
                  </th>
                  <th className="px-4 py-3 text-start text-xs font-bold text-gray-600 uppercase tracking-wider">
                    نوع الخدمة
                  </th>
                  <th className="px-4 py-3 text-start text-xs font-bold text-gray-600 uppercase tracking-wider">
                    الفئة
                  </th>
                  <th className="px-4 py-3 text-start text-xs font-bold text-gray-600 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-4 py-3 text-start text-xs font-bold text-gray-600 uppercase tracking-wider">
                    تاريخ التقديم
                  </th>
                  <th className="px-4 py-3 text-start text-xs font-bold text-gray-600 uppercase tracking-wider">
                    الإجراء
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => {
                  const statusInfo = getStatusInfo(app.status);
                  return (
                    <tr 
                      key={app.id} 
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleRowClick(app.id)}
                    >
                      <td className="px-4 py-4">
                        <span className="text-sm font-bold text-[#1a3a8f]">
                          {app.applicationNumber}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-700">
                          {getServiceTypeName(app.serviceType)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-[#1a3a8f] text-white text-xs font-bold">
                            {app.licenseCategoryCode || '-'}
                          </span>
                          <span className="text-sm text-gray-700">
                            {getCategoryName(app.licenseCategoryCode)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600">
                          {formatDate(app.createdAt)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {/* View Details Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(app.id);
                            }}
                            className="h-8 px-3 text-xs font-medium border-gray-200 hover:border-[#1a3a8f] hover:text-[#1a3a8f]"
                          >
                            <Eye className="w-3 h-3 me-1" />
                            التفاصيل
                          </Button>
                          
                          {/* Payment Button - only for Submitted status */}
                          {app.status === 'Submitted' && (
                            <Button
                              size="sm"
                              onClick={(e) => handlePaymentClick(e, app.id)}
                              className="h-8 px-3 text-xs font-medium bg-[#D4A017] hover:bg-[#b88a14] text-white"
                            >
                              <CreditCard className="w-3 h-3 me-1" />
                              سداد الرسوم
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