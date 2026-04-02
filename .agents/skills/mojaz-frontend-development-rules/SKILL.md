---
description: Next.js frontend development rules
globs: ["src/frontend/**/*.{ts,tsx}"]
alwaysApply: true
---

# Frontend Development Rules

## Framework: Next.js 15 (App Router)
- Use server components by default
- Add "use client" only when needed (hooks, state, events)
- Use [locale] routing for i18n

## State Management
- Server state: React Query 5 (TanStack Query)
- Client state: Zustand 5
- Form state: React Hook Form 7 + Zod 3

## Component Pattern
```tsx
"use client";

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface ComponentProps {
  className?: string;
}

export function Component({ className }: ComponentProps) {
  const t = useTranslations('namespace');
  
  return (
    <div className={cn("base-styles", className)}>
      <h1>{t('title')}</h1>
    </div>
  );
}
```
i18n Rules
ALWAYS use useTranslations() hook
NEVER hardcode text (Arabic or English)
Translation keys: dot.separated.lowercase
Add BOTH ar and en translations for every new string

RTL/LTR Rules
Use: ms-4, me-4, ps-4, pe-4 (logical)
Use: text-start, text-end (logical)
NEVER: ml-4, mr-4, pl-4, pr-4 (physical)
NEVER: text-left, text-right (physical)
Flip directional icons: className="rtl:rotate-180"

Styling
Tailwind CSS utility classes only
cn() for conditional classes
shadcn/ui as component base
NEVER inline styles
NEVER component-specific CSS files

