import { NextRequest, NextResponse } from 'next/server';

// UserRole enum - matching backend exactly
enum UserRole {
  Applicant = 0,
  Receptionist = 1,
  Doctor = 2,
  Examiner = 3,
  Manager = 4,
  Security = 5,
  Admin = 6
}

// Role constants matching backend
const ALLOWED_ROLES = {
  // Admin routes - only Admin and Manager can access
  admin: [UserRole.Admin, UserRole.Manager],
  
  // Employee routes - Receptionist, Doctor, Examiner, Manager, Security, Admin can access
  employee: [UserRole.Receptionist, UserRole.Doctor, UserRole.Examiner, UserRole.Manager, UserRole.Security, UserRole.Admin],
  
  // Applicant routes - only Applicant can access
  applicant: [UserRole.Applicant]
} as const;

// JWT payload interface
interface JWTPayload {
  role?: string | number;
  sub?: string;
  [key: string]: unknown;
}

/**
 * Decode JWT token without verification (for middleware access control)
 * Uses atob for Edge runtime compatibility
 */
function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Decode the payload (middle part) - base64url to base64 conversion
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    
    // Add padding if needed
    const padding = base64.length % 4;
    if (padding) {
      base64 += '='.repeat(4 - padding);
    }
    
    // Use atob for browser/edge runtime
    const decoded = atob(base64);
    const payload = JSON.parse(decoded) as JWTPayload;
    
    return payload;
  } catch {
    return null;
  }
}

/**
 * Extract role from JWT payload
 */
function extractRole(payload: JWTPayload | null): UserRole | null {
  if (!payload) return null;
  
  const roleValue = payload.role;
  if (roleValue === undefined || roleValue === null) return null;
  
  // Role can be string or number
  if (typeof roleValue === 'number') {
    return roleValue as UserRole;
  }
  
  if (typeof roleValue === 'string') {
    // Try parse as number
    const parsed = parseInt(roleValue, 10);
    if (!isNaN(parsed)) {
      return parsed as UserRole;
    }
    
    // Try string match
    const roleMap: Record<string, UserRole> = {
      'Applicant': UserRole.Applicant,
      'Receptionist': UserRole.Receptionist,
      'Doctor': UserRole.Doctor,
      'Examiner': UserRole.Examiner,
      'Manager': UserRole.Manager,
      'Security': UserRole.Security,
      'Admin': UserRole.Admin
    };
    
    return roleMap[roleValue] ?? null;
  }
  
  return null;
}

/**
 * Check if user has required role
 */
function hasRequiredRole(userRole: UserRole | null, allowedRoles: readonly number[]): boolean {
  if (userRole === null) return false;
  return allowedRoles.includes(userRole);
}

/**
 * Get locale from pathname
 */
function getLocale(pathname: string): string {
  // Check for /ar or /en prefix
  const match = pathname.match(/^\/(ar|en)/i);
  if (match) {
    return match[1].toLowerCase();
  }
  return 'ar'; // Default to Arabic
}

/**
 * Check if route matches pattern
 */
function matchesRoute(pathname: string, pattern: string): boolean {
  // Handle exact match
  if (pathname === pattern || pathname === `${pattern}/`) {
    return true;
  }
  
  // Handle wildcard match
  if (pattern.endsWith('/*')) {
    const prefix = pattern.slice(0, -2);
    return pathname.startsWith(prefix);
  }
  
  return false;
}

/**
 * Determine which route group the pathname belongs to
 */
function getRouteGroup(pathname: string): 'admin' | 'employee' | 'applicant' | 'public' {
  // Remove locale prefix if present
  const cleanPathname = pathname.replace(/^\/(ar|en)/i, '');
  
  // Check admin routes
  if (matchesRoute(cleanPathname, '/admin')) {
    return 'admin';
  }
  
  // Check employee routes
  if (matchesRoute(cleanPathname, '/employee')) {
    return 'employee';
  }
  
  // Check applicant routes
  if (matchesRoute(cleanPathname, '/applicant')) {
    return 'applicant';
  }
  
  // These are employee routes too
  const protectedRoutes = [
    '/dashboard',
    '/applications',
    '/appointments',
    '/payments',
    '/licenses',
    '/notifications',
    '/profile',
    '/settings',
    '/training',
    '/my-results',
    '/progress'
  ];
  
  for (const route of protectedRoutes) {
    if (matchesRoute(cleanPathname, route)) {
      return 'employee';
    }
  }
  
  return 'public';
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // Static files like favicon.ico
  ) {
    return NextResponse.next();
  }
  
  // Get locale
  const locale = getLocale(pathname);
  const localePrefix = `/${locale}`;
  
  // Define paths that don't require authentication
  const publicPaths = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-otp',
    '/register/verify',
    '/forbidden'
  ];
  
  // Check if the current path is a public path
  const isPublicPath = publicPaths.some(path => 
    pathname === `${localePrefix}/${path}` || 
    pathname.startsWith(`${localePrefix}/${path}/`)
  );
  
  // Allow access to forbidden page
  if (pathname.includes('/forbidden')) {
    return NextResponse.next();
  }
  
  // Get JWT token from cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  
  // If no token, redirect to login
  if (!accessToken) {
    if (!isPublicPath) {
      return NextResponse.redirect(new URL(`${localePrefix}/login`, request.url));
    }
    return NextResponse.next();
  }
  
  // Decode JWT and extract role
  const payload = decodeJWT(accessToken);
  const userRole = extractRole(payload);
  
  // If we can't extract role, treat as unauthenticated
  if (userRole === null) {
    const response = NextResponse.redirect(new URL(`${localePrefix}/login`, request.url));
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    return response;
  }
  
  // Determine which route group this request is trying to access
  const routeGroup = getRouteGroup(pathname);
  
  // Check role-based access
  let hasAccess = false;
  
  if (routeGroup === 'admin') {
    // Admin routes - require Admin or Manager
    hasAccess = hasRequiredRole(userRole, ALLOWED_ROLES.admin);
  } else if (routeGroup === 'employee') {
    // Employee routes - require any employee role
    hasAccess = hasRequiredRole(userRole, ALLOWED_ROLES.employee);
  } else if (routeGroup === 'applicant') {
    // Applicant routes - require Applicant role
    hasAccess = hasRequiredRole(userRole, ALLOWED_ROLES.applicant);
  } else if (routeGroup === 'public') {
    // Allow public paths for any authenticated user
    hasAccess = isPublicPath;
  }
  
  // If access is denied, redirect to forbidden page
  if (!hasAccess) {
    return NextResponse.redirect(new URL(`${localePrefix}/forbidden`, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)'
  ]
};