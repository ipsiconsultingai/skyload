import { z } from "zod/v4";

export type OAuthProvider = "google" | "kakao";

export interface OAuthProviderConfig {
  clientId: string;
  clientSecret: string;
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  scopes: string[];
  scopeDelimiter: string;
}

export interface AuthorizationUrlOptions {
  redirectUri: string;
  state?: string;
  additionalParams?: Record<string, string>;
}

export interface TokenExchangeOptions {
  code: string;
  redirectUri: string;
}

export const OAuthTokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number().optional(),
  refresh_token: z.string().optional(),
  scope: z.string().optional(),
});

export type OAuthTokenResponse = z.infer<typeof OAuthTokenResponseSchema>;

export interface OAuthUserInfo {
  id: string;
  email: string | null;
  name: string | null;
  profileImage: string | null;
}

export const GoogleUserInfoSchema = z.object({
  id: z.string(),
  email: z.string().optional(),
  verified_email: z.boolean().optional(),
  name: z.string().optional(),
  given_name: z.string().optional(),
  family_name: z.string().optional(),
  picture: z.string().optional(),
});

export type GoogleUserInfo = z.infer<typeof GoogleUserInfoSchema>;

export const KakaoUserInfoSchema = z.object({
  id: z.number(),
  kakao_account: z
    .object({
      email: z.string().optional(),
      profile: z
        .object({
          nickname: z.string().optional(),
          profile_image_url: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export type KakaoUserInfo = z.infer<typeof KakaoUserInfoSchema>;

export interface OAuthClient {
  getAuthorizationUrl(options: AuthorizationUrlOptions): string;
  exchangeCodeForToken(
    options: TokenExchangeOptions
  ): Promise<OAuthTokenResponse>;
  getUserInfo(accessToken: string): Promise<OAuthUserInfo>;
}
