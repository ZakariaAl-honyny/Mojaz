import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Hero section variant for landing pages
 */
interface HeroSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Hero section content */
  children?: React.ReactNode
  /** Main heading title */
  title: string
  /** Subtitle/description */
  subtitle?: string
  /** Background gradient variant */
  gradient?: 'primary' | 'secondary' | 'accent' | 'muted'
  /** Whether to show wave decoration at bottom */
  showWave?: boolean
  /** Text alignment */
  align?: 'center' | 'start' | 'end'
}

function HeroSection({
  className,
  children,
  title,
  subtitle,
  gradient = 'primary',
  showWave = true,
  align = 'center',
  ...props
}: HeroSectionProps) {
  const gradientStyles = {
    primary: 'from-primary via-primary to-accent',
    secondary: 'from-secondary via-secondary to-primary',
    accent: 'from-accent via-primary to-secondary',
    muted: 'from-muted via-muted-foreground/10 to-muted',
  }

  const alignStyles = {
    center: 'text-center',
    start: 'text-start',
    end: 'text-end',
  }

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      {/* Background gradient */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br',
          gradientStyles[gradient]
        )}
      />

      {/* Background pattern - subtle dot pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content */}
      <div className="container relative mx-auto px-4 py-16 lg:py-24">
        <div className={cn('mx-auto max-w-4xl', alignStyles[align])}>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl text-balance">
            {title}
          </h1>
          {subtitle && (
            <p className="mb-10 text-lg text-primary-foreground/90 sm:text-xl lg:text-2xl text-pretty">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>

      {/* Wave decoration at bottom */}
      {showWave && (
        <div className="absolute bottom-0 start-0 end-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              className="fill-background"
            />
          </svg>
        </div>
      )}
    </div>
  )
}

export { HeroSection, type HeroSectionProps }