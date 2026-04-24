'use client';

import { useState } from 'react';
import OfficialSidebar from '@/components/layout/OfficialSidebar';
import TopNav from '@/components/layout/TopNav';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden group/layout font-arabic" dir="rtl">
      {/* Institutional Official Sidebar (Right Side in RTL) */}
      <OfficialSidebar collapsed={sidebarCollapsed} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 relative overflow-hidden bg-[#F4F7FA]">
        {/* Institutional Background Mesh */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
          <div 
            className="absolute -top-[15%] -right-[5%] w-[65%] h-[65%] rounded-full blur-[140px] opacity-[0.07]"
            style={{ background: 'radial-gradient(circle, #1a3a8f 0%, transparent 75%)' }}
          />
          <div 
            className="absolute top-[35%] -left-[10%] w-[55%] h-[55%] rounded-full blur-[120px] opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, #1a3a8f 0%, transparent 75%)' }}
          />
        </div>

        <TopNav onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 custom-scrollbar relative z-10">
          <div className="max-w-5xl mx-auto space-y-4 md:space-y-6 animate-fadeIn pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
