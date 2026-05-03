'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardSurfaceProps {
  children: React.ReactNode;
  className?: string;
  withGrain?: boolean;
  dir?: 'rtl' | 'ltr';
}

export const DashboardSurface = ({ children, className, withGrain = true, dir }: DashboardSurfaceProps) => {
  return (
    <div 
      className={cn("relative min-h-screen w-full overflow-hidden bg-[#F4F7FA]", className)}
      dir={dir}
    >
      {/* Background Mesh Gradients - King Blue Institutional Theme */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-[15%] -end-[5%] w-[65%] h-[65%] rounded-full blur-[140px] opacity-[0.07]"
          style={{ backgroundColor: '#1a3a8f' }}
        />
        <div 
          className="absolute top-[35%] -start-[10%] w-[55%] h-[55%] rounded-full blur-[120px] opacity-[0.04]"
          style={{ backgroundColor: '#D4A017' }}
        />
        <div 
          className="absolute -bottom-[15%] end-[15%] w-[60%] h-[60%] rounded-full blur-[130px] opacity-[0.05]"
          style={{ backgroundColor: '#1a3a8f' }}
        />
        
        {/* Submarine Lines / Pattern */}
        <div className="absolute inset-0 opacity-[0.015]" 
             style={{ backgroundImage: 'radial-gradient(#1a3a8f 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }}>
        </div>
      </div>

      {/* Noise Grain Overlay - Premium Texture */}
      {withGrain && (
        <div 
          className="absolute inset-0 z-1 pointer-events-none opacity-[0.02] mix-blend-overlay"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
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
