import type { OAuthProvider } from "./types";

export type OAuthErrorCode =
  | "INVALID_CONFIGURATION"
  | "TOKEN_EXCHANGE_FAILED"
  | "USER_INFO_FAILED"
  | "INVALID_RESPONSE"
  | "NETWORK_ERROR";

export interface OAuthErrorDetails {
  code: OAuthErrorCode;
  provider: OAuthProvider;
  httpStatus?: number;
  httpStatusText?: string;
  requestUrl?: string;
  originalError?: unknown;
}

export class OAuthError extends Error {
  public readonly code: OAuthErrorCode;
  public readonly provider: OAuthProvider;
  public readonly httpStatus?: number;
  public readonly httpStatusText?: string;
  public readonly requestUrl?: string;
  public readonly originalError?: unknown;

  constructor(message: string, details: OAuthErrorDetails) {
    super(message);
    this.name = "OAuthError";
    this.code = details.code;
    this.provider = details.provider;
    this.httpStatus = details.httpStatus;
    this.httpStatusText = details.httpStatusText;
    this.requestUrl = details.requestUrl;
    this.originalError = details.originalError;
  }

  toJSON(): Omit<OAuthErrorDetails, "originalError"> & { message: string } {
    return {
      message: this.message,
      code: this.code,
      provider: this.provider,
      httpStatus: this.httpStatus,
      httpStatusText: this.httpStatusText,
      requestUrl: this.requestUrl,
    };
  }
}
