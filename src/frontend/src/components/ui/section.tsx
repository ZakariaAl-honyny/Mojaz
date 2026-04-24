import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Generic section wrapper for page content areas
 */
interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Section content */
  children: React.ReactNode
  /** Optional section title */
  title?: string
  /** Optional section description */
  description?: string
  /** Whether to use a container with max-width */
  container?: boolean
  /** Section background variant */
  variant?: 'default' | 'muted' | 'bordered' | 'transparent'
}

function Section({
  className,
  children,
  title,
  description,
  container = true,
  variant = 'default',
  ...props
}: SectionProps) {
  const variantStyles = {
    default: 'bg-background',
    muted: 'bg-muted/50 bg-muted/20',
    bordered: 'bg-background border border-border',
    transparent: 'bg-transparent',
  }

  return (
    <section
      className={cn('py-8 md:py-12', variantStyles[variant], className)}
      {...props}
    >
      {container ? (
        <div className="container mx-auto px-4">
          {(title || description) && (
            <div className="mb-8">
              {title && (
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-2 text-muted-foreground">{description}</p>
              )}
            </div>
          )}
          {children}
        </div>
      ) : (
        <>
          {(title || description) && (
            <div className="mb-8 px-4">
              {title && (
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-2 text-muted-foreground">{description}</p>
              )}
            </div>
          )}
          {children}
        </>
      )}
    </section>
  )
}

export { Section, type SectionProps }