'use client';

import Link from 'next/link';
import { 
  FileText, CheckCircle2, Clock, AlertCircle, Shield, BarChart3, 
  Activity, ArrowRight, Stethoscope, ClipboardCheck, Users
} from 'lucide-react';

export default function DashboardPage() {
  // Demo data - no API calls
  const stats = {
    totalApplications: 156,
    pendingReview: 23,
    completedToday: 45,
    rejected: 12
  };

  const quickActions = [
    { label: 'المعاملات', icon: FileText, href: '/dashboard/applications', color: 'bg-blue-500' },
    { label: 'طابور المراجعة', icon: Clock, href: '/dashboard/queue', color: 'bg-yellow-500' },
    { label: 'الفحص الطبي', icon: Stethoscope, href: '/dashboard/doctor', color: 'bg-yellow-500' },
    { label: 'الاختبارات', icon: ClipboardCheck, href: '/dashboard/tests', color: 'bg-green-500' },
    { label: 'الرخص', icon: Shield, href: '/dashboard/licenses', color: 'bg-purple-500' },
    { label: 'التقارير', icon: BarChart3, href: '/dashboard/reports', color: 'bg-blue-500' },
  ];

  const recentActivity = [
    { type: 'approve', name: 'أحمد محمد علي', app: 'MOJ-2025-48291037', time: 'منذ 5 دقائق', status: 'تم القبول' },
    { type: 'reject', name: 'خالد عمر سعيد', app: 'MOJ-2025-39182746', time: 'منذ 15 دقيقة', status: 'مرفوض' },
    { type: 'medical', name: 'علياء أحمد', app: 'MOJ-2025-57483910', time: 'منذ 30 دقيقة', status: 'فحص طبي' },
    { type: 'license', name: 'سارة عمران', app: 'MOJ-2025-71384926', time: 'منذ ساعة', status: 'إصدار رخصة' },
  ];

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'approve': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'reject': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'medical': return <Stethoscope className="w-4 h-4 text-yellow-600" />;
      default: return <Shield className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'تم القبول': return 'bg-green-100 text-green-700';
      case 'مرفوض': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-3" dir="rtl">
      <div className="max-w-2xl mx-auto space-y-3">
        {/* Header */}
        <div className="bg-white rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1a3a8f] flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold">مُجاز</h1>
              <p className="text-xs text-gray-500">لوحة التحكم</p>
            </div>
          </div>
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">ديمو</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <FileText className="w-4 h-4 text-blue-600 mx-auto mb-1" />
            <p className="font-bold text-lg">{stats.totalApplications}</p>
            <p className="text-xs text-blue-600">الإجمالي</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-3 text-center">
            <Clock className="w-4 h-4 text-yellow-600 mx-auto mb-1" />
            <p className="font-bold text-lg">{stats.pendingReview}</p>
            <p className="text-xs text-yellow-600">قيد المراجعة</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto mb-1" />
            <p className="font-bold text-lg">{stats.completedToday}</p>
            <p className="text-xs text-green-600">مكتمل</p>
          </div>
          <div className="bg-red-50 rounded-xl p-3 text-center">
            <AlertCircle className="w-4 h-4 text-red-600 mx-auto mb-1" />
            <p className="font-bold text-lg">{stats.rejected}</p>
            <p className="text-xs text-red-600">مرفوض</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-3">
          <h2 className="font-bold text-sm mb-2">الروابط السريعة</h2>
          <div className="grid grid-cols-3 gap-2">
            {quickActions.map(action => (
              <Link key={action.label} href={action.href}>
                <button className={`w-full ${action.color} text-white py-2.5 rounded-lg font-bold text-xs flex flex-col items-center gap-1`}>
                  <action.icon className="w-4 h-4" />
                  {action.label}
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="p-2 border-b bg-gray-50 flex items-center justify-between">
            <span className="font-bold text-sm">النشاط الأخير</span>
          </div>
          {recentActivity.map((item, index) => (
            <div key={index} className="p-2 border-b flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  item.type === 'approve' ? 'bg-green-100' :
                  item.type === 'reject' ? 'bg-red-100' :
                  item.type === 'medical' ? 'bg-yellow-100' : 'bg-blue-100'
                }`}>
                  {getActivityIcon(item.type)}
                </div>
                <div>
                  <p className="font-bold text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.app}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-bold ${getStatusColor(item.status)}`}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}