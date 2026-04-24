'use client';

/**
 * Landing Footer — Storybook-compatible named export.
 * Delegates to the canonical Footer component so there is a
 * single source of truth for the institutional footer design.
 */
import CanonicalFooter from '@/components/layout/Footer';

export function Footer() {
  return <CanonicalFooter />;
}
