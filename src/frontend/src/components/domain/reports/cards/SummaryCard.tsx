'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value?: number;
  trend?: number;
  isCurrency?: boolean;
  loading?: boolean;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ 
  title, 
  value, 
  trend, 
  isCurrency,
  loading 
}) => {
  return (
    <Card className="shadow-sm border-neutral-200 overflow-hidden relative group hover:border-primary-200 transition-colors">
      <CardContent className="p-6">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-neutral-500 mb-1">{title}</span>
          
          {loading ? (
            <div className="h-9 flex items-center">
              <Loader2 className="w-5 h-5 animate-spin text-neutral-300" />
            </div>
          ) : (
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-neutral-900 leading-tight">
                {isCurrency ? `$${(value || 0).toLocaleString()}` : (value || 0).toLocaleString()}
              </span>
              
              {trend !== undefined && (
                <div className={`flex items-center gap-0.5 text-xs font-semibold mb-1.5 ${trend >= 0 ? 'text-success' : 'text-error'}`}>
                  {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {Math.abs(trend)}%
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Subtle background decoration */}
        <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
           <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
             <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" className="text-primary-500" />
           </svg>
        </div>
      </CardContent>
    </Card>
  );
};
