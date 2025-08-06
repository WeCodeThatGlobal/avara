import { getBaseURL } from "@lib/util/env";

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

export interface FetchApiOptions extends RequestInit {
  headers?: Record<string, string>;
  requireAuth?: boolean;
}

/**
 * Get the stored auth token
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

/**
 * The base API fetch function.
 * It constructs the full URL, adds the publishable key, and makes the fetch request.
 * This function is intended for internal use by the specific method helpers (postApi, putApi, etc.).
 */
async function fetchApi(
  path: string,
  options: FetchApiOptions = {}
) {
  const baseUrl = getBaseURL().replace(/\/$/, "");
  
  const url = path.startsWith("http") ? path : `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;

  const headers: Record<string, string> = {
    ...options.headers,
  };

  if (PUBLISHABLE_KEY) {
    headers["x-publishable-api-key"] = PUBLISHABLE_KEY;
  }

  // Add auth token if required
  if (options.requireAuth) {
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Performs a POST request.
 * @param path - The API endpoint path.
 * @param body - The request payload. Will be JSON stringified.
 * @param options - Optional fetch options to override defaults.
 */
export async function postApi(
  path: string,
  body: any,
  options: FetchApiOptions = {}
) {
  return fetchApi(path, {
    ...options,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: JSON.stringify(body),
  });
}

/**
 * Performs a PUT request.
 * @param path - The API endpoint path.
 * @param body - The request payload. Will be JSON stringified.
 * @param options - Optional fetch options to override defaults.
 */
export async function putApi(
  path: string,
  body: any,
  options: FetchApiOptions = {}
) {
  return fetchApi(path, {
    ...options,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: JSON.stringify(body),
  });
}

/**
 * Performs a PATCH request.
 * @param path - The API endpoint path.
 * @param body - The request payload. Will be JSON stringified.
 * @param options - Optional fetch options to override defaults.
 */
export async function patchApi(
  path: string,
  body: any,
  options: FetchApiOptions = {}
) {
  return fetchApi(path, {
    ...options,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: JSON.stringify(body),
  });
}

/**
 * Performs a DELETE request.
 * @param path - The API endpoint path.
 * @param options - Optional fetch options to override defaults.
 */
export async function deleteApi(
  path: string,
  options: FetchApiOptions = {}
) {
  return fetchApi(path, {
    ...options,
    method: "DELETE",
  });
}

/**
 * Performs a GET request.
 * This is essentially a wrapper around the base fetchApi for consistency.
 * @param path - The API endpoint path.
 * @param options - Optional fetch options to override defaults.
 */
export async function getApi(
    path: string,
    options: FetchApiOptions = {}
) {
    return fetchApi(path, {
        ...options,
        method: "GET",
    });
}

/**
 * Performs an authenticated POST request.
 * Automatically includes the JWT token in the Authorization header.
 * @param path - The API endpoint path.
 * @param body - The request payload. Will be JSON stringified.
 * @param options - Optional fetch options to override defaults.
 */
export async function postApiAuth(
  path: string,
  body: any,
  options: FetchApiOptions = {}
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (PUBLISHABLE_KEY) {
    headers["x-publishable-api-key"] = PUBLISHABLE_KEY;
  }

  return postApi(path, body, { 
    ...options, 
    requireAuth: true,
    headers
  });
}

/**
 * Performs an authenticated PUT request.
 * Automatically includes the JWT token in the Authorization header.
 * @param path - The API endpoint path.
 * @param body - The request payload. Will be JSON stringified.
 * @param options - Optional fetch options to override defaults.
 */
export async function putApiAuth(
  path: string,
  body: any,
  options: FetchApiOptions = {}
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (PUBLISHABLE_KEY) {
    headers["x-publishable-api-key"] = PUBLISHABLE_KEY;
  }

  return putApi(path, body, { 
    ...options, 
    requireAuth: true,
    headers
  });
}

/**
 * Performs an authenticated GET request.
 * Automatically includes the JWT token in the Authorization header.
 * @param path - The API endpoint path.
 * @param options - Optional fetch options to override defaults.
 */
export async function getApiAuth(
  path: string,
  options: FetchApiOptions = {}
) {
  const headers: Record<string, string> = {
    ...options.headers,
  };

  if (PUBLISHABLE_KEY) {
    headers["x-publishable-api-key"] = PUBLISHABLE_KEY;
  }

  return getApi(path, { 
    ...options, 
    requireAuth: true,
    headers
  });
}

/**
 * Performs an authenticated DELETE request.
 * Automatically includes the JWT token in the Authorization header.
 * @param path - The API endpoint path.
 * @param options - Optional fetch options to override defaults.
 */
export async function deleteApiAuth(
  path: string,
  options: FetchApiOptions = {}
) {
  const headers: Record<string, string> = {
    ...options.headers,
  };

  if (PUBLISHABLE_KEY) {
    headers["x-publishable-api-key"] = PUBLISHABLE_KEY;
  }

  return deleteApi(path, { 
    ...options, 
    requireAuth: true,
    headers
  });
}
