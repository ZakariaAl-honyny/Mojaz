import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Get the locale from the pathname
  const locale = pathname.split('/')[1];
  const isArabic = locale === 'ar';
  
  // 2. Mock token check (In production, use next-auth or cookie check)
  // We check for a session cookie or auth-storage (though storage is client-side)
  // Here we'll just handle basic locale routing if needed or pass through
  
  // Redirect / to /ar or /en
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/ar', request.url));
  }

  // 3. Simple Role-Based Access Simulation (Mock)
  // If user tries to access /employee and isn't authorized, redirect to login
  const isEmployeeRoute = pathname.includes('/(employee)') || pathname.includes('/medical-results');
  const isApplicantRoute = pathname.includes('/(applicant)') || pathname.includes('/dashboard');

  // Logic: In Next.js App Router with next-intl, 
  // protection is often handled in the Layout or via a specialized middleware.
  
  return NextResponse.next();
}

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /_static (inside /public)
  // - /favicon.ico, /sitemap.xml, /robots.txt (static files)
  matcher: ['/((?!api|_next|_static|favicon.ico|sitemap.xml|robots.txt).*)']
};
