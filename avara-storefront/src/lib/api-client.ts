import { getBaseURL } from "@lib/util/env";

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

export interface FetchApiOptions extends RequestInit {
  headers?: Record<string, string>;
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
