import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export function middleware(request: import('next/server').NextRequest) {
  return intlMiddleware(request);
}

// Robust matcher that strictly ignores all static assets, images, and API routes
export const config = {
  matcher: [
    // Match all pathnames except for
    // - /api (API routes)
    // - /_next/static (static files)
    // - /_next/image (image optimization)
    // - /images (public images)
    // - /favicon.ico and other static files with extensions
    '/((?!api|_next/static|_next/image|images|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};