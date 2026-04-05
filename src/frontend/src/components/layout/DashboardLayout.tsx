'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[#FDFDFD] overflow-hidden">
      {/* Dynamic Sidebar with toggle capability */}
      <Sidebar collapsed={sidebarCollapsed} />

      <div className="flex flex-col flex-1 relative overflow-hidden bg-neutral-50/50">
        <TopNav />
        
        {/* Main scrollable content area with premium padding and layout */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
