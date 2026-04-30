'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { UserRole } from '@/lib/enums';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatsCard } from '@/components/ui/stats-card';
import { AdminKpiDto } from '@/types/application.types';
import { dashboardService } from '@/services/dashboard.service';
import { 
  Users, 
  FileText, 
  FileKey2, 
  DollarSign, 
  Settings, 
  BarChart3,
  ShieldCheck,
  LucideIcon
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

interface QuickLink {
  href: string;
  label: string;
  icon: LucideIcon;
  color: string;
}

const quickLinks: QuickLink[] = [
  { href: '/admin/users', label: 'إدارة المستخدمين', icon: Users, color: 'bg-blue-50 text-blue-600' },
  { href: '/admin/workflows', label: 'سير العمل', icon: BarChart3, color: 'bg-purple-50 text-purple-600' },
  { href: '/admin/fees', label: 'إدارة الرسوم', icon: DollarSign, color: 'bg-amber-50 text-amber-600' },
  { href: '/admin/system-settings', label: 'الإعدادات', icon: Settings, color: 'bg-neutral-50 text-neutral-600' },
  { href: '/admin/audit-logs', label: 'سجل الرقابة', icon: ShieldCheck, color: 'bg-red-50 text-red-600' },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  // RBAC check
  useEffect(() => {
    if (!isAuthLoading && (!isAuthenticated || user?.role !== UserRole.Admin)) {
      router.replace('/forbidden');
    }
  }, [user, isAuthenticated, isAuthLoading, router]);

  // Fetch admin dashboard data
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => dashboardService.getAdminDashboard(),
    enabled: !!user && user.role === UserRole.Admin,
  });

  const kpi: AdminKpiDto | null = data?.data ?? null;

  if (isAuthLoading || isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 font-arabic" dir="rtl">
      {/* Admin Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-12 bg-[#1a3a8f] rounded-full" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
               لوحة تحكم المدير العام
              </h1>
              <Badge variant="outline" className="h-5 px-1.5 border-emerald-100 bg-emerald-50 text-emerald-600 text-[10px] font-black gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                نشط
              </Badge>
            </div>
            <p className="text-neutral-500 font-bold text-[10px] uppercase tracking-widest mt-1">
              الإشراف الشامل على المنصة
            </p>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          label="إجمالي الطلبات" 
          value={kpi?.todayStats?.applications || 0}
          icon={FileText}
          color="text-blue-600"
        />
        <StatsCard 
          label="الطلبات النشطة" 
          value={kpi?.todayStats?.activeUsers || 0}
          icon={FileKey2}
          color="text-emerald-600"
        />
        <StatsCard 
          label="الرخص المصدرة" 
          value={kpi?.todayStats?.licenses || 0}
          icon={ShieldCheck}
          color="text-purple-600"
        />
        <StatsCard 
          label="إجمالي الإيرادات" 
          value={`${(kpi?.todayStats?.revenue || 0).toLocaleString()} ر.ي`}
          icon={DollarSign}
          color="text-amber-600"
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="border border-neutral-200 shadow-sm hover:shadow-md hover:border-[#1a3a8f]/30 transition-all cursor-pointer group">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${link.color}`}>
                  <link.icon className="w-6 h-6" />
                </div>
                <span className="font-bold text-neutral-800 text-lg">{link.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity Placeholder */}
      <Card className="border border-neutral-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold">النشاطات الأخيرة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-neutral-400">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>قم بزيارة صفحات الإدارة للاطلاع على التفاصيل</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}