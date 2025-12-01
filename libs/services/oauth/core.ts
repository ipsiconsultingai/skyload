import { OAuthError } from "./errors";
import { providerConfigCreators } from "./providers";
import {
  GoogleUserInfoSchema,
  KakaoUserInfoSchema,
  OAuthTokenResponseSchema,
  type AuthorizationUrlOptions,
  type OAuthClient,
  type OAuthProvider,
  type OAuthProviderConfig,
  type OAuthTokenResponse,
  type OAuthUserInfo,
  type TokenExchangeOptions,
} from "./types";

const buildAuthorizationUrl = (
  config: OAuthProviderConfig,
  options: AuthorizationUrlOptions
): string => {
  const url = new URL(config.authorizationUrl);

  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", options.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", config.scopes.join(config.scopeDelimiter));

  if (options.state) {
    url.searchParams.set("state", options.state);
  }

  if (options.additionalParams) {
    for (const [key, value] of Object.entries(options.additionalParams)) {
      url.searchParams.set(key, value);
    }
  }

  return url.toString();
};

const exchangeCode = async (
  config: OAuthProviderConfig,
  provider: OAuthProvider,
  options: TokenExchangeOptions
): Promise<OAuthTokenResponse> => {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: options.redirectUri,
    code: options.code,
  });

  let response: Response;
  try {
    response = await fetch(config.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
  } catch (error) {
    throw new OAuthError("토큰 교환 중 네트워크 오류가 발생했습니다.", {
      code: "NETWORK_ERROR",
      provider,
      requestUrl: config.tokenUrl,
      originalError: error,
    });
  }

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new OAuthError(`토큰 교환에 실패했습니다: ${response.statusText}`, {
      code: "TOKEN_EXCHANGE_FAILED",
      provider,
      httpStatus: response.status,
      httpStatusText: response.statusText,
      requestUrl: config.tokenUrl,
      originalError: errorBody,
    });
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch (error) {
    throw new OAuthError("토큰 응답을 JSON으로 파싱하는데 실패했습니다.", {
      code: "INVALID_RESPONSE",
      provider,
      requestUrl: config.tokenUrl,
      originalError: error,
    });
  }

  const parsed = OAuthTokenResponseSchema.safeParse(data);

  if (!parsed.success) {
    throw new OAuthError("토큰 응답 형식이 올바르지 않습니다.", {
      code: "INVALID_RESPONSE",
      provider,
      requestUrl: config.tokenUrl,
      originalError: parsed.error,
    });
  }

  return parsed.data;
};

const normalizeGoogleUserInfo = (data: unknown): OAuthUserInfo => {
  const parsed = GoogleUserInfoSchema.safeParse(data);

  if (!parsed.success) {
    throw new OAuthError("Google 사용자 정보 형식이 올바르지 않습니다.", {
      code: "INVALID_RESPONSE",
      provider: "google",
      originalError: parsed.error,
    });
  }

  const { id, email, name, picture } = parsed.data;

  return {
    id,
    email: email ?? null,
    name: name ?? null,
    profileImage: picture ?? null,
  };
};

const normalizeKakaoUserInfo = (data: unknown): OAuthUserInfo => {
  const parsed = KakaoUserInfoSchema.safeParse(data);

  if (!parsed.success) {
    throw new OAuthError("Kakao 사용자 정보 형식이 올바르지 않습니다.", {
      code: "INVALID_RESPONSE",
      provider: "kakao",
      originalError: parsed.error,
    });
  }

  const { id, kakao_account } = parsed.data;

  return {
    id: String(id),
    email: kakao_account?.email ?? null,
    name: kakao_account?.profile?.nickname ?? null,
    profileImage: kakao_account?.profile?.profile_image_url ?? null,
  };
};

const userInfoNormalizers: Record<
  OAuthProvider,
  (data: unknown) => OAuthUserInfo
> = {
  google: normalizeGoogleUserInfo,
  kakao: normalizeKakaoUserInfo,
};

const fetchUserInfo = async (
  config: OAuthProviderConfig,
  provider: OAuthProvider,
  accessToken: string
): Promise<OAuthUserInfo> => {
  let response: Response;
  try {
    response = await fetch(config.userInfoUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (error) {
    throw new OAuthError("사용자 정보 조회 중 네트워크 오류가 발생했습니다.", {
      code: "NETWORK_ERROR",
      provider,
      requestUrl: config.userInfoUrl,
      originalError: error,
    });
  }

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new OAuthError(
      `사용자 정보 조회에 실패했습니다: ${response.statusText}`,
      {
        code: "USER_INFO_FAILED",
        provider,
        httpStatus: response.status,
        httpStatusText: response.statusText,
        requestUrl: config.userInfoUrl,
        originalError: errorBody,
      }
    );
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch (error) {
    throw new OAuthError(
      "사용자 정보 응답을 JSON으로 파싱하는데 실패했습니다.",
      {
        code: "INVALID_RESPONSE",
        provider,
        requestUrl: config.userInfoUrl,
        originalError: error,
      }
    );
  }

  return userInfoNormalizers[provider](data);
};

export const createOAuthClient = (
  provider: OAuthProvider,
  credentials: { clientId: string; clientSecret: string }
): OAuthClient => {
  const { clientId, clientSecret } = credentials;

  if (!clientId || !clientSecret) {
    throw new OAuthError("OAuth 클라이언트 설정이 올바르지 않습니다.", {
      code: "INVALID_CONFIGURATION",
      provider,
    });
  }

  const config = providerConfigCreators[provider](clientId, clientSecret);

  return {
    getAuthorizationUrl: (options) => buildAuthorizationUrl(config, options),
    exchangeCodeForToken: (options) => exchangeCode(config, provider, options),
    getUserInfo: (accessToken) => fetchUserInfo(config, provider, accessToken),
  };
};
