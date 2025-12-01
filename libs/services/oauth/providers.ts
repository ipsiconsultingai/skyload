import type { OAuthProvider, OAuthProviderConfig } from "./types";

const createGoogleConfig = (
  clientId: string,
  clientSecret: string
): OAuthProviderConfig => ({
  clientId,
  clientSecret,
  authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenUrl: "https://oauth2.googleapis.com/token",
  userInfoUrl: "https://www.googleapis.com/oauth2/v2/userinfo",
  scopes: ["openid", "email", "profile"],
  scopeDelimiter: " ",
});

const createKakaoConfig = (
  clientId: string,
  clientSecret: string
): OAuthProviderConfig => ({
  clientId,
  clientSecret,
  authorizationUrl: "https://kauth.kakao.com/oauth/authorize",
  tokenUrl: "https://kauth.kakao.com/oauth/token",
  userInfoUrl: "https://kapi.kakao.com/v2/user/me",
  scopes: ["profile_nickname", "profile_image", "account_email"],
  scopeDelimiter: ",",
});

export const providerConfigCreators: Record<
  OAuthProvider,
  (clientId: string, clientSecret: string) => OAuthProviderConfig
> = {
  google: createGoogleConfig,
  kakao: createKakaoConfig,
};
