/** Mojaz API Test Global Setup */
const { getTokens } = require('./shared/helpers');
const BASE_UL = process.env.ROOT_URL || 'http://localhost:5013';
const ROLES = ['applicant', 'admin', 'manager', 'receptionist', 'doctor', 'examiner', 'security'];
module.exports = async function() {
  console.log('[Mojaz] Global setup starting...');
  // 1. Health check
  const health = await fetch(`${BASE_UL}/api/v1/health`);
  if (!health.ok) throw new Error(`[Mojaz] API not healthy at ${BASE_UL} (${health.status}). Run: dotnet run --project src/backend/Mojaz.API`);
  console.log('[Mojaz] API is reachable');
  // 2. Try seed test data
  const admin = await getTokens('admin');
  if (admin) {
    try { await fetch(`${BASE_UL}/api/v1/testing/seed`, { method: 'POST', headers: { Authorization: `Bearer ${admin.accessToken}` } }); } catch (e) { /* non-fatal */ }
  }
  // 3. Warm auth cache for all roles
  let warm = 0;
  for (const role of ROLES) if (await getTokens(role)) warm++;
  console.log(`[Mojaz] ${warm}/${ROLES.length} accounts warmed`);
  console.log('[Mojaz] Global setup done.');
};