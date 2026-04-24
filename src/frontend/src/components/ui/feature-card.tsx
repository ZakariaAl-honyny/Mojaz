import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Feature card variant for displaying service or feature items
 */
interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon element to display at top */
  icon?: React.ReactNode
  /** Card title */
  title: string
  /** Card description */
  description?: string
  /** Optional action element (link, button, etc.) */
  action?: React.ReactNode
  /** Visual variant */
  variant?: 'default' | 'bordered' | 'filled'
}

function FeatureCard({
  className,
  icon,
  title,
  description,
  action,
  variant = 'default',
  ...props
}: FeatureCardProps) {
  const variantStyles = {
    default: 'bg-card',
    bordered: 'bg-background border-2 border-primary/20',
    filled: 'bg-primary/5 bg-primary/10',
  }

  return (
    <div
      className={cn(
        'rounded-xl p-6 shadow-sm transition-shadow hover:shadow-md',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      
      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}
      
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  )
}

export { FeatureCard, type FeatureCardProps }