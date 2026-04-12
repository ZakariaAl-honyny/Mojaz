'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardSurfaceProps {
  children: React.ReactNode;
  className?: string;
  withGrain?: boolean;
}

export const DashboardSurface = ({ children, className, withGrain = true }: DashboardSurfaceProps) => {
  return (
    <div className={cn("relative min-h-screen w-full overflow-hidden bg-[#F9FAFB]", className)}>
      {/* Background Mesh Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full blur-[120px] opacity-20"
          style={{ background: 'radial-gradient(circle, #006C35 0%, transparent 70%)' }}
        />
        <div 
          className="absolute top-[40%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[100px] opacity-10"
          style={{ background: 'radial-gradient(circle, #D4A017 0%, transparent 70%)' }}
        />
        <div 
          className="absolute -bottom-[10%] right-[20%] w-[50%] h-[50%] rounded-full blur-[110px] opacity-15"
          style={{ background: 'radial-gradient(circle, #004C25 0%, transparent 70%)' }}
        />
      </div>

      {/* Noise Grain Overlay */}
      {withGrain && (
        <div 
          className="absolute inset-0 z-1 pointer-events-none opacity-[0.03] mix-blend-overlay"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
          }}
        />
      )}

      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
