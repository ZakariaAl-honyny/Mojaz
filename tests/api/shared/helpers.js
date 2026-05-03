/** Mojaz API Test Shared Helpers (CommonJS) */
const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5013';
const path = require('path');

// Load cached tokens for fast access (avoid login API calls)
let cachedTokens = null;
try {
  const tokensPath = path.join(__dirname, 'tokens.json');
  const tokensFile = require(tokensPath);
  // Check if tokens are still valid (less than 50 minutes old)
  const tokenAge = Date.now() - new Date(tokensFile.generatedAt).getTime();
  const MAX_TOKEN_AGE = 50 * 60 * 1000; // 50 minutes
  if (tokenAge < MAX_TOKEN_AGE && tokensFile.tokens) {
    cachedTokens = tokensFile.tokens;
    console.log('[helpers] Using cached tokens from tokens.json');
  }
} catch (e) {
  // Tokens file not found or expired, will use login
  console.log('[helpers] No cached tokens, will use login');
}

const TEST_ACCOUNTS = {
  applicant:    { email: 'applicant@mojaz.gov.sa',    phone: '0500000001', password: 'Password123!', role: 'Applicant',    userId: 1 },
  admin:      { email: 'admin@mojaz.gov.sa',      phone: '0500000006', password: 'Password123!', role: 'Admin',      userId: 6 },
  manager:    { email: 'manager@mojaz.gov.sa',     phone: '0500000005', password: 'Password123!', role: 'Manager',    userId: 5 },
  receptionist: { email: 'receptionist@mojaz.gov.sa', phone: '0500000002', password: 'Password123!', role: 'Receptionist', userId: 2 },
  doctor:     { email: 'doctor@mojaz.gov.sa',       phone: '0500000003', password: 'Password123!', role: 'Doctor',     userId: 3 },
  examiner:   { email: 'examiner@mojaz.gov.sa',     phone: '0500000004', password: 'Password123!', role: 'Examiner',   userId: 4 },
  security:   { email: 'security@mojaz.gov.sa',     phone: '0500000007', password: 'Password123!', role: 'Security',   userId: 9 },
};

/** Get cached token or login - returns { accessToken, refreshToken } or null */
async function getTokens(role) {
  // Use cached token if available
  if (cachedTokens && cachedTokens[role]) {
    return { accessToken: cachedTokens[role], refreshToken: null };
  }
  
  // Fallback to login API
  const acct = TEST_ACCOUNTS[role]; if (!acct) return null;
  const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: acct.email, password: acct.password }),
  });
  if (!res.ok) { console.warn(`[helpers] login failed for ${role}: ${res.status}`); return null; }
  const json = await res.json();
  return json.success && json.data ? json.data : null;
}
/** Bearer header for Playwright requests. */
async function bearer(role) {
  const tok = await getTokens(role || 'admin');
  return tok && tok.accessToken ? { Authorization: `Bearer ${tok.accessToken}` } : {};
}
/** Assert valid ApiResponse wrapper. */
function assertApiResponse(label, body) {
  if (!body || typeof body !== 'object') throw new Error(`${label}: expected object, got ${typeof body}`);
  if (typeof body.success !== 'boolean') throw new Error(`${label}: missing .success`);
  if (typeof body.statusCode !== 'number') throw new Error(`${label}: missing .statusCode`);
}
/** Build query string from object, e.g. { page: 1 } -> "?page=1" */
function buildQuery(params) {
  if (!params) return '';
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  ).toString();
  return qs ? `?${qs}` : '';
}
/** Safely parse JSON response. Returns ApiResponse with errors on parse failure. */
async function parseResponse(res) {
  try { return await res.json(); } catch { return { success: false, message: 'Parse error', data: null, statusCode: res.status }; }
}
// Pre-cached tokens for TypeScript test files - export as module for require
let cachedTokensModule = null;
try {
  const tokensPath = path.join(__dirname, 'tokens.json');
  const tokensFile = require(tokensPath);
  const tokenAge = Date.now() - new Date(tokensFile.generatedAt).getTime();
  const MAX_TOKEN_AGE = 50 * 60 * 1000;
  if (tokenAge < MAX_TOKEN_AGE && tokensFile.tokens) {
    cachedTokensModule = tokensFile.tokens;
  }
} catch (e) {}

/** Get cached token for TypeScript test files - returns token directly */
function getCachedToken(role) {
  if (cachedTokensModule && cachedTokensModule[role]) {
    return cachedTokensModule[role];
  }
  return null;
}

module.exports = { 
  BASE_URL, 
  TEST_ACCOUNTS, 
  getTokens, 
  bearer, 
  assertApiResponse, 
  buildQuery, 
  parseResponse,
  getCachedToken,
  cachedTokens: cachedTokensModule
};