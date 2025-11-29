# Fetch 모듈 컨텍스트

이 문서는 AI가 fetch 모듈의 설계 의도와 사용 방법을 빠르게 파악할 수 있도록 작성되었습니다.

## 이 모듈이 하는 일

HTTP 요청을 위한 타입 안전한 fetch 래퍼를 제공합니다.

## 파일 구조와 역할

- `types.ts`: FetchOptions, GetOptions, MutationOptions 타입 및 FetchError 클래스 정의
- `core.ts`: getFetch, postFetch, putFetch, deleteFetch 구현 및 내부 유틸 함수
- `index.ts`: 외부 export (함수 4개, 클래스 1개, 타입 3개)

## 핵심 설계 결정

1. **제네릭 응답 타입**: `getFetch<User>(...)` 형태로 응답 타입을 지정합니다.

2. **객체 기반 옵션**: 모든 메서드는 path와 options 객체를 받습니다. query와 body 모두 객체로 전달합니다.

3. **FetchError 클래스**: 에러 발생 시 method, url, status, statusText, message를 포함합니다. `toJSON()` 메서드로 직렬화 가능합니다. 에러 메시지 형식: `[GET] /api/users failed (404): User not found`

4. **환경변수 기반 baseURL**: NEXT_PUBLIC_API_URL 환경변수를 사용합니다. 설정하지 않으면 상대 경로로 동작합니다.

5. **query 파라미터 자동 처리**: undefined 값은 자동으로 제외됩니다.

6. **Next.js 캐싱 지원**: `cache`와 `next` 옵션을 통해 Next.js의 fetch 캐싱 기능을 사용할 수 있습니다.

7. **204 No Content 처리**: 응답 상태가 204인 경우 undefined를 반환합니다.

8. **팩토리 패턴**: POST, PUT, DELETE는 `createFetcher` 팩토리로 생성됩니다. GET만 별도 구현 (body 없음).

## 사용 패턴

```typescript
import { getFetch, postFetch, FetchError } from "@/libs/fetch";

// GET 요청
const users = await getFetch<User[]>("/api/users", {
  query: { page: 1, limit: 10 },
});

// POST 요청
const newUser = await postFetch<User>("/api/users", {
  body: { name: "홍길동", email: "hong@example.com" },
});

// Next.js 캐싱 옵션
const data = await getFetch<Data>("/api/data", {
  cache: "force-cache",
  next: { revalidate: 3600 },
});

// 에러 처리
try {
  await getFetch("/api/users/999");
} catch (error) {
  if (error instanceof FetchError) {
    console.error(error.message); // [GET] /api/users/999 failed (404): User not found
    console.error(error.status); // 404
  }
}
```

## 확장 시 고려사항

인증 토큰 자동 첨부가 필요하면 core.ts의 각 함수에서 headers에 Authorization을 추가하거나, 별도의 authFetch 래퍼를 만들면 됩니다.
