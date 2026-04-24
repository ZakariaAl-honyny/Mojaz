import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Statistics card variant for displaying metrics
 */
interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The main value to display */
  value: string | number
  /** Label describing the metric */
  label: string
  /** Optional trend indicator (positive means up/good, negative means down/bad) */
  trend?: number
  /** Optional trend label (e.g., "vs last month") */
  trendLabel?: string
  /** Icon element to display */
  icon?: React.ReactNode
  /** Whether the trend is positive (blue) or negative (red) */
  trendDirection?: 'up' | 'down'
}

function StatsCard({
  className,
  value,
  label,
  trend,
  trendLabel,
  icon,
  trendDirection = 'up',
  ...props
}: StatsCardProps) {
  const trendStyles = {
    up: 'text-emerald-600',
    down: 'text-red-600',
  }

  const trendIconStyles = {
    up: 'rotate-0',
    down: 'rotate-180',
  }

  return (
    <div
      className={cn(
        'bg-white text-neutral-900 rounded-xl md:rounded-2xl border border-slate-200 p-4 md:p-6 shadow-sm hover:shadow-xl hover:border-[#1a3a8f]/20 transition-all duration-500 group relative overflow-hidden',
        className
      )}
      {...props}
    >
      {/* Institutional Accent */}
      <div className="absolute top-0 right-0 w-1.5 h-full bg-[#1a3a8f]/10 group-hover:bg-[#1a3a8f] transition-all" />

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-neutral-400 mb-0.5 md:mb-1">{label}</p>
          <p className="mt-1 md:mt-2 text-2xl md:text-3xl font-black text-neutral-900 tracking-tighter leading-none group-hover:text-[#1a3a8f] transition-colors">{value}</p>

          {trend !== undefined && (
            <div className="mt-3 md:mt-4 flex items-center gap-1.5 md:gap-2 bg-neutral-50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl w-fit border border-neutral-100 group-hover:bg-white transition-colors">
              <span
                className={cn(
                  'inline-flex items-center text-[10px] md:text-xs font-black',
                  trendStyles[trendDirection]
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={cn('h-3 w-3 md:h-3.5 md:w-3.5', trendIconStyles[trendDirection])}
                >
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
                <span className="ms-1">{Math.abs(trend)}%</span>
              </span>
              {trendLabel && (
                <span className="text-[9px] md:text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{trendLabel}</span>
              )}
            </div>
          )}
        </div>

        {icon && (
          <div className="w-10 h-10 md:w-12 md:h-12 bg-neutral-50 rounded-lg md:rounded-xl flex items-center justify-center text-neutral-400 group-hover:bg-[#1a3a8f]/10 group-hover:text-[#1a3a8f] transition-all border border-neutral-100 group-hover:border-[#1a3a8f]/20">
            {React.cloneElement(icon as React.ReactElement, { className: cn((icon as React.ReactElement).props.className, 'w-5 h-5 md:w-6 md:h-6') })}
          </div>
        )}
      </div>
    </div>
  )
}

export { StatsCard, type StatsCardProps }