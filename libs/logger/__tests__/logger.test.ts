const getFirstCallOutput = (mockFn: jest.Mock): string => {
  const [[output]] = mockFn.mock.calls;
  return output;
};

describe("logger module", () => {
  const originalEnv = process.env.NODE_ENV;

  const setNodeEnv = (env: string) => {
    Object.defineProperty(process.env, "NODE_ENV", {
      value: env,
      writable: true,
      configurable: true,
    });
  };

  beforeEach(() => {
    jest.resetModules();
    jest.spyOn(console, "debug").mockImplementation(() => {});
    jest.spyOn(console, "info").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    setNodeEnv(originalEnv ?? "test");
  });

  describe("createLogger", () => {
    it("기본 로거를 생성한다", async () => {
      const { createLogger } = await import("../core");
      const log = createLogger();

      expect(log).toHaveProperty("debug");
      expect(log).toHaveProperty("info");
      expect(log).toHaveProperty("warn");
      expect(log).toHaveProperty("error");
    });

    it("debug 로그를 출력한다", async () => {
      setNodeEnv("development");
      const { createLogger } = await import("../core");
      const log = createLogger();

      log.debug("테스트 메시지");

      expect(console.debug).toHaveBeenCalled();
      const output = getFirstCallOutput(console.debug as jest.Mock);
      expect(output).toContain("[DEBUG]");
      expect(output).toContain("테스트 메시지");
    });

    it("info 로그를 출력한다", async () => {
      const { createLogger } = await import("../core");
      const log = createLogger();

      log.info("정보 메시지");

      expect(console.info).toHaveBeenCalled();
      const output = getFirstCallOutput(console.info as jest.Mock);
      expect(output).toContain("[INFO]");
      expect(output).toContain("정보 메시지");
    });

    it("warn 로그를 출력한다", async () => {
      const { createLogger } = await import("../core");
      const log = createLogger();

      log.warn("경고 메시지");

      expect(console.warn).toHaveBeenCalled();
      const output = getFirstCallOutput(console.warn as jest.Mock);
      expect(output).toContain("[WARN]");
      expect(output).toContain("경고 메시지");
    });

    it("error 로그를 출력한다", async () => {
      const { createLogger } = await import("../core");
      const log = createLogger();
      const error = new Error("테스트 에러");

      log.error("에러 메시지", error);

      expect(console.error).toHaveBeenCalled();
      const output = getFirstCallOutput(console.error as jest.Mock);
      expect(output).toContain("[ERROR]");
      expect(output).toContain("에러 메시지");
      expect(output).toContain("테스트 에러");
    });

    it("기본 컨텍스트를 모든 로그에 포함한다", async () => {
      const { createLogger } = await import("../core");
      const log = createLogger({ source: "test-module" });

      log.info("테스트");

      const output = getFirstCallOutput(console.info as jest.Mock);
      expect(output).toContain("(test-module)");
    });

    it("추가 컨텍스트를 로그에 포함한다", async () => {
      const { createLogger } = await import("../core");
      const log = createLogger();

      log.info("사용자 로그인", { userId: "123", action: "login" });

      const output = getFirstCallOutput(console.info as jest.Mock);
      expect(output).toContain("Context:");
      expect(output).toContain("userId");
      expect(output).toContain("123");
    });
  });

  describe("민감 정보 마스킹", () => {
    it("password 키를 마스킹한다", async () => {
      const { createLogger } = await import("../core");
      const log = createLogger();

      log.info("로그인 시도", { password: "secret123" });

      const output = getFirstCallOutput(console.info as jest.Mock);
      expect(output).not.toContain("secret123");
      expect(output).toContain("[REDACTED]");
    });

    it("token 키를 마스킹한다", async () => {
      const { createLogger } = await import("../core");
      const log = createLogger();

      log.info("API 호출", { accessToken: "abc123" });

      const output = getFirstCallOutput(console.info as jest.Mock);
      expect(output).not.toContain("abc123");
      expect(output).toContain("[REDACTED]");
    });

    it("secret 키를 마스킹한다", async () => {
      const { createLogger } = await import("../core");
      const log = createLogger();

      log.info("설정", { clientSecret: "xyz789" });

      const output = getFirstCallOutput(console.info as jest.Mock);
      expect(output).not.toContain("xyz789");
      expect(output).toContain("[REDACTED]");
    });

    it("authorization 키를 마스킹한다", async () => {
      const { createLogger } = await import("../core");
      const log = createLogger();

      log.info("요청", { authorization: "Bearer token" });

      const output = getFirstCallOutput(console.info as jest.Mock);
      expect(output).not.toContain("Bearer token");
      expect(output).toContain("[REDACTED]");
    });

    it("key 키를 마스킹한다", async () => {
      const { createLogger } = await import("../core");
      const log = createLogger();

      log.info("API 호출", { apiKey: "my-api-key" });

      const output = getFirstCallOutput(console.info as jest.Mock);
      expect(output).not.toContain("my-api-key");
      expect(output).toContain("[REDACTED]");
    });
  });

  describe("로그 레벨 필터링", () => {
    it("production 환경에서 debug 로그를 출력하지 않는다", async () => {
      setNodeEnv("production");
      const { createLogger } = await import("../core");
      const log = createLogger();

      log.debug("디버그 메시지");

      expect(console.debug).not.toHaveBeenCalled();
    });

    it("production 환경에서 info 이상 로그는 출력한다", async () => {
      setNodeEnv("production");
      const { createLogger } = await import("../core");
      const log = createLogger();

      log.info("정보");
      log.warn("경고");
      log.error("에러", new Error("test"));

      expect(console.info).toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });

    it("development 환경에서 모든 로그를 출력한다", async () => {
      setNodeEnv("development");
      const { createLogger } = await import("../core");
      const log = createLogger();

      log.debug("디버그");
      log.info("정보");

      expect(console.debug).toHaveBeenCalled();
      expect(console.info).toHaveBeenCalled();
    });
  });

  describe("순환 참조 처리", () => {
    it("순환 참조가 있는 컨텍스트를 안전하게 처리한다", async () => {
      const { createLogger } = await import("../core");
      const log = createLogger();
      const circular: Record<string, unknown> = { name: "test" };
      circular.self = circular;

      expect(() => {
        log.info("순환 참조 테스트", circular);
      }).not.toThrow();

      const output = getFirstCallOutput(console.info as jest.Mock);
      expect(output).toContain("[Unserializable context]");
    });
  });

  describe("기본 logger 인스턴스", () => {
    it("logger가 export 되어 있다", async () => {
      const { logger } = await import("../core");
      expect(logger).toBeDefined();
      expect(logger.info).toBeDefined();
    });
  });

  describe("serverLogger", () => {
    it("source가 server로 설정되어 있다", async () => {
      const { serverLogger } = await import("../server");

      serverLogger.info("서버 로그");

      const output = getFirstCallOutput(console.info as jest.Mock);
      expect(output).toContain("(server)");
    });
  });

  describe("logApiRequest", () => {
    it("API 요청을 로깅한다", async () => {
      const { logApiRequest } = await import("../server");

      logApiRequest("GET", "/api/users");

      expect(console.info).toHaveBeenCalled();
      const output = getFirstCallOutput(console.info as jest.Mock);
      expect(output).toContain("GET /api/users");
      expect(output).toContain("(api)");
    });

    it("추가 컨텍스트를 포함한다", async () => {
      const { logApiRequest } = await import("../server");

      logApiRequest("POST", "/api/users", { userId: "123" });

      const output = getFirstCallOutput(console.info as jest.Mock);
      expect(output).toContain("userId");
    });
  });

  describe("logApiResponse", () => {
    it("2xx 응답을 info 레벨로 로깅한다", async () => {
      const { logApiResponse } = await import("../server");

      logApiResponse("GET", "/api/users", 200, 150);

      expect(console.info).toHaveBeenCalled();
      const output = getFirstCallOutput(console.info as jest.Mock);
      expect(output).toContain("GET /api/users 200 (150ms)");
    });

    it("4xx 응답을 warn 레벨로 로깅한다", async () => {
      const { logApiResponse } = await import("../server");

      logApiResponse("GET", "/api/users/999", 404, 50);

      expect(console.warn).toHaveBeenCalled();
      const output = getFirstCallOutput(console.warn as jest.Mock);
      expect(output).toContain("404");
    });

    it("5xx 응답을 error 레벨로 로깅한다", async () => {
      const { logApiResponse } = await import("../server");

      logApiResponse("POST", "/api/users", 500, 200);

      expect(console.error).toHaveBeenCalled();
      const output = getFirstCallOutput(console.error as jest.Mock);
      expect(output).toContain("500");
    });
  });

  describe("logApiError", () => {
    it("API 에러를 로깅한다", async () => {
      const { logApiError } = await import("../server");
      const error = new Error("Connection refused");

      logApiError("GET", "/api/external", error);

      expect(console.error).toHaveBeenCalled();
      const output = getFirstCallOutput(console.error as jest.Mock);
      expect(output).toContain("GET /api/external failed");
      expect(output).toContain("Connection refused");
    });
  });
});
