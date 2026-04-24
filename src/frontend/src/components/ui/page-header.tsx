import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Breadcrumb item for navigation
 */
interface BreadcrumbItem {
  /** Display text */
  label: string
  /** Optional href for link */
  href?: string
  /** Whether this is the current page */
  isCurrent?: boolean
}

/**
 * Page header with title, description, and optional breadcrumbs
 */
interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Page title */
  title: string
  /** Optional description */
  description?: string
  /** Optional breadcrumb navigation */
  breadcrumbs?: BreadcrumbItem[]
  /** Optional action element (button, links, etc.) */
  action?: React.ReactNode
}

function PageHeader({
  className,
  title,
  description,
  breadcrumbs,
  action,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn('py-6 md:py-8', className)}
      {...props}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-4" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
            {breadcrumbs.map((item, index) => (
              <li key={index} className="flex items-center gap-1">
                {index > 0 && (
                  <span className="mx-2 text-border">/</span>
                )}
                {item.isCurrent || item.href === undefined ? (
                  <span
                    aria-current={item.isCurrent ? 'page' : undefined}
                    className={cn(
                      item.isCurrent && 'text-foreground font-medium'
                    )}
                  >
                    {item.label}
                  </span>
                ) : (
                  <a
                    href={item.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Title row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-muted-foreground">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  )
}

export { PageHeader, type PageHeaderProps, type BreadcrumbItem }