/**
 * Shared admin session-token access.
 *
 * The backend authenticates privileged API routes with the session token issued
 * by POST /api/admin/login. This module is standalone (no imports) so both
 * AdminStoreService and OrderService can use it without a circular import.
 */

// Must stay in sync with KEYS.AUTH_TOKEN in adminStoreService.ts
const AUTH_TOKEN_KEY = 'sider_admin_v3_auth_token';

export function getStoredAuthToken(): string | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!raw) return null;
    // Tokens are persisted with JSON.stringify by the storage helper.
    const parsed = JSON.parse(raw);
    return typeof parsed === 'string' && parsed ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Headers for an authenticated admin API call.
 * Falls back to the bare headers when no session is stored, so the server can
 * answer with a 401 instead of the request failing client-side.
 */
export function adminHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const token = getStoredAuthToken();
  return token ? { ...extra, Authorization: `Bearer ${token}` } : { ...extra };
}

/**
 * Headers for an authenticated admin API call that sends a JSON body.
 */
export function adminJsonHeaders(): Record<string, string> {
  return adminHeaders({ 'Content-Type': 'application/json' });
}
