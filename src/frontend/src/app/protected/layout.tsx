'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  Home, FileText, Calendar, User, 
  Menu, X, Users, ClipboardList, Shield, Activity,
  Stethoscope, ClipboardCheck, BarChart3,
  Search, Bell, Settings
} from 'lucide-react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: Home, href: '/dashboard', color: 'bg-blue-500' },
    { id: 'applications', label: 'المعاملات', icon: FileText, href: '/dashboard/applications', color: 'bg-blue-500' },
    { id: 'queue', label: 'طابور المراجعة', icon: ClipboardList, href: '/dashboard/queue', color: 'bg-yellow-500' },
    { id: 'doctor', label: 'الفحص الطبي', icon: Stethoscope, href: '/dashboard/doctor', color: 'bg-yellow-500' },
    { id: 'tests', label: 'الاختبارات', icon: ClipboardCheck, href: '/dashboard/tests', color: 'bg-green-500' },
    { id: 'licenses', label: 'الرخص', icon: Shield, href: '/dashboard/licenses', color: 'bg-purple-500' },
    { id: 'reports', label: 'التقارير', icon: BarChart3, href: '/dashboard/reports', color: 'bg-blue-500' },
    { id: 'users', label: 'المستخدمين', icon: Users, href: '/dashboard/users', color: 'bg-blue-500' },
    { id: 'settings', label: 'الإعدادات', icon: Settings, href: '/dashboard/settings', color: 'bg-gray-500' },
  ];

  useEffect(() => {
    setSidebarOpen(true);
  }, []);

  const isActive = (href: string) => pathname === href || (href !== '/dashboard' && pathname?.startsWith(href));

  return (
    <div className="min-h-screen bg-gray-100 font-arabic" dir="rtl">
      {/* Top Navbar */}
      <header className="fixed top-0 start-0 end-0 h-14 bg-[#1a3a8f] text-white z-50 flex items-center justify-between px-3">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link href="/dashboard" className="font-bold">مُجاز - بوابة الموظفين</Link>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-white/10 rounded-lg">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-lg">
            <Settings className="w-5 h-5" />
          </button>
          <span className="text-xs bg-green-500 px-2 py-1 rounded-full">ديمو</span>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed top-14 start-0 bottom-0 w-52 bg-white shadow-lg transition-transform z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <nav className="p-2 space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive(item.href) 
                    ? 'bg-gray-100' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg ${item.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className={`font-bold text-xs ${isActive(item.href) ? 'text-blue-600' : 'text-gray-700'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`pt-14 min-h-screen transition-all ${sidebarOpen ? 'me-52' : 'me-0'}`}>
        <div className="p-2">
          {children}
        </div>
      </main>
    </div>
  );
}