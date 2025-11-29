import { FetchError, type GetOptions, type MutationOptions } from "./types";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

const getBaseUrl = (): string => process.env.NEXT_PUBLIC_API_URL ?? "";

const buildUrl = (
  path: string,
  query?: Record<string, string | number | boolean | undefined>
): string => {
  const baseUrl = getBaseUrl();
  const url = new URL(path, baseUrl || "http://localhost");

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return baseUrl ? url.toString() : url.pathname + url.search;
};

const parseErrorMessage = async (response: Response): Promise<string> => {
  try {
    const data = await response.json();
    return data.message || data.error || JSON.stringify(data);
  } catch {
    return response.statusText;
  }
};

const handleResponse = async <T>(
  response: Response,
  method: HttpMethod,
  url: string
): Promise<T> => {
  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new FetchError({
      method,
      url,
      status: response.status,
      statusText: response.statusText,
      message: `[${method}] ${url} failed (${response.status}): ${message}`,
    });
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
};

const createFetcher =
  (method: HttpMethod) =>
  async <T>(path: string, options: MutationOptions = {}): Promise<T> => {
    const { body, query, headers, cache, next } = options;
    const url = buildUrl(path, query);

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      cache,
      next,
    });

    return handleResponse<T>(response, method, url);
  };

export const getFetch = async <T>(
  path: string,
  options: GetOptions = {}
): Promise<T> => {
  const { query, headers, cache, next } = options;
  const url = buildUrl(path, query);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    cache,
    next,
  });

  return handleResponse<T>(response, "GET", url);
};

export const postFetch = createFetcher("POST");
export const putFetch = createFetcher("PUT");
export const deleteFetch = createFetcher("DELETE");
