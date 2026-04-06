import React from 'react';
import PublicHeader from '@/components/layout/PublicHeader';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col grain-overlay">
      <PublicHeader />
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="py-12 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-600 rounded-md flex items-center justify-center text-white text-xs font-bold">
              M
            </div>
            <span className="font-semibold text-neutral-900 dark:text-neutral-50">Mojaz</span>
          </div>
          
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            &copy; {new Date().getFullYear()} Mojaz Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
