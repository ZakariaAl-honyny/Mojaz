'use client';

import React from 'react';
import { ThemeProvider } from '@/providers/theme-provider';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="relative min-h-screen flex flex-col">
        {children}
      </div>
    </ThemeProvider>
  );
}
