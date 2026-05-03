'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { dashboardService } from '@/services/dashboard.service';
import ApplicantDashboardPage from './ApplicantDashboardPage';
import { isApplicantRole, isAdminRole, isManagerRole, isReceptionistRole } from '@/lib/enums';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardDispatcher() {
  const user = useAuthStore(state => state.user);
  
  // Use TanStack Query to fetch dashboard data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard', user?.role],
    queryFn: async () => {
      if (isApplicantRole(user?.role)) {
        return dashboardService.getApplicantDashboard();
      }
      if (isAdminRole(user?.role)) {
        return dashboardService.getAdminDashboard();
      }
      if (isManagerRole(user?.role)) {
        return dashboardService.getManagerDashboard();
      }
      if (isReceptionistRole(user?.role)) {
        return dashboardService.getReceptionistDashboard();
      }
      
      return dashboardService.getEmployeeDashboard();
    },
    enabled: !!user,
    staleTime: 30000,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 font-arabic" dir="rtl">
        <Loader2 className="w-10 h-10 animate-spin text-[#1a3a8f]" />
        <p className="text-neutral-500 font-bold tracking-widest uppercase text-[10px]">جاري تحميل لوحة التحكم...</p>
      </div>
    );
  }

  if (error || (data && !data.success)) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-red-50 border border-red-100 rounded-2xl text-center space-y-4 font-arabic" dir="rtl">
        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-black text-red-900">حدث خطأ في الاتصال</h2>
          <p className="text-sm text-red-600 font-bold">فشل النظام في استرداد بيانات لوحة التحكم الخاصة بك.</p>
        </div>
        <Button 
          onClick={() => refetch()}
          className="bg-red-600 hover:bg-red-700 text-white font-bold"
        >
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  // If applicant, show applicant dashboard
  if (isApplicantRole(user?.role)) {
    return (
      <ApplicantDashboardPage 
        data={data?.data} 
        userName={user?.fullName || 'المتقدم'} 
      />
    );
  }

  // Fallback for employees/admins
  return (
    <div className="py-20 text-center font-arabic" dir="rtl">
      <h2 className="text-xl font-black text-[#1a3a8f]">مرحباً بك في بوابة الموظفين</h2>
      <p className="text-slate-500 mt-2 font-bold">يرجى استخدام القائمة الجانبية للوصول إلى مهامك.</p>
    </div>
  );
}