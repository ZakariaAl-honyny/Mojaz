'use client';

import { useState } from 'react';
import OfficialSidebar from '@/components/layout/OfficialSidebar';
import TopNav from '@/components/layout/TopNav';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden group/layout font-arabic" dir="rtl">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar (Slide from right in RTL) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 end-0 w-72 bg-[#1a3a8f] z-50 lg:hidden"
          >
            <div className="flex justify-end p-4">
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <OfficialSidebar collapsed={false} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (Always visible on lg+) */}
      <div className="hidden lg:block">
        <OfficialSidebar collapsed={sidebarCollapsed} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 relative overflow-hidden bg-[#F4F7FA]">
        {/* Institutional Background Mesh */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
          <div 
            className="absolute -top-[15%] -end-[5%] w-[65%] h-[65%] rounded-full blur-[140px] opacity-[0.07]"
            style={{ backgroundColor: '#1a3a8f' }}
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute top-[35%] -start-[10%] w-[55%] h-[55%] rounded-full blur-[120px] opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, #1a3a8f 0%, transparent 75%)' }}
          />
        </div>

        {/* TopNav with mobile menu button */}
        <TopNav 
          onMenuClick={() => setMobileMenuOpen(true)} 
          onDesktopMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          showSidebar={true}
        />
        
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 custom-scrollbar relative z-10">
          <div className="max-w-5xl mx-auto space-y-4 md:space-y-6 animate-fadeIn pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
