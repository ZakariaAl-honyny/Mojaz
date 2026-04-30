import { NextRequest, NextResponse } from 'next/server';

/**
 * 🚀 GRADUATION DEMO MODE - ALLOW ALL ACCESS
 * No authentication required for demo
 */

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // ✅ Allow all paths for demo mode - no auth required
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};