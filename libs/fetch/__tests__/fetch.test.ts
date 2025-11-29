import { getFetch, postFetch, putFetch, deleteFetch, FetchError } from "../";

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
  } as unknown as Response;
};

describe("fetch module", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    delete process.env.NEXT_PUBLIC_API_URL;
  });

  describe("getFetch", () => {
    it("성공적인 GET 요청을 처리한다", async () => {
      const mockData = { id: 1, name: "test" };
      mockFetch.mockResolvedValue(createMockResponse(mockData));

      const result = await getFetch<typeof mockData>("/api/users");

      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith("/api/users", {
        method: "GET",
        headers: undefined,
        cache: undefined,
        next: undefined,
      });
    });

    it("query 파라미터를 URL에 추가한다", async () => {
      mockFetch.mockResolvedValue(createMockResponse([]));

      await getFetch("/api/users", { query: { page: 1, limit: 10 } });

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/users?page=1&limit=10",
        expect.any(Object)
      );
    });

    it("undefined query 값은 제외한다", async () => {
      mockFetch.mockResolvedValue(createMockResponse([]));

      await getFetch("/api/users", {
        query: { page: 1, search: undefined },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/users?page=1",
        expect.any(Object)
      );
    });

    it("NEXT_PUBLIC_API_URL이 설정되면 절대 경로를 사용한다", async () => {
      process.env.NEXT_PUBLIC_API_URL = "https://api.example.com";
      mockFetch.mockResolvedValue(createMockResponse({}));

      await getFetch("/api/users");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/api/users",
        expect.any(Object)
      );
    });

    it("커스텀 헤더를 전달한다", async () => {
      mockFetch.mockResolvedValue(createMockResponse({}));

      await getFetch("/api/users", {
        headers: { Authorization: "Bearer token" },
      });

      expect(mockFetch).toHaveBeenCalledWith("/api/users", {
        method: "GET",
        headers: { Authorization: "Bearer token" },
        cache: undefined,
        next: undefined,
      });
    });

    it("Next.js 캐시 옵션을 전달한다", async () => {
      mockFetch.mockResolvedValue(createMockResponse({}));

      await getFetch("/api/users", {
        cache: "force-cache",
        next: { revalidate: 3600 },
      });

      expect(mockFetch).toHaveBeenCalledWith("/api/users", {
        method: "GET",
        headers: undefined,
        cache: "force-cache",
        next: { revalidate: 3600 },
      });
    });
  });

  describe("postFetch", () => {
    it("JSON body와 함께 POST 요청을 보낸다", async () => {
      const mockData = { id: 1 };
      mockFetch.mockResolvedValue(createMockResponse(mockData));

      const result = await postFetch<typeof mockData>("/api/users", {
        body: { name: "test", email: "test@example.com" },
      });

      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "test", email: "test@example.com" }),
        cache: undefined,
        next: undefined,
      });
    });

    it("body 없이 POST 요청을 보낼 수 있다", async () => {
      mockFetch.mockResolvedValue(createMockResponse({}));

      await postFetch("/api/trigger");

      expect(mockFetch).toHaveBeenCalledWith("/api/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: undefined,
        cache: undefined,
        next: undefined,
      });
    });
  });

  describe("putFetch", () => {
    it("PUT 요청을 처리한다", async () => {
      mockFetch.mockResolvedValue(createMockResponse({ updated: true }));

      await putFetch("/api/users/1", { body: { name: "updated" } });

      expect(mockFetch).toHaveBeenCalledWith("/api/users/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "updated" }),
        cache: undefined,
        next: undefined,
      });
    });
  });

  describe("deleteFetch", () => {
    it("DELETE 요청을 처리한다", async () => {
      mockFetch.mockResolvedValue(
        createMockResponse(null, { status: 204, ok: true })
      );

      const result = await deleteFetch("/api/users/1");

      expect(result).toBeUndefined();
      expect(mockFetch).toHaveBeenCalledWith("/api/users/1", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: undefined,
        cache: undefined,
        next: undefined,
      });
    });
  });

  describe("에러 처리", () => {
    it("4xx 에러 시 FetchError를 throw한다", async () => {
      mockFetch.mockResolvedValue(
        createMockResponse(
          { message: "User not found" },
          { status: 404, statusText: "Not Found", ok: false }
        )
      );

      await expect(getFetch("/api/users/999")).rejects.toThrow(FetchError);

      try {
        await getFetch("/api/users/999");
      } catch (error) {
        expect(error).toBeInstanceOf(FetchError);
        const fetchError = error as FetchError;
        expect(fetchError.status).toBe(404);
        expect(fetchError.method).toBe("GET");
        expect(fetchError.url).toBe("/api/users/999");
        expect(fetchError.message).toContain("User not found");
      }
    });

    it("5xx 에러 시 FetchError를 throw한다", async () => {
      mockFetch.mockResolvedValue(
        createMockResponse(
          { error: "Internal server error" },
          { status: 500, statusText: "Internal Server Error", ok: false }
        )
      );

      await expect(getFetch("/api/users")).rejects.toThrow(FetchError);
    });

    it("응답 body가 JSON이 아닌 경우 statusText를 사용한다", async () => {
      const response = {
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
      } as unknown as Response;
      mockFetch.mockResolvedValue(response);

      try {
        await getFetch("/api/users");
      } catch (error) {
        const fetchError = error as FetchError;
        expect(fetchError.message).toContain("Internal Server Error");
      }
    });
  });

  describe("FetchError", () => {
    it("toJSON() 메서드로 직렬화할 수 있다", () => {
      const error = new FetchError({
        method: "GET",
        url: "/api/users",
        status: 404,
        statusText: "Not Found",
        message: "User not found",
      });

      const json = error.toJSON();

      expect(json).toEqual({
        method: "GET",
        url: "/api/users",
        status: 404,
        statusText: "Not Found",
        message: "User not found",
      });
    });

    it("Error를 상속한다", () => {
      const error = new FetchError({
        method: "GET",
        url: "/api/users",
        status: 404,
        statusText: "Not Found",
        message: "User not found",
      });

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe("FetchError");
    });
  });

  describe("204 No Content 처리", () => {
    it("204 응답 시 undefined를 반환한다", async () => {
      mockFetch.mockResolvedValue(
        createMockResponse(null, { status: 204, ok: true })
      );

      const result = await getFetch("/api/users/1/read");

      expect(result).toBeUndefined();
    });
  });
});
