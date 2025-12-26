/**
 * Client-Side Token Refresh Utility
 *
 * Provides automatic token refresh functionality for API calls
 * Handles 401 errors by refreshing access token and retrying requests
 *
 * Usage:
 * ```typescript
 * import { fetchWithAuth } from '@/lib/fetchWithAuth';
 *
 * const data = await fetchWithAuth('/api/users');
 * ```
 *
 * Features:
 * - Automatic token refresh on 401 errors
 * - Request retry after token refresh
 * - Works with both Authorization header and cookies
 * - Prevents multiple simultaneous refresh requests
 */

// Track ongoing refresh to prevent multiple simultaneous refreshes
let refreshPromise: Promise<boolean> | null = null;

/**
 * Refresh access token using refresh token
 * @returns Promise<boolean> - true if refresh successful, false otherwise
 */
async function refreshAccessToken(): Promise<boolean> {
  // If refresh is already in progress, wait for it
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include", // Include cookies (refresh token)
      });

      if (response.ok) {
        const data = await response.json();
        // Access token refreshed successfully

        // Store new access token if provided in response
        if (data.accessToken) {
          // Can be stored in memory or used from cookie
          return true;
        }
        return true;
      } else {
        // Token refresh failed
        return false;
      }
    } catch {
      // Token refresh error
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Fetch with automatic token refresh on expiry
 *
 * Flow:
 * 1. Make API request with access token
 * 2. If 401 and TOKEN_EXPIRED, refresh access token
 * 3. Retry original request with new token
 * 4. If still fails, redirect to login
 *
 * @param url - API endpoint URL
 * @param options - Fetch options
 * @returns Promise<Response>
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Ensure credentials are included to send cookies
  const fetchOptions: RequestInit = {
    ...options,
    credentials: "include",
  };

  // First attempt
  let response = await fetch(url, fetchOptions);

  // If 401 Unauthorized, try refreshing token
  if (response.status === 401) {
    const errorData = await response.json();

    // Check if error is due to token expiry
    if (
      errorData.errorCode === "TOKEN_EXPIRED" ||
      errorData.message?.includes("expired")
    ) {
      // Access token expired, attempting refresh

      // Attempt to refresh token
      const refreshed = await refreshAccessToken();

      if (refreshed) {
        // Retry original request with new token
        response = await fetch(url, fetchOptions);
      } else {
        // Refresh failed, redirect to login
        window.location.href = "/routing-demo/login";
      }
    }
  }

  return response;
}

/**
 * Fetch JSON with automatic token refresh
 * Convenience wrapper that parses JSON response
 *
 * @param url - API endpoint URL
 * @param options - Fetch options
 * @returns Promise<T> - Parsed JSON response
 */
export async function fetchJSONWithAuth<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetchWithAuth(url, options);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}

/**
 * Check if user is authenticated
 * Calls /api/auth/me to verify current session
 *
 * @returns Promise<boolean>
 */
export async function checkAuth(): Promise<boolean> {
  try {
    const response = await fetchWithAuth("/api/auth/me");
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Manual token refresh trigger
 * Useful for refreshing token before it expires
 *
 * @returns Promise<boolean>
 */
export async function manualRefresh(): Promise<boolean> {
  return refreshAccessToken();
}

/**
 * Logout and clear tokens
 * Calls logout API and redirects to login
 */
export async function logout(): Promise<void> {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // Logout error occurred
  } finally {
    window.location.href = "/routing-demo/login";
  }
}
