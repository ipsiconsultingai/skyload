export interface FetchOptions {
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

export interface GetOptions extends FetchOptions {
  query?: Record<string, string | number | boolean | undefined>;
}

export interface MutationOptions extends FetchOptions {
  body?: Record<string, unknown>;
  query?: Record<string, string | number | boolean | undefined>;
}

export interface ApiError {
  method: string;
  url: string;
  status: number;
  statusText: string;
  message: string;
}

export class FetchError extends Error {
  public readonly method: string;
  public readonly url: string;
  public readonly status: number;
  public readonly statusText: string;

  constructor({ method, url, status, statusText, message }: ApiError) {
    super(message);
    this.name = "FetchError";
    this.method = method;
    this.url = url;
    this.status = status;
    this.statusText = statusText;
  }

  toJSON(): ApiError {
    return {
      method: this.method,
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      message: this.message,
    };
  }
}
