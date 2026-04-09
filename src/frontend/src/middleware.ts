import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Handle locale with next-intl middleware
  const response = intlMiddleware(request);
  
  // 2. Custom redirects
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/ar', request.url));
  }

  // 3. Simple Role-Based Access Simulation (Mock)
  // ... rest of logic if needed, but for now just Return response from intlMiddleware
  
  return response;
}

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /_static (inside /public)
  // - /favicon.ico, /sitemap.xml, /robots.txt (static files)
  matcher: ['/((?!api|_next|_static|favicon.ico|sitemap.xml|robots.txt).*)']
};
