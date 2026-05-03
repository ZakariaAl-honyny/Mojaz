/**
 * Shared TypeScript helpers for Playwright API tests
 * Use this instead of inline getTokens functions in test files
 */

// Load cached tokens - synchronous, no API calls
let cachedTokens: Record<string, string> | null = null;

function loadCachedTokens(): Record<string, string> | null {
  if (cachedTokens) return cachedTokens;
  
  try {
    // Try to load from tokens.json using dynamic require
    const tokensFile = require('./tokens.json');
    const tokenAge = Date.now() - new Date(tokensFile.generatedAt).getTime();
    const MAX_TOKEN_AGE = 50 * 60 * 1000; // 50 minutes
    
    if (tokenAge < MAX_TOKEN_AGE && tokensFile.tokens) {
      cachedTokens = tokensFile.tokens;
      console.log('[helpers.ts] Using cached tokens from tokens.json');
      return cachedTokens;
    } else {
      console.log('[helpers.ts] Tokens expired or not found');
    }
  } catch (e) {
    // Tokens file not found
    console.log('[helpers.ts] No cached tokens file found');
  }
  return null;
}

/**
 * Get cached token directly - returns the token string or null
 * Use this for fast tests without API calls
 */
export function getCachedToken(role: keyof typeof TEST_ACCOUNTS): string | null {
  const tokens = loadCachedTokens();
  return tokens ? tokens[role] : null;
}

// Test accounts configuration
export const TEST_ACCOUNTS: Record<string, { email: string; password: string }> = {
  applicant: { email: 'applicant@mojaz.gov.sa', password: 'Password123!' },
  admin: { email: 'admin@mojaz.gov.sa', password: 'Password123!' },
  manager: { email: 'manager@mojaz.gov.sa', password: 'Password123!' },
  receptionist: { email: 'receptionist@mojaz.gov.sa', password: 'Password123!' },
  doctor: { email: 'doctor@mojaz.gov.sa', password: 'Password123!' },
  examiner: { email: 'examiner@mojaz.gov.sa', password: 'Password123!' },
  security: { email: 'security@mojaz.gov.sa', password: 'Password123!' },
};

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5013';

/**
 * Get authentication tokens - uses cached tokens if available, otherwise logs in
 */
export async function getTokens(apiRequest: any, role: keyof typeof TEST_ACCOUNTS) {
  // Try cached token first
  const cached = loadCachedTokens();
  if (cached && cached[role]) {
    return { accessToken: cached[role], refreshToken: null };
  }
  
  // Fallback to login API
  const account = TEST_ACCOUNTS[role];
  if (!account) return null;
  
  try {
    const response = await apiRequest.post(`${BASE_URL}/api/v1/auth/login`, {
      data: {
        identifier: account.email,
        password: account.password,
      },
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok()) {
      console.warn(`[getTokens] Login failed for ${role}: ${response.status()}`);
      return null;
    }
    
    const json = await response.json();
    return json.success && json.data ? json.data : null;
  } catch (error) {
    console.error(`[getTokens] Error for ${role}:`, error);
    return null;
  }
}

/**
 * Get auth header from tokens
 */
export function getAuthHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

/**
 * Validate API response structure
 */
export function validateApiResponse(response: any, expectedSuccess?: boolean) {
  expect(response).toBeDefined();
  expect(typeof response.success).toBe('boolean');
  expect(typeof response.statusCode).toBe('number');
  if (expectedSuccess !== undefined) {
    expect(response.success).toBe(expectedSuccess);
  }
}