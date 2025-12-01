import { createOAuthClient, OAuthError } from "../";

const mockFetch = jest.fn();
global.fetch = mockFetch;

const createMockResponse = (
  data: unknown,
  options: { status?: number; statusText?: string; ok?: boolean } = {}
): Response => {
  const { status = 200, statusText = "OK", ok = true } = options;
  return {
    ok,
    status,
    statusText,
    json: jest.fn().mockResolvedValue(data),
    text: jest.fn().mockResolvedValue(JSON.stringify(data)),
  } as unknown as Response;
};

describe("OAuth Service", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe("createOAuthClient", () => {
    it("유효한 credentials로 클라이언트를 생성한다", () => {
      const client = createOAuthClient("google", {
        clientId: "test-client-id",
        clientSecret: "test-client-secret",
      });

      expect(client).toHaveProperty("getAuthorizationUrl");
      expect(client).toHaveProperty("exchangeCodeForToken");
      expect(client).toHaveProperty("getUserInfo");
    });

    it("clientId가 없으면 OAuthError를 throw한다", () => {
      expect(() =>
        createOAuthClient("google", {
          clientId: "",
          clientSecret: "test-client-secret",
        })
      ).toThrow(OAuthError);
    });

    it("clientSecret이 없으면 OAuthError를 throw한다", () => {
      expect(() =>
        createOAuthClient("google", {
          clientId: "test-client-id",
          clientSecret: "",
        })
      ).toThrow(OAuthError);
    });
  });

  describe("Google OAuth", () => {
    const googleClient = createOAuthClient("google", {
      clientId: "google-client-id",
      clientSecret: "google-client-secret",
    });

    describe("getAuthorizationUrl", () => {
      it("올바른 Google OAuth URL을 생성한다", () => {
        const url = googleClient.getAuthorizationUrl({
          redirectUri: "https://example.com/callback",
        });

        const parsed = new URL(url);

        expect(parsed.origin).toBe("https://accounts.google.com");
        expect(parsed.pathname).toBe("/o/oauth2/v2/auth");
        expect(parsed.searchParams.get("client_id")).toBe("google-client-id");
        expect(parsed.searchParams.get("redirect_uri")).toBe(
          "https://example.com/callback"
        );
        expect(parsed.searchParams.get("response_type")).toBe("code");
        expect(parsed.searchParams.get("scope")).toContain("openid");
        expect(parsed.searchParams.get("scope")).toContain("email");
        expect(parsed.searchParams.get("scope")).toContain("profile");
      });

      it("state 파라미터를 포함한다", () => {
        const url = googleClient.getAuthorizationUrl({
          redirectUri: "https://example.com/callback",
          state: "random-state-123",
        });

        const parsed = new URL(url);
        expect(parsed.searchParams.get("state")).toBe("random-state-123");
      });

      it("추가 파라미터를 포함한다", () => {
        const url = googleClient.getAuthorizationUrl({
          redirectUri: "https://example.com/callback",
          additionalParams: {
            access_type: "offline",
            prompt: "consent",
          },
        });

        const parsed = new URL(url);
        expect(parsed.searchParams.get("access_type")).toBe("offline");
        expect(parsed.searchParams.get("prompt")).toBe("consent");
      });
    });

    describe("exchangeCodeForToken", () => {
      it("authorization code를 토큰으로 교환한다", async () => {
        const mockTokenResponse = {
          access_token: "google-access-token",
          token_type: "Bearer",
          expires_in: 3600,
          refresh_token: "google-refresh-token",
          scope: "openid email profile",
        };
        mockFetch.mockResolvedValue(createMockResponse(mockTokenResponse));

        const tokens = await googleClient.exchangeCodeForToken({
          code: "auth-code-123",
          redirectUri: "https://example.com/callback",
        });

        expect(tokens.access_token).toBe("google-access-token");
        expect(tokens.token_type).toBe("Bearer");
        expect(mockFetch).toHaveBeenCalledWith(
          "https://oauth2.googleapis.com/token",
          expect.objectContaining({
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          })
        );
      });

      it("토큰 교환 실패 시 OAuthError를 throw한다", async () => {
        mockFetch.mockResolvedValue(
          createMockResponse(
            { error: "invalid_grant" },
            { status: 400, statusText: "Bad Request", ok: false }
          )
        );

        await expect(
          googleClient.exchangeCodeForToken({
            code: "invalid-code",
            redirectUri: "https://example.com/callback",
          })
        ).rejects.toMatchObject({
          code: "TOKEN_EXCHANGE_FAILED",
          provider: "google",
          httpStatus: 400,
        });
      });

      it("네트워크 에러 시 OAuthError를 throw한다", async () => {
        mockFetch.mockRejectedValue(new Error("Network error"));

        await expect(
          googleClient.exchangeCodeForToken({
            code: "auth-code",
            redirectUri: "https://example.com/callback",
          })
        ).rejects.toMatchObject({
          code: "NETWORK_ERROR",
          provider: "google",
        });
      });
    });

    describe("getUserInfo", () => {
      it("Google 사용자 정보를 정규화된 형태로 반환한다", async () => {
        const mockUserInfo = {
          id: "google-user-123",
          email: "user@gmail.com",
          verified_email: true,
          name: "Test User",
          given_name: "Test",
          family_name: "User",
          picture: "https://lh3.googleusercontent.com/photo.jpg",
        };
        mockFetch.mockResolvedValue(createMockResponse(mockUserInfo));

        const userInfo = await googleClient.getUserInfo("access-token");

        expect(userInfo).toEqual({
          id: "google-user-123",
          email: "user@gmail.com",
          name: "Test User",
          profileImage: "https://lh3.googleusercontent.com/photo.jpg",
        });
        expect(mockFetch).toHaveBeenCalledWith(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          {
            headers: {
              Authorization: "Bearer access-token",
            },
          }
        );
      });

      it("선택적 필드가 없을 때 null을 반환한다", async () => {
        const mockUserInfo = {
          id: "google-user-123",
        };
        mockFetch.mockResolvedValue(createMockResponse(mockUserInfo));

        const userInfo = await googleClient.getUserInfo("access-token");

        expect(userInfo).toEqual({
          id: "google-user-123",
          email: null,
          name: null,
          profileImage: null,
        });
      });

      it("사용자 정보 조회 실패 시 OAuthError를 throw한다", async () => {
        mockFetch.mockResolvedValue(
          createMockResponse(
            { error: "invalid_token" },
            { status: 401, statusText: "Unauthorized", ok: false }
          )
        );

        await expect(
          googleClient.getUserInfo("invalid-token")
        ).rejects.toMatchObject({
          code: "USER_INFO_FAILED",
          provider: "google",
          httpStatus: 401,
        });
      });
    });
  });

  describe("Kakao OAuth", () => {
    const kakaoClient = createOAuthClient("kakao", {
      clientId: "kakao-client-id",
      clientSecret: "kakao-client-secret",
    });

    describe("getAuthorizationUrl", () => {
      it("올바른 Kakao OAuth URL을 생성한다", () => {
        const url = kakaoClient.getAuthorizationUrl({
          redirectUri: "https://example.com/callback",
        });

        const parsed = new URL(url);

        expect(parsed.origin).toBe("https://kauth.kakao.com");
        expect(parsed.pathname).toBe("/oauth/authorize");
        expect(parsed.searchParams.get("client_id")).toBe("kakao-client-id");
        expect(parsed.searchParams.get("redirect_uri")).toBe(
          "https://example.com/callback"
        );
        expect(parsed.searchParams.get("response_type")).toBe("code");
        // Kakao uses comma-separated scopes
        expect(parsed.searchParams.get("scope")).toContain("profile_nickname");
      });
    });

    describe("exchangeCodeForToken", () => {
      it("authorization code를 토큰으로 교환한다", async () => {
        const mockTokenResponse = {
          access_token: "kakao-access-token",
          token_type: "bearer",
          expires_in: 21599,
          refresh_token: "kakao-refresh-token",
        };
        mockFetch.mockResolvedValue(createMockResponse(mockTokenResponse));

        const tokens = await kakaoClient.exchangeCodeForToken({
          code: "auth-code-123",
          redirectUri: "https://example.com/callback",
        });

        expect(tokens.access_token).toBe("kakao-access-token");
        expect(mockFetch).toHaveBeenCalledWith(
          "https://kauth.kakao.com/oauth/token",
          expect.objectContaining({
            method: "POST",
          })
        );
      });
    });

    describe("getUserInfo", () => {
      it("Kakao 사용자 정보를 정규화된 형태로 반환한다", async () => {
        const mockUserInfo = {
          id: 12345678,
          kakao_account: {
            email: "user@kakao.com",
            profile: {
              nickname: "카카오유저",
              profile_image_url: "https://k.kakaocdn.net/photo.jpg",
            },
          },
        };
        mockFetch.mockResolvedValue(createMockResponse(mockUserInfo));

        const userInfo = await kakaoClient.getUserInfo("access-token");

        expect(userInfo).toEqual({
          id: "12345678",
          email: "user@kakao.com",
          name: "카카오유저",
          profileImage: "https://k.kakaocdn.net/photo.jpg",
        });
        expect(mockFetch).toHaveBeenCalledWith(
          "https://kapi.kakao.com/v2/user/me",
          {
            headers: {
              Authorization: "Bearer access-token",
            },
          }
        );
      });

      it("kakao_account가 없을 때 null을 반환한다", async () => {
        const mockUserInfo = {
          id: 12345678,
        };
        mockFetch.mockResolvedValue(createMockResponse(mockUserInfo));

        const userInfo = await kakaoClient.getUserInfo("access-token");

        expect(userInfo).toEqual({
          id: "12345678",
          email: null,
          name: null,
          profileImage: null,
        });
      });
    });
  });

  describe("OAuthError", () => {
    it("toJSON() 메서드로 직렬화할 수 있다", () => {
      const error = new OAuthError("토큰 교환 실패", {
        code: "TOKEN_EXCHANGE_FAILED",
        provider: "google",
        httpStatus: 400,
        httpStatusText: "Bad Request",
        requestUrl: "https://oauth2.googleapis.com/token",
      });

      const json = error.toJSON();

      expect(json).toEqual({
        message: "토큰 교환 실패",
        code: "TOKEN_EXCHANGE_FAILED",
        provider: "google",
        httpStatus: 400,
        httpStatusText: "Bad Request",
        requestUrl: "https://oauth2.googleapis.com/token",
      });
    });

    it("Error를 상속한다", () => {
      const error = new OAuthError("테스트 에러", {
        code: "INVALID_CONFIGURATION",
        provider: "kakao",
      });

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe("OAuthError");
    });

    it("originalError를 저장한다", () => {
      const originalError = new Error("Original error");
      const error = new OAuthError("래핑된 에러", {
        code: "NETWORK_ERROR",
        provider: "google",
        originalError,
      });

      expect(error.originalError).toBe(originalError);
    });
  });
});
