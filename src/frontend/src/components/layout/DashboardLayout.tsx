'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar collapsed={sidebarCollapsed} />
        <div className="flex-1 flex flex-col min-h-screen">
          <TopNav onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
          <main className="flex-1 p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}