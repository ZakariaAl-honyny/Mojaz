'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { UserRole, isManagerRole } from '@/lib/enums';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { StatsCard } from '@/components/ui/stats-card';
import { ManagerKpiDto } from '@/types/application.types';
import { dashboardService } from '@/services/dashboard.service';
import { 
  Users, 
  FileText, 
  FileKey2, 
  DollarSign, 
  Settings, 
  BarChart3,
  ShieldCheck,
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  CalendarDays,
  TrendingUp,
  Clock,
  Activity,
  ArrowRightLeft,
  Loader2,
  Play,
  Eye,
  ChevronLeft,
  BarChart2,
  Timer,
  Percent,
  LucideIcon
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardLink {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
  badge?: string;
}

const dashboardLinks: DashboardLink[] = [
  { href: '/employee/queue', label: 'طابور المعاملات', icon: FileText, description: 'عرض ومراجعة الطلبات', badge: '4' },
  { href: '/employee/reports', label: 'التقارير', icon: BarChart3, description: 'إحصائيات وتقارير شاملة' },
  { href: '/employee/manager/users', label: 'إدارة الموظفين', icon: Users, description: 'إدارة حسابات الموظفين' },
  { href: '/employee/attendance', label: 'الحضور والانصراف', icon: Timer, description: 'سجلات الحضور والانصراف' },
  { href: '/admin/workflows', label: 'سير العمل', icon: Activity, description: 'تكوين مراحل سير العمل' },
  { href: '/admin/fees', label: 'الرسوم', icon: DollarSign, description: 'إدارة رسوم الخدمات' },
  { href: '/admin/system-settings', label: 'الإعدادات', icon: Settings, description: 'إعدادات النظام' },
];

function ManagerDashboardContent({ data }: { data?: ManagerKpiDto | null }) {
  const kpi = data;
  
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8 font-arabic" dir="rtl">
      {/* Manager Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-2 h-16 bg-[#1a3a8f] rounded-full shadow-lg shadow-blue-900/30" />
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-neutral-900 tracking-tighter">
                لوحة تحكم المدير
              </h1>
              <Badge variant="outline" className="h-6 px-2 border-emerald-200 bg-emerald-50 text-emerald-600 text-[10px] font-black gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                نشط
              </Badge>
            </div>
            <p className="text-neutral-500 font-bold text-xs uppercase tracking-widest">
              الإشراف على العمليات والمطاعين
            </p>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          label="طلبات اليوم" 
          value={kpi?.todayTotalApplications || 0}
          icon={FileText}
          color="text-blue-600"
        />
        <StatsCard 
          label="معلقة للمراجعة" 
          value={kpi?.totalStalledApplications || 0}
          icon={Clock}
          color="text-amber-600"
        />
        <StatsCard 
          label="مكتملة اليوم" 
          value={kpi?.todayTotalApplications || 0}
          icon={CheckCircle2}
          color="text-emerald-600"
        />
        <StatsCard 
          label="مرفوضة اليوم" 
          value={0}
          icon={XCircle}
          color="text-red-600"
        />
      </div>

      {/* Quick Access Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {dashboardLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="border-2 border-transparent hover:border-[#1a3a8f] hover:shadow-lg transition-all cursor-pointer group bg-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#1a3a8f] group-hover:bg-[#152d6f] flex items-center justify-center shadow-lg shadow-blue-900/10 transition-all group-hover:scale-105">
                  <link.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-black text-neutral-900 text-lg leading-tight mb-1">{link.label}</p>
                  <p className="text-neutral-400 font-bold text-xs leading-tight">{link.description}</p>
                </div>
                {link.badge && (
                  <Badge variant="secondary" className="h-6 w-6 p-0 flex items-center justify-center bg-neutral-100 text-neutral-600">
                    {link.badge}
                  </Badge>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-neutral-50 border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1a3a8f] flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-xl font-black text-neutral-900">النشاطات الأخيرة</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-neutral-50">
            {[
              { title: 'طلب جديد MOJ-2025-0001', time: 'منذ 5 دقائق', type: 'application' },
              { title: 'دفع رسوم - أحمد محمد', time: 'منذ 15 دقائق', type: 'payment' },
              { title: 'إتمام فحص طبي', time: 'منذ 30 دقائق', type: 'medical' },
            ].map((item, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#1a3a8f]" />
                  <span className="font-bold text-neutral-800">{item.title}</span>
                </div>
                <span className="text-neutral-400 font-bold text-sm">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ManagerDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  // RBAC check
  useEffect(() => {
    if (!isAuthLoading && (!isAuthenticated || !isManagerRole(user?.role) && user?.role !== UserRole.Admin)) {
      router.replace('/forbidden');
    }
  }, [user, isAuthenticated, isAuthLoading, router]);

  // Fetch manager dashboard data
  const { data, isLoading, error } = useQuery({
    queryKey: ['manager-dashboard'],
    queryFn: () => dashboardService.getManagerDashboard(),
    enabled: !!user && (isManagerRole(user?.role) || user?.role === UserRole.Admin),
  });

  if (isAuthLoading || isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <Skeleton className="h-32 w-full mb-6" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <p className="text-red-600 font-bold">حدث خطأ في تحميل البيانات</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              إعادة المحاولة
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <ManagerDashboardContent data={data?.data} />;
}