'use client';

/**
 * Landing Header — Storybook-compatible named export.
 * Delegates to the canonical PublicHeader component so there is a
 * single source of truth for the institutional header design.
 */
import PublicHeader from '@/components/layout/PublicHeader';

export function Header() {
  return <PublicHeader />;
}
